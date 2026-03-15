# Smart Health Monitoring System 🏥

A modern, real-time health monitoring platform that connects **Patients** with **Caretakers**. The system allows patients to log their vital signs (temperature, heartbeat, sugar level, etc.) and provides caretakers with a comprehensive dashboard to monitor health trends, manage prescriptions, and receive emergency alerts.

---

## ✨ Features

- **Real-time Monitoring**: Track temperature, pulse, sugar levels, and BP.
- **Caretaker Dashboard**: Full analytics and management for healthcare providers.
- **Emergency Alerts**: Automatic email notifications for abnormal vital signs.
- **Smart Reminders**: Automated medicine schedules with push and email notifications.
- **Modern UI**: Sleek, responsive design built with React, Tailwind CSS, and Framer Motion.
- **Secure Access**: Role-based authentication and account approval system.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/try/download/community) (Running locally on default port 27017)

---

### 📦 Installation

#### 1. Clone the repository
```bash
git clone https://github.com/punamchanne/health-monitoring-system.git
cd health-monitoring-system
```

#### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder and add:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/health-monitoring
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

#### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

---

### 🛠️ Running the Application

To run the project, you need to start both the backend and frontend servers.

#### **Step 1: Start Backend**
```bash
# In the /backend directory
npm run dev
```

#### **Step 2: Seed Database (Optional - To create default accounts)**
```bash
# In the /backend directory
node seed.js
```

#### **Step 3: Start Frontend**
```bash
# In the /frontend directory
npm run dev
```

---

### 📧 Default Credentials (After Seeding)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Caretaker** | `caretaker@health.com` | `password123` |
| **Patient** | `patient@health.com` | `password123` (Manual Register) |

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Lucide Icons, Framer Motion, Chart.js
- **Backend**: Node.js, Express.js, MongoDB + Mongoose
- **Others**: JSON Web Tokens (JWT), Nodemailer, Node-cron

---

## 📝 License

This project is licensed under the MIT License.
