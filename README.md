# Enrollment Management System

## Introduction

This project is a **School Enrollment Management System**, developed as my thesis project and a key requirement for completing my 4th year in college—serving as a gateway toward graduation.

The system is specifically designed to support and streamline the enrollment operations of **Dipolog City Institute of Technology Inc.**, focusing on automating tasks and processes related to student enrollment. It aims to enhance efficiency, minimize manual intervention, and provide a seamless user experience for both administrators and students within the institution.

# User Roles and Functional Overview
Based on the system design, below is a high-level summary of the functions and permissions assigned to each user role. These roles are meant to guide how access is managed throughout the Enrollment Management System. Adjustments may be needed based on specific business rules or security protocols.

---

## 1. Student

- View their profile  
- View their enrollment status  
- View their course schedule  
- View their grades  
- View their balance and fees  
- Make payments (if not a scholarship student)  
- Submit enrollment application  
- View and download their prospectus  
- Request for withdrawal of enrollment  

---

## 2. Teacher

- View their profile  
- View their teaching schedule  
- Input and submit grades for their classes  
- View class lists  
- Mark student attendance  

---

## 3. Dean

- View and manage student enrollments  
- Approve or reject student enrollments  
- View and manage teacher schedules  
- View and manage course offerings  
- View and manage student grades  
- Approve grade submissions from teachers  
- View student prospectus  
- Manage curriculum  
- View lacking subjects and missing grades of students  
- Approve withdrawal of enrollment requests  

---

## 4. Admin / Registrar

- Manage user accounts (create, edit, view)  
- Manage course offerings  
- Manage room assignments  
- Manage enrollment process  
- Generate and manage student records  
- View and manage student grades  
- View and manage teacher schedules  
- Generate reports  
- Manage school policies  
- Enable/Disable add/drop/withdraw functionality  
- Approve withdrawal of enrollment requests after dean's approval  

---

## 5. Accounting

- View and manage student receipts  
- View and manage student balances and fees  
- Process payments  
- Generate financial reports  
- Manage scholarship payments  
- Refund payments (for scholarship students)  
- Set up course fees and tuition fees  
- Manage down payments and installment plans  

---

## 6. Super Admin

- All functionalities of other roles  
- Retrieve and archive data for:  
  - Subjects  
  - Rooms  
  - Blocks  
  - Courses  
  - Teacher schedules  
  - Enrollment records  
- Manage system-wide settings  
- Revoke and restore user accounts  
- Access to all system data and functionalities  


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
   npm run seed
   # or
   yarn seed
   # or
   pnpm seed
   # or
   bun seed
   ```

4. Install dependencies:

   ```bash
      npm i
      # or
      yarn install
      # or
      pnpm install
      # or
      bun install
   ```

5. Run the development server

   ```bash
      npm run dev
      # or
      yarn dev
      # or
      pnpm dev
      # or
      bun dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result and sign-in as(ensure seeders already executed):
 ```bash
      #Admin/Registrar
      email: admin1@gmail.com
      password: qweqwe

      # Accounting
      email: accounting1@gmail.com
      password: qweqwe

      # Super Admin
      email: superadmin1@gmail.com
      password: qweqwe

      # Dean
      email: dean1@gmail.com
      password: qweqwe

      # Instructor
      email: teacher1@gmail.com
      password: qweqwe

      # Student
      ## case 1 - no outstanding balance in every enrollment.
         - email: student1@gmail.com
         - This case represents a student, Lalaine, who has successfully completed their payment in full or a student without any prior dues.
      ## case 2 - outstanding balance
         - email: student2@gmail.com
         - This case represents a student, Reymond, who has an outstanding balance, which will be carried over and added to the next enrollment period.
      ## case 3 - full payment discount 10%
         - email: student10@gmail.com
         - This case represents a student who made a full payment and received a 10% discount, applied only to the total of the Enrollment Fees excluding additional fees.
      ## case 4 - discounted students - family discount
         - email: student8@gmail.com
         - This case represents a student who received a tuition fee discount under the Family Discount program discounted a 10% in tuition fee .
      ## case 5 - discounted students - Person with Disability Discount
         - email: student9@gmail.com
         - This case represents a student who received a tuition fee discount under the Person with Disability Discount program discounted a 25% in tuition fee .
      ## case 6 - discounted students - Corporate Scholar Discount
         - email: student6@gmail.com
         - This case represents a student who received a tuition fee discount under the Corporate Scholar Discount program discounted a 50% in tuition fee .

   ```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

This project has already been successfully deployed and is live at:  
🌐 [www.mondrey.dev](https://www.mondrey.dev)

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
