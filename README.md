# MERN Product Management Application

A high-performance, full-stack **MERN** (MongoDB, Express, React, Node.js) web application designed for seamless product management. This project implements secure authentication, email verification, and cloud-based image handling with a focus on modern UI/UX and robust backend architecture.

---

## Project Overview

This application serves as a comprehensive solution for managing inventory. Users can securely register, verify their identity via email, and perform advanced CRUD operations on products—including a "Soft Delete" system with a functional trash bin.



[Image of MERN stack architecture diagram]


---

## Technology Stack

### **Frontend (Client)**
* **React & Vite** – Fast, component-based UI development and build tool.
* **Tailwind CSS** – Modern, utility-first styling for a responsive design.
* **Axios** – Promise-based HTTP client for seamless API interaction.
* **React Router DOM** – Declarative routing for SPA navigation.
* **React Toastify** – Interactive notifications for success and error states.

### **Backend (Server)**
* **Node.js & Express.js** – Scalable RESTful API architecture.
* **MongoDB & Mongoose** – NoSQL database with elegant schema modeling.
* **Cloudinary** – Cloud-based storage for product images and profile pictures.
* **Nodemailer** – Automated email delivery system for account verification.

### **Security & Utilities**
* **JWT (JSON Web Tokens)** – Secure Access & Refresh token implementation.
* **bcryptjs** – Industry-standard password hashing.
* **Multer** – Middleware for handling `multipart/form-data` (file uploads).

---

## Key Features

### Authentication & Security
* **Secure Onboarding:** User registration with name, email, and encrypted passwords.
* **Email Verification:** Mandatory account activation via unique email links sent to the user.
* **Advanced JWT Logic:** Persistent sessions using Access and Refresh tokens.
* **Protected Routes:** Restricted access to sensitive dashboard and management features.

### Product Management (CRUD)
* **Full CRUD Lifecycle:** Create, Read, Update, and Delete products with ease.
* **Soft Delete System:** Move items to a "Trash" folder to prevent accidental permanent data loss.
* **Restore Capability:** Easily recover items from the trash back to the main inventory.
* **Cloud Integration:** Automated image uploads and replacements via Cloudinary.

### User Profile
* **Account Dashboard:** View and manage personal account details.
* **Dynamic Avatars:** Upload and update profile pictures stored securely in the cloud.

---

# Getting Started

### **Prerequisites**
* **Node.js** (v16.x or higher)
* **MongoDB** (Local instance or MongoDB Atlas)
* **Cloudinary Account** (For image hosting)
* **SMTP Credentials** (Gmail App Password or similar for Nodemailer)

### **Installation**

1. **Clone the repository:**
   
   git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
   cd your-repo-name

  2. **Install Backend Dependencies:**
 
   cd server
   npm install

## **Environment Variables**

Create a `.env` file in the `/server` directory and provide the following credentials:

env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:5173

## Application Flow

1. **Registration:** User signs up; an email is dispatched via Nodemailer.
2. **Verification:** User clicks the link, updating their status in MongoDB.
3. **Authentication:** User logs in to receive JWTs stored in secure cookies or local storage.
4. **Management:** Authenticated users gain access to Product CRUD and Trash features.

---

##  Use Cases
- **College Assignments:** Perfect for final year submissions.
- **Internship Projects:** Demonstrates full-stack proficiency to employers.
- **Portfolio Piece:** Showcases real-world skills like cloud storage and security.
- **MVP Foundation:** Can be scaled into a full-scale e-commerce or inventory system.

---

##  License
This project is open-source and intended for educational and learning purposes.
