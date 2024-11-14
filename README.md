# Enrollment Management System

## Introduction

This project is a School Enrollment Management System. It is designed to automate and simplify the complex tasks of managing a school's operations or student's enrollments.

## Database

The system uses MongoDB as its database. MongoDB is a source-available cross-platform document-oriented database program. It is classified as a NoSQL database program, which provides high performance, high availability, and easy scalability.

## Getting Started

1. **Copy the `.env` file**  
    First, create a `.env` file by copying the `.env.example` template file in the root directory. Update the environment variables as needed, especially the database connection string.

   ```bash
   cp .env.example .env
   ```

2. Set up MongoDB  
   Ensure to have a MongoDB database or [download it here](https://www.mongodb.com/try/download/community).

3. Seed initial data
   Before seeding, navigate to src/seeders/admin and update the database name on line 45 if necessary.

   Once your database is configured, seed the initial data by running:

   ```bash

   node src/seeders/admin
   ```

4. Run the development server

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
