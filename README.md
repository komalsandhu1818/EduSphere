# EduSphere

> A full-stack Learning Management System (LMS) for students and instructors.

EduSphere is a MERN-based learning platform where students can discover and enroll in courses, make online payments, consume course content, track learning progress, and submit ratings and reviews. Instructors can create, organize, publish, and manage courses through protected instructor workflows.

## ✨ Features

### 👨‍🎓 Student
- Sign up, login, email verification, and password reset
- Browse courses and course categories
- View detailed course information
- Add courses to cart and enroll using Razorpay
- Access enrolled course content
- Track course progress
- Rate and review courses
- Manage profile information

### 👨‍🏫 Instructor
- Protected instructor authentication
- Instructor dashboard
- Create and edit courses
- Create sections and subsections
- Upload course media through Cloudinary
- Publish and manage courses
- View course-related information

### ⚙️ Platform
- JWT authentication and role-based authorization
- MongoDB persistence with Mongoose
- REST API built with Express
- Cloudinary media storage
- Razorpay payment integration
- Email notifications through Nodemailer
- Redux Toolkit state management
- Responsive React + Tailwind CSS interface

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, React Router, Redux Toolkit, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| Payments | Razorpay |
| Media | Cloudinary, Express File Upload |
| Email | Nodemailer |
| UI/UX | React Icons, Swiper, React Hot Toast |

## 📁 Project Structure

```text
EduSphere/
├── public/                         # Static public assets
├── src/                            # React frontend
│   ├── assets/                     # Images, logos, videos, SVGs
│   ├── components/                 # Reusable UI components
│   │   ├── common/                 # Shared components
│   │   └── ContactPage/            # Contact page components
│   ├── data/                       # Static navigation/dashboard data
│   ├── hooks/                      # Custom React hooks
│   ├── pages/                      # Route-level pages
│   ├── reducer/                    # Redux root reducer
│   ├── services/                   # API connectors and operations
│   │   └── operations/             # Feature-specific API calls
│   ├── slices/                     # Redux Toolkit slices
│   ├── utils/                      # Frontend helper functions
│   ├── App.js                      # Main React app/router
│   ├── App.css
│   ├── index.js                    # Frontend entry point
│   └── index.css
├── server/                         # Node/Express backend
│   ├── config/                     # Database, Cloudinary, Razorpay config
│   ├── controllers/                # Request/business logic
│   ├── mail/                       # Email templates
│   ├── middlewares/                # Authentication middleware
│   ├── models/                     # Mongoose schemas/models
│   ├── routes/                     # REST API routes
│   ├── utils/                      # Backend helpers
│   ├── index.js                    # Backend entry point
│   ├── package.json
│   └── .env.example
├── .env.example                    # Frontend environment template
├── .gitignore
├── package.json
├── package-lock.json
├── tailwind.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Install:

- Node.js 18+ recommended
- npm
- MongoDB or a MongoDB Atlas database
- Cloudinary account
- Razorpay account (test mode is recommended for development)
- SMTP/email credentials

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/edusphere.git
cd edusphere
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd server
npm install
cd ..
```

### 4. Configure environment variables

Copy the templates:

```text
.env.example       → .env
server/.env.example → server/.env
```

Fill in the required values. Do not commit either `.env` file.

### Frontend `.env`

```env
REACT_APP_BASE_URL=http://localhost:4000/api/v1
```

### Backend `server/.env`

```env
RAZORPAY_KEY=your_key
RAZORPAY_SECRET=your_secret
JWT_SECRET=your_secret
FOLDER_NAME=your_cloudinary_folder
API_SECRET=your_cloudinary_api_secret
API_KEY=your_cloudinary_api_key
CLOUD_NAME=your_cloudinary_cloud_name
MONGODB_URL=your_mongodb_connection_string
PORT=4000
MAIL_HOST=your_smtp_host
MAIL_USER=your_email
MAIL_PASS=your_email_password
```

## ▶️ Run Locally

### Run frontend and backend together

From the project root:

```bash
npm run dev
```

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:4000
```

### Run separately

Frontend:

```bash
npm start
```

Backend:

```bash
cd server
npm run dev
```

## 🔌 API Routes

The backend currently groups APIs under:

```text
/api/v1/auth
/api/v1/profile
/api/v1/course
/api/v1/payment
```

The API handles authentication, profiles, courses, sections/subsections, course progress, ratings/reviews, and payments.

## 💳 Payment Flow

Razorpay is used for course purchases. In development, use Razorpay test credentials. The backend verifies the payment before completing enrollment.

## ☁️ Media Uploads

Course media is uploaded and managed using Cloudinary. Configure the Cloudinary credentials in `server/.env` before using instructor upload functionality.

## 🔐 Security Checklist

Before pushing or deploying:

- [ ] Remove all real `.env` files from the repository
- [ ] Confirm `git status` does not show secrets
- [ ] Never commit Razorpay, MongoDB, Cloudinary, JWT, or SMTP credentials
- [ ] Use test payment credentials during development
- [ ] Use a strong production JWT secret
- [ ] Update CORS for the production frontend domain
- [ ] Use HTTPS in production

## 📌 Future Improvements

- Course search and advanced filtering
- Wishlist functionality
- Course completion certificates
- Notifications
- Admin dashboard
- Improved instructor analytics
- Automated frontend/backend tests
- Production deployment and CI/CD configuration

## 👤 Author

**YOUR NAME**

GitHub: `https://github.com/YOUR_USERNAME`

## 📄 License

This project is intended for learning and portfolio use. Add an open-source license if you plan to distribute it publicly.
