---
name: Bug Report or Feature Request
about: Use this template to report a bug or suggest a feature.
title: "[Bug] Hardcoded MongoDB URI Exposes Database Credentials"
labels: bug
assignees: ''

---

### Issue Type
<!-- Please check one of the options using an "x" -->
- [x] Bug
- [ ] Feature Request
- [ ] Documentation Improvement
- [ ] Question/Support

---

### Description
The application currently has a hardcoded database URI in the seeder script:  
`const conn = await mongoose.connect(process.env.MONGODB_URI);`.

This exposes the database credentials in the codebase, which can lead to potential security risks. The URI should instead be loaded from the environment variable `MONGODB_URI` defined in the `.env` file to securely store database credentials.

---

### Steps to Reproduce (For Bugs)
1. Open the seeder script or the relevant file where the database connection is established.
2. Locate the hardcoded URI:  
   `const conn = await mongoose.connect(process.env.MONGODB_URI);`
3. Notice that the database credentials are exposed in the code.

**Expected behavior:**  
The database URI should be loaded from the `.env` file like this:  
`const conn = await mongoose.connect(process.env.MONGODB_URI);`  
This ensures the credentials are kept secure and not exposed in the codebase.

**Actual behavior:**  
The MongoDB URI is hardcoded, exposing the database credentials in the codebase.

---

### Environment (For Bugs)
- **OS:**  
- **Version:**  
- **Other details (if applicable):**  
   - Application uses `mongoose` to connect to MongoDB.
   - `.env` file is used for environment variables.

---

### Additional Context or Screenshots
<!-- Add any other context about the problem or feature here, such as logs or screenshots. -->
N/A

---

### Acceptance Criteria (For Features)
<!-- What needs to be done to consider this feature implemented? -->
1. Update the seeder script to use `process.env.MONGODB_URI` instead of hardcoding the MongoDB URI.
2. Ensure the application connects to the database using the correct URI stored in the `.env` file.
3. Verify that the `.env` file is correctly set up with the `MONGODB_URI` variable.

---

### Checklist
<!-- Mark items as completed using an "x" -->
- [x] I have confirmed that the issue is reproducible with the current codebase.
- [x] I have provided enough information for the issue to be actionable.
- [x] I have confirmed that the change will prevent exposing database credentials in the code.
