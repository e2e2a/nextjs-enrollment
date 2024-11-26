# Pull Request Template

## Description
<!-- A clear and concise description of what this pull request does. Include any relevant motivation and context. -->
Resolved an issue where the database seeder exposed the database credentials by not using the `MONGODB_URI` from the `.env` file. Updated the code to securely load the database URI from environment variables.

---

## Related Issue
<!-- If this pull request fixes an issue, add "Fixes #<issue_number>" to automatically close the issue when merged. -->
Fixes #456  

---

## Changes Made
<!-- List your changes in detail. If applicable, mention specific files or lines where changes occurred. -->
- Updated the seeder script to use `process.env.MONGODB_URI` for database connection.  
- Added a check to ensure `.env` file is configured before running the seeder.  
- Updated documentation to include `.env` setup instructions.  

---

## How to Test
<!-- Provide step-by-step instructions on how reviewers can test your changes. -->
1. Add a valid `MONGODB_URI` to your `.env` file.  
2. Run the seeder script (`npm run seed`).  
3. Confirm successful seeding without exposing credentials in logs or the codebase.  

---

## Screenshots or Logs (if applicable)
<!-- Attach screenshots or logs to highlight the changes made, especially for UI/UX-related PRs or major changes. -->
N/A  

---

## Checklist
<!-- Mark items as completed using an "x" -->
- [x] I have tested my changes thoroughly.  
- [x] I have followed the project's code style guidelines.  
- [x] I have added/updated necessary documentation.  
- [x] I have linked relevant issues to this PR.  
- [x] I have ensured there are no new warnings or errors in the code.

---

## Notes for Reviewers
Please verify if the `.env` instructions are clear and whether the script properly fails if the `MONGODB_URI` is missing.
