const db = require('../models');
const bcrypt = require('bcryptjs');
const User = db.User;

// Fetch logged-in user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, phone, address, date_of_birth, avatar_url } = req.body;

    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).send({ message: 'User not found.' });

    await user.update({
      name: name || user.name,
      bio: bio || user.bio,
      phone: phone || user.phone,
      address: address || user.address,
      date_of_birth: date_of_birth || user.date_of_birth,
      avatar_url: avatar_url || user.avatar_url,
    });

    res.status(200).send({ message: 'Profile updated successfully.' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Change password (optional)
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(req.userId);

    if (!user) return res.status(404).send({ message: 'User not found.' });

    const isMatch = bcrypt.compareSync(oldPassword, user.password);
    if (!isMatch)
      return res.status(401).send({ message: 'Invalid current password.' });

    user.password = bcrypt.hashSync(newPassword, 8);
    await user.save();

    res.status(200).send({ message: 'Password updated successfully.' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete account (anonymize user data while preserving historical records)
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).send({ message: 'User not found.' });

    // Generate hashed placeholders for personal data
    const crypto = require('crypto');
    const hashPrefix = crypto.randomBytes(8).toString('hex').substring(0, 8);

    // Anonymize user data while keeping the record for foreign key integrity
    await user.update({
      name: `DeletedUser_${hashPrefix}`,
      email: `deleted_${hashPrefix}@anonymous.local`,
      bio: null,
      avatar_url: null,
      phone: null,
      address: null,
      date_of_birth: null,
      google_id: null,
      password: null, // Remove password so account can't be accessed
    });

    res.status(200).send({
      message: 'Account has been anonymized. All booking history is preserved but personal data has been removed.'
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
