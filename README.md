# Company-Grow

> A comprehensive employee development and management platform designed to streamline training, project assignment, and performance tracking with engaging gamification features.

## 📋 Overview

**Company-Grow** is an enterprise-grade web application that empowers companies to manage their workforce development efficiently. The platform combines modern learning management capabilities with project tracking and gamified engagement features to boost employee productivity and satisfaction.

### Key Features

- 🔐 **Secure Authentication**: JWT-based authentication system with role-based access control
- 👥 **User Roles**: Three-tier permission system (Employee, Manager, Admin)
- 📚 **Learning Management**: Create, manage, and track courses with enrollment and progress tracking
- 🎯 **Project Management**: Assign projects and monitor team deliverables
- 🏆 **Gamification**: Earn badges and points for achievements and milestones
- 💳 **Payment Integration**: Secure Stripe integration for bonuses and compensation
- 📊 **Advanced Analytics**: Comprehensive dashboards for performance insights and engagement metrics
- 📸 **Rich Media Support**: Cloudinary integration for image and file management

## 🚀 Tech Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: Context API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Payments**: Stripe API

## 📦 Project Structure

```
Company-Grow/
├── src/                          # Frontend source code
│   ├── components/              # React components
│   │   ├── Layout.tsx          # Main layout wrapper
│   │   ├── ProtectedRoute.tsx  # Route protection logic
│   │   ├── charts/             # Chart components
│   │   └── reports/            # Report generation
│   ├── pages/                  # Page components
│   │   ├── AdminDashboard.tsx
│   │   ├── ManagerDashboard.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Courses.tsx
│   │   ├── Projects.tsx
│   │   ├── Badges.tsx
│   │   ├── Analytics.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── more...
│   ├── contexts/               # React context providers
│   │   └── AuthContext.tsx
│   ├── lib/                    # Utility functions
│   │   └── api.ts             # API calls
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── server/                     # Backend source code
│   ├── routes/                # API route handlers
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── courses.js
│   │   ├── projects.js
│   │   ├── badges.js
│   │   ├── payments.js
│   │   └── analytics.js
│   ├── models/               # MongoDB schemas
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Project.js
│   │   ├── Badge.js
│   │   └── Payment.js
│   ├── middleware/           # Express middleware
│   │   ├── auth.js
│   │   └── upload.js
│   ├── config/              # Configuration files
│   │   ├── database.js
│   │   └── cloudinary.js
│   ├── index.js            # Server entry point
│   └── seedBadges.js       # Database seeding
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16.0.0 or higher)
- npm or yarn package manager
- MongoDB instance
- Stripe account
- Cloudinary account

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=5000
NODE_ENV=development
```

> **Note:** The `.env` file will be shared via private/Google Cloud for production use.

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Company-Grow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173` (frontend) and `http://localhost:5000` (backend)

## 📖 Usage

### For Employees
- Log in to your account
- Enroll in available courses
- Track your learning progress
- View assigned projects
- Earn badges and points through achievements
- Check your performance analytics

### For Managers
- Create and manage courses for your team
- Assign projects to employees
- Monitor team progress and performance
- View team analytics and reports
- Manage team members

### For Admins
- Full platform management capabilities
- Create system-wide courses and projects
- Manage all users and roles
- Configure platform settings
- Access comprehensive analytics
- Manage badges and gamification rules

## 🔐 Security Features

- JWT-based stateless authentication
- Role-based access control (RBAC)
- Secure password hashing
- Protected API endpoints
- Secure file uploads via Cloudinary
- Environment variable encryption for sensitive data

## 📊 API Documentation

The backend API follows RESTful principles. Key endpoints include:

- `/api/auth/*` - Authentication routes
- `/api/users/*` - User management
- `/api/courses/*` - Course management
- `/api/projects/*` - Project management
- `/api/badges/*` - Badge system
- `/api/payments/*` - Payment processing
- `/api/analytics/*` - Analytics data

## 🤝 Contributing

Guidelines for contributing to Company-Grow:

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request
