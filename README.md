# 📅 Meet Schedule

**A modern application for scheduling meetings with Calendly integration**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Jest](https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white)](https://jestjs.io/)
[![Testing Library](https://img.shields.io/badge/testing%20library-323330?style=for-the-badge&logo=testing-library&logoColor=red)](https://testing-library.com/)

## 🎯 About the Project

Meet Schedule is an elegant and intuitive solution for schedule management, developed with the latest web technologies. The application offers a responsive and user-friendly interface to make the meeting scheduling process easier.

### ✨ Main Features

- 🗓️ **Calendar View**: Modern interface to view and manage schedules
- 📱 **Responsive Design**: Optimized experience for desktop, tablet, and mobile
- 🔗 **Calendly Integration**: Connectivity with the Calendly API for event synchronization
- 🎨 **Intuitive Interface**: Clean and professional design using Tailwind CSS
- ⚡ **Optimized Performance**: Built with Next.js for maximum performance
- 🧪 **Automated Testing**: Test coverage with Jest to ensure quality

## 🛠️ Technologies Used

### Frontend

- **Next.js 14** - React framework for full-stack applications
- **TypeScript** - JavaScript superset with static typing
- **React 18** - Library for building interfaces
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library for React

### Development Tools

- **ESLint** - Static code analysis
- **Jest** - JavaScript testing framework
- **React Testing Library** - Utilities for testing React components
- **PostCSS** - CSS processor

### External Integration

- **Calendly API** - Online scheduling service

## 🚀 How to Run the Project

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/venturelli-91/meet_schedule.git
   cd meet_schedule
   ```

2. **Navigate to the frontend directory**

   ```bash
   cd frontend/app
   ```

3. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

4. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   ### 🔑 How to get your Calendly API Token

   To use the Calendly integration, you need to create a Personal Access Token:

   1. **Access your Calendly account**

      - Go to [https://calendly.com](https://calendly.com)
      - Log in to your account

   2. **Navigate to Integrations and API**
      - In the sidebar menu, click **"Account Settings"**
      - Select **"Developer"** or **"Integrations & Apps"**
   3. **Create a Personal Access Token**
      - Click **"Create Personal Access Token"**
      - Give the token a descriptive name (e.g., "Meet Schedule App")
      - Set the required permissions:
        - ✅ Read events
        - ✅ Read user information
        - ✅ Read organization information
   4. **Copy and save the token**

      - ⚠️ **IMPORTANT**: Copy the token immediately, as it will only be shown once
      - Store it in a safe place

   5. **Set it in the .env.local file**
      ```env
      NEXT_PUBLIC_CALENDLY_ACCESS_TOKEN=your_personal_access_token_here
      NEXT_PUBLIC_CALENDLY_USER_URI=https://api.calendly.com/users/your_user_id
      ```

   📋 **Example configuration:**

   ```env
   NEXT_PUBLIC_CALENDLY_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcHAiLCJzdWIiOiJ1c2Vy...
   NEXT_PUBLIC_CALENDLY_USER_URI=https://api.calendly.com/users/AAAAAAAAAAAAAAAA
   ```

5. **Run the project in development mode**

   ```bash
   npm run dev

   # or

   yarn dev
   ```

6. **Access the application**

   Open [http://localhost:3000](http://localhost:3000) in your browser

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🌟 Main Components

- **CalendarView**: Main calendar view
- **MeetingScheduler**: Interface for scheduling meetings
- **LanguageNavbar**: Responsive navigation with social links
- **CalendlyApiTest**: Component for integration tests

## 🔧 Available Scripts

```json
{
	"dev": "Run in development mode",
	"build": "Create production build",
	"start": "Start production server",
	"test": "Run tests",
	"lint": "Check code quality"
}
```

## 📱 Screenshots

To update

## 🤝 Contributing

Contributions are always welcome! To contribute:

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.

## 👨‍💻 Author

**Aurélio Venturelli**

- 💼 LinkedIn: [Your LinkedIn](([https://www.linkedin.com/in/aurelioventurelli/])
- 🐙 GitHub: [venturelli-91](https://github.com/venturelli-91)
- 📧 Email: venturelli.dev@gmail.com

---

⭐ If this project helped you, consider giving it a star!

**Developed with ❤️ and ☕**

