# Events & Activities Platform (Frontend)

A modern, responsive, and feature-rich frontend for the Events & Activities Platform, built with Next.js 14 and Tailwind CSS. This application provides a seamless experience for users to discover events, hosts to manage their listings, and admins to oversee the platform.

**Live URL:** [https://mz-events-frontend.vercel.app/](https://mz-events-frontend.vercel.app/)

## 🚀 Features

- **Role-Based Access Control:** Distinct dashboards and navigation for Users, Hosts, and Admins.
- **Event Discovery:** Browse and search for events with interactive maps (Leaflet).
- **User Authentication:** Secure login and registration flows.
- **Dashboard Management:**
  - **Users:** View bookings, manage profile, and friends.
  - **Hosts:** Create and manage events, view participants.
  - **Admins:** Oversee users, events, and platform settings.
- **Interactive UI:** Polished animations with Framer Motion and responsive design.
- **Bookings & Payments:** Integrated booking system with Stripe payment processing.
- **Social Features:** Friend connections and notifications.
- **Content Pages:** Dedicated About Us and Contact pages.

## 🛠️ Technology Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), `clsx`, `tailwind-merge`
- **State & Forms:** React Hook Form, Zod (Validation)
- **UI Components:** React Icons, Lucide React
- **Animations:** Framer Motion
- **Maps:** React Leaflet, Leaflet
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast
- **Payments:** Stripe (React Stripe.js)

## 📦 Setup & Installation

Follow these steps to run the project locally:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd frontend-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory and add the necessary variables (e.g., API base URL, Stripe keys).
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the application:**
    Visit `http://localhost:3000` in your browser.

## 📜 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code quality issues.

## 📂 Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/components`: Reusable UI components.
- `src/contexts`: React Context providers (e.g., AuthContext).
- `src/lib`: Utility functions and libraries.
- `src/types`: TypeScript type definitions.
