# bookinghealthcare

An online healthcare appointment booking system that helps patients easily schedule appointments with doctors and manage their health information.

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://bookinghealthcare.vercel.app)
[![GitHub](https://img.shields.io/badge/github-repository-blue.svg)](https://github.com/nguyenhongan15/bookinghealthcare)

## 📋 Overview

Booking Healthcare is a comprehensive healthcare appointment platform that allows:
- Patients to search for doctors and book appointments
- Doctors to manage schedules and appointments
- Administrators to monitor and manage the entire system

## ✨ Main Features

### For Patients
- 🔍 Search doctors by specialty and location
- 📅 Book appointments online
- 📝 Manage personal medical records
- 🔔 Receive appointment notifications

### For Doctors
- 📊 Manage work schedules
- 👥 View patient lists
- 📋 Update medical examination information
- ⏰ Manage consultation time

### For Administrators
- 👨‍⚕️ Manage doctor accounts
- 👤 Manage users
- 📈 View statistics and reports
- ⚙️ Configure system settings

## 🛠️ Technologies Used

### Frontend
- **JavaScript** - Main programming language
- **React.js** - UI development library
- **CSS** - Styling and responsive design
- **HTML** - Web page structure

### Backend
- **Java** - Main backend programming language
- **Spring Boot** (planned) - Java framework
- **RESTful API** - Client-server communication

### Database
- **MySQL/PostgreSQL** (planned) - Relational database system

### Deployment
- **Vercel** - Frontend hosting
- **Render/Railway** (planned) - Backend hosting

## 📂 Project Structure

```text
bookinghealthcare/
│
├── frontend/           # Frontend source code (React)
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/            # Backend source code (Java/Spring Boot)
│   ├── src/
│   ├── pom.xml
│   └── application.properties
│
├── docs/               # Project documentation
│
├── images/             # Images and assets
│
└── README.md           # This file

🚀 Installation Guide
System Requirements
- Node.js (v14 trở lên)
- Java JDK (v11 trở lên)
- Maven hoặc Gradle
- MySQL/PostgreSQL
- Git

### Frontend Setup

```bash
# Clone repository
git clone https://github.com/nguyenhongan15/bookinghealthcare.git

# Navigate to frontend directory
cd bookinghealthcare/frontend

# Install dependencies
npm install

# Run development server
npm start
```

Frontend will run at `http://localhost:3000`

### Backend Setup

```bash
# Navigate to backend directory
cd bookinghealthcare/backend

# Install dependencies with Maven
mvn clean install

# Run application
mvn spring-boot:run
```

Backend will run at `http://localhost:8080`

### Database Configuration

1. Create new database:
```sql
CREATE DATABASE bookinghealthcare;
```

2. Update database connection information in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bookinghealthcare
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## 🔧 Environment Variables

Create a .env file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_API_TIMEOUT=10000
```

Create a .env file in the backend directory (if needed):

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=bookinghealthcare
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
```
📖 API Documentation
Main Endpoints
 Authentication
  - POST /api/auth/register - Register a new account  
  - POST /api/auth/login - Login
  - POST /api/auth/logout - Logout
 Users
  - GET /api/users/profile - Get user profile
  - PUT /api/users/profile - Update profile
  - GET /api/users/doctors - Get doctor list
 Appointments
  - GET /api/appointments - Get appointment list
  - POST /api/appointments - Create a new appointment
  - PUT /api/appointments/:id - Update appointment
  - DELETE /api/appointments/:id - Cancel appointment
🧪 Testing
Frontend Testing
  cd frontend
  npm test
Backend Testing
  cd backend
  mvn test


👨‍💻 Author
Nguyen Hong An - [@nguyenhongan15](https://github.com/nguyenhongan15)


- Project Link: [https://github.com/nguyenhongan15/bookinghealthcare](https://github.com/nguyenhongan15/bookinghealthcare)
- Live Demo: [https://bookinghealthcare.vercel.app](https://bookinghealthcare.vercel.app)


