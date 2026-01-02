# 🩸 Blood Donation Application - Frontend

A modern and responsive Blood Donation Application built with the MERN Stack.  
This platform connects blood donors with recipients efficiently through donation requests, donor search, role-based dashboards, and funding support.

---

## 🌐 Live Website

👉 Live Link: https://lifelink-client.vercel.app/

---

## Project Purpose

The purpose of this application is to simplify the blood donation process by creating a centralized platform where:

- Donors can register and manage donation requests
- Recipients can find blood donors easily
- Volunteers can manage donation requests
- Admins can control users, content, and donation activities

The application focuses on usability, responsiveness, secure authentication, and role-based access control.

---

## Key Features

### Authentication
- Email & Password Authentication
- JWT/Firebase Protected Routes
- Role-Based Dashboard Access
- Persistent Login System

### User Features
- Register as Blood Donor
- Update User Profile
- Search Donors by Blood Group & Location
- Create Blood Donation Requests
- Manage Personal Donation Requests
- Donate Blood to Recipients

### Donation System
- Pending / In Progress / Done / Canceled Status
- Donation Request Details Page
- Responsive Request Management Table
- Filtering & Pagination Support

### Admin Features
- Manage All Users
- Block / Unblock Users
- Make Volunteer / Admin
- Manage All Donation Requests
- Dashboard Statistics

###  Volunteer Features
- View All Donation Requests
- Update Donation Status

### Funding System
- Stripe Payment Integration
- Funding Management
- Total Funding Statistics

### UI/UX
- Fully Responsive Design
- Mobile Friendly Dashboard
- Modern Blood Donation Theme
- Reusable Components
- Framer Motion Animations

---

## Technologies Used

### Frontend
- React.js
- React Router DOM
- Tailwind CSS
- DaisyUI
- Axios
- Firebase Authentication
- TanStack Query
- React Hook Form
- Framer Motion
- SweetAlert2
- React Icons
- Stripe

---

##  Folder Structure

```bash
src/
│
├── components/
├── pages/
├── layouts/
├── routes/
├── hooks/
├── api/
├── providers/
├── context/
├── firebase/
├── utils/
└── assets/
```

---

## Environment Variables

Create a `.env.local` file in the root directory and add:

```env
VITE_API_URL=your_server_url

VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_IMGBB_API_KEY=your_imgbb_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

---

## Installation & Setup

### Clone the repository

```bash
git clone https://github.com/your-username/blood-donation-client.git
```

### Navigate to project

```bash
cd blood-donation-client
```

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

---

## Responsive Design

The application is optimized for:

- Mobile Devices
- Tablets
- Desktop Screens

---

## Security Features

- Protected Routes
- JWT Authorization
- Firebase Authentication
- Secure Environment Variables
- Role-Based Access Control

---

## Core Pages

- Home Page
- Login & Register
- Search Donors
- Donation Requests
- Dashboard
- Profile Page
- Funding Page
- Admin Management Pages

---

## Future Improvements

- Real-Time Notifications
- Email Verification
- Live Chat System
- Blood Request Analytics
- PDF Export Feature

---

## Developer

Developed by Ahmed

---

## 📄 License

This project is licensed for educational and portfolio purposes.