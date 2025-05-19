# TaskMaster - Task Management Application

TaskMaster is a comprehensive task management application built with Next.js 14, React 18, Prisma, and Tailwind CSS. It helps users manage both personal and professional tasks, track bill payments, and set reminders.

## Features

- **Task Management**: Create, edit, delete, and mark tasks as complete
- **Task Categorization**: Organize tasks as personal or official
- **Priority Levels**: Set task priorities (low, medium, high)
- **Bill Payment Tracking**: Manage recurring and one-time bill payments
- **Calendar View**: Visualize tasks and bills in a monthly calendar
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Dark/Light Mode**: Choose your preferred theme
- **Filtering & Sorting**: Easily find and organize your tasks and bills

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/taskmaster.git
   cd taskmaster
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/app`: Next.js app router pages and API routes
- `/components`: Reusable React components
- `/lib`: Utility functions and shared code
- `/prisma`: Database schema and client

## Technologies Used

- **Next.js 14**: React framework with server-side rendering
- **React 18**: UI library
- **Prisma**: Type-safe database ORM
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **React Hook Form**: Form handling
- **Zod**: Schema validation
- **date-fns**: Date manipulation
- **Lucide React**: Icon library

## License

This project is licensed under the MIT License.