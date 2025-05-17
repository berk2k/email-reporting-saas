## 🚀 Features
✅ User authentication & authorization (JWT-based)

🗓️ Automated task scheduling (daily, weekly, monthly)

📬 Email delivery via Nodemailer

📊 Dynamic report generation

🗄️ PostgreSQL + Prisma ORM for robust data management

⚙️ Built with Node.js and Express.js

---
## 🛠️ Tech Stack
**Backend**: Node.js, Express.js

**Database**: PostgreSQL

**ORM**: Prisma

**Authentication**: JWT, bcrypt

**Scheduling**: node-cron

**Email Service**: Nodemailer (SMTP-compatible)

**Environment Management**: dotenv

---
## 🧪 Example Use Cases
Automatically send weekly performance reports to clients.

Schedule monthly billing summaries.

Daily email digests of system activity or analytics.

---

## 🔒 Authentication
Users must register and log in to manage their reports. Protected routes use JWT-based authentication.

## 📧 Email Delivery
The system sends styled HTML email reports using Nodemailer. Emails can be triggered instantly or sent based on a recurring schedule.

## 📅 Scheduling
Tasks are scheduled using node-cron, allowing flexible time intervals (e.g., every Monday at 9 AM, every first day of the month, etc.).

## 📌 Future Improvements
Admin panel with UI for scheduling and managing reports

Support for multiple email templates

Analytics and logs for sent emails

Multi-language support
