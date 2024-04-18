# PWA Layout with Next.js

This project is a Progressive Web App (PWA) layout built with Next.js, TypeScript, and integrates various technologies to create a modern web application experience.

## Technologies Used

- **Next.js**: A React framework for building server-side rendered (SSR) and statically generated (SSG) applications.
- **TypeScript**: A statically typed superset of JavaScript that adds type annotations and other features to the language.
- **PWA Compatibility**: The application is designed to be Progressive Web App compatible, enhancing user experience with features such as offline support, push notifications, and more.
- **Prisma ORM**: Prisma is used as the Object-Relational Mapping (ORM) tool to interact with the MySQL database.
- **MySQL**: The project connects to a MySQL database to store and manage application data.
- **Tailwind CSS**: A utility-first CSS framework used for styling the components and layout of the application.
- **NextAuth**: NextAuth provides authentication services, enabling features like social authentication, email/password authentication, and more.

## Getting Started

Follow these steps to get the project up and running on your local machine:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Joselimberg/pwa-layout.git

2. **Install dependencies**:

   ```bash
   cd pwa-layout
   npm install

3. **Set up environment variables**:

   You'll need to set up environment variables for database connection and authentication. Create a `.env.local` file in the root directory and add your environment variables. Here's an example:

   ```plaintext
   DATABASE_URL="mysql://user:password@localhost:3306/database"
   NEXTAUTH_URL="http://localhost:3000"

4. **Set up the database schema with Prisma**:

   Before running the application, you'll need to set up the database schema using Prisma migrations. Make sure your database connection is configured correctly in your `.env.local` file. Then, run the following commands:

   ```bash
   npx prisma migrate dev

5. **Run the development server**:

   ```bash
   npm run dev

Open http://localhost:3000 in your browser to view the application.
