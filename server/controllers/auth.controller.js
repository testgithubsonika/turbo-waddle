const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const User = db.User;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send({ message: 'Name, email, and password are required.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).send({ message: 'Email already in use.' });
    }

    const user = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, 8),
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.status(201).send({
      message: 'User registered successfully!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).send({ message: error.message || 'Signup failed.' });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }

    if (!user.password) {
      return res.status(401).send({
        message: 'This account uses Google Sign-In. Please use Google to login.',
      });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({ message: 'Invalid password.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.status(200).send({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    console.error('Signin Error:', error);
    res.status(500).send({ message: error.message || 'Signin failed.' });
  }
};

exports.googleSignIn = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).send({ message: 'Google token is required.' });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).send({ message: 'Google account email is required.' });
    }

    // Find or create user
    let user = await User.findOne({
      where: { email }
    });

    if (!user) {
      user = await User.create({
        name: name || 'Google User',
        email,
        google_id: googleId,
        avatar_url: picture,
        password: null,
      });
    } else if (!user.google_id) {
      // Link Google account to existing user
      await user.update({
        google_id: googleId,
        avatar_url: picture,
      });
    }

    // Generate your own JWT
    const appToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).send({
      token: appToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
      }
    });

  } catch (error) {
    console.error('Google Sign-In Error:', error.message);
    res.status(401).send({ message: 'Invalid Google token.' });
  }
};