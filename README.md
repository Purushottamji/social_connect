# VibeMesh - Social Connect API 🚀

A robust, production-ready RESTful API built to power the **VibeMesh** social media mobile application. This backend handles user authentication, complex feed lifecycles, and social interactions, featuring an automated cloud architecture with custom DevOps pipelines.

---

## 🛠️ Tech Stack & Architecture

- **Runtime Environment:** Node.js
- **Backend Framework:** Express.js
- **Database Framework:** MySQL with Sequelize ORM
- **Cloud Hosting & Database:** Aiven
- **Deployment Platform:** Render (Zero-Downtime Deployment)
- **DevOps / CI-CD:** GitHub Actions & Render Deploy Webhooks

---

## ✨ Features Implemented

- **User Management:** Secure user registration, authentication, and personalized profile handling.
- **Social Interactions:** Full implementation of user connection lifecycles including Follow/Unfollow systems.
- **Dynamic Social Feed:** Optimized query handling to fetch, display, and manage real-time post feeds with likes and comments.
- **Relational Database Mapping:** Clean and scalable database schema managed via Sequelize ORM for efficient MySQL transactions.

---

## 🤖 DevOps & Automated CI/CD Pipeline

This project utilizes an industry-standard continuous integration and deployment workflow to guarantee zero-downtime and safe server updates:

1.  **Continuous Integration (CI):** On every `git push` to the main branch, a **GitHub Actions** runner initializes an isolated Ubuntu environment, installs project dependencies (`npm install`), and verifies application integrity.
2.  **Continuous Deployment (CD):** Platform default auto-deployment has been disabled to prevent faulty builds from breaking production. Instead, Render triggers a live deployment via a secure **Deploy Webhook** _only_ after GitHub Actions successfully completes all verification checks with a green tick (✅).

---

## 🚀 Getting Started (Local Setup)

To run this backend project locally on your machine, follow these simple steps:

### 1. Prerequisites

Make sure you have **Node.js** and **MySQL** installed on your system.

### 2. Clone the Repository

```bash
git clone [https://github.com/Purushottamji/social-connect-api.git](https://github.com/Purushottamji/social-connect-api.git)

cd social-connect-api
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Environment Variables Configuration

#### .env

```bash
PORT=3000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=vibemesh_db
JWT_SECRET=your_super_secret_key
```

### 5. Run the Server

```bash
# Run in production mode
npm start

# Run in development mode (with nodemon)
npm run dev
```

## 📁 Project Structure Highlights

```bash
├── config/          # Database connection configurations
├── controllers/     # Business logic handlers for endpoints
├── models/          # Sequelize/MySQL database schemas
├── routes/          # Express API route declarations
├── .github/
│   └── workflows/   # GitHub Actions CI/CD configuration (deploy.yml)
├── .env.example     # Template for environment variables
├── server.js        # Application entry point
└── package.json     # Project dependencies and scripts
```

## 🤝 Connect with Me

- Developer: Purushottam Kumar

- Email: purushottam.tech01@gmail.com

- GitHub: github.com/Purushottamji

- LinkedIn: linkedin.com/in/purushottamkumar01
