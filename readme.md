# 🚆 TripSure – AI-Powered Train Ticket Booking System

<div align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-AI%20Service-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-BullMQ-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styled-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

### Intelligent Train Booking with AI-Powered Ticket Confirmation Prediction

Search • Book • Predict • Manage

</div>

---

##  📖 Overview

**TripSure** is a modern full-stack train ticket booking platform that combines a powerful booking system with Machine Learning to help users make smarter booking decisions.

Unlike traditional booking platforms, TripSure predicts the probability of ticket confirmation before booking using an AI model served through FastAPI.

The project follows a microservice architecture where the booking system and AI prediction service work independently while communicating through REST APIs.

---

# ✨ Features

## 👤 Authentication

- Secure JWT Authentication
- User Registration & Login
- Protected Routes
- Session Management

---

## 🚆 Train Booking

- Search trains between stations
- View available trains
- Seat availability
- Multiple travel classes
- Multiple booking quotas
- Fare calculation
- Book train tickets
- Cancel bookings
- Booking history

---

## 🤖 AI Ticket Confirmation Prediction

Get ticket confirmation probability before booking.

The prediction model considers:

- Available Seats
- Waiting List Position
- Current Booking Status
- Coach/Class
- Booking Quota
- Train Category

Example Prediction

| Prediction | Probability |
|------------|------------:|
| Confirmation Chance | **91%** |
| Risk Level | **Very High** |

---

## 🎨 User Experience

- Modern Responsive UI
- Dark / Light Theme
- Interactive Cards
- Real-time Validation
- Smooth Navigation
- Mobile Friendly Design

---

# 🏗️ System Architecture

```text
                     React Frontend
                           │
                  REST API Requests
                           │
                    Express.js Server
                 ┌─────────┴─────────┐
                 │                   │
          PostgreSQL Database   FastAPI AI Service
                 │                   │
          Booking Data         ML Prediction Model
                 │                   │
                 └─────────► Prediction Response
```

---

# 🛠️ Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- Axios
- Lucide React

---

## Backend

- Node.js
- Express.js
- Sequelize ORM
- JWT Authentication
- REST APIs

---

## AI Service

- FastAPI
- Scikit-learn
- Pandas
- NumPy
- Joblib

---

## Database

- PostgreSQL

---

## Queue & Caching

- Redis
- BullMQ

---

# 📂 Project Structure

```text
TripSure
│
├── client
│   ├── src
│   ├── components
│   ├── pages
│   ├── hooks
│   └── services
│
├── server
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── migrations
│   └── seeders
│
├── ai_service
│   ├── main.py
│   ├── model
│   └── prediction
│
└── README.md
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/yourusername/tripsure.git

cd tripsure
```

---

## Backend Setup

```bash
cd server

npm install

npm run dev
```

---

## Frontend Setup

```bash
cd client

npm install

npm run dev
```

---

## AI Service Setup

```bash
cd ai_service

pip install -r requirements.txt

uvicorn main:app --reload
```

---

# ⚙️ Environment Variables

## Backend

```env
PORT=

DATABASE_URL=

JWT_SECRET=

CLIENT_URL=

REDIS_URL=
```

---

## AI Service

```env
MODEL_PATH=

FEATURE_PATH=
```

---

# 🔄 Application Workflow

```text
User Searches Train
          │
          ▼
Available Trains Displayed
          │
          ▼
User Selects Journey
          │
          ▼
AI Prediction Requested
          │
          ▼
FastAPI Model Predicts
          │
          ▼
Confirmation Probability Returned
          │
          ▼
User Books Ticket
          │
          ▼
Booking Stored in PostgreSQL
```

---

# 📡 API Endpoints

## Authentication

```http
POST /api/auth/register

POST /api/auth/login
```

---

## Train

```http
GET /api/trains/search

GET /api/trains/:id
```

---

## Booking

```http
POST /api/bookings

DELETE /api/bookings/:id

GET /api/bookings/history
```

---

## AI Prediction

```http
POST /predict
```

---

# 📷 Screenshots

## 🏠 Home Page

> Add screenshot here

```
screenshots/home.png
```

---

## 🔍 Search Results

> Add screenshot here

```
screenshots/search.png
```

---

## 🤖 AI Prediction

> Add screenshot here

```
screenshots/prediction.png
```

---

## 🎫 Booking Page

> Add screenshot here

```
screenshots/booking.png
```

---

# 🎯 Future Enhancements

- 💳 Stripe Payment Integration
- 📍 Live Train Tracking
- 📧 Email Notifications
- 📱 SMS Alerts
- ⭐ Train Recommendation System
- 📈 Admin Dashboard
- 🐳 Docker Support
- ☁️ CI/CD Pipeline
- 📊 Analytics Dashboard

---

# 📚 Learning Outcomes

This project demonstrates experience with:

- Full Stack Web Development
- REST API Design
- PostgreSQL Database Design
- Authentication using JWT
- Machine Learning Model Integration
- FastAPI Microservices
- Redis Queue Management
- Responsive UI Development
- AI Model Deployment
- Modern React Development

---

# 🤝 Contributing

Contributions, issues, and feature requests are welcome.

If you would like to contribute:

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

# 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

## ⭐ If you like this project, consider giving it a star!

Made with ❤️ by **Sonika Singh Tomar**

</div>