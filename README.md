# Online Health Insurance Management System

A modern, full-featured digital insurance platform that seamlessly connects customers with administrators, simplifying policy management, claims processing, and overall health insurance operations.

## Overview

OHIMS (Online Health Insurance Management System) is a comprehensive platform designed to streamline health insurance processes. Customers can apply for insurance plans, submit documents, and track applications, while admins can manage policies, applications, and claims efficiently. Whether you are a customer or an administrator, OHIMS provides a secure, intuitive, and scalable solution.

## Key Features

### For Customers

Personalized Dashboard: Track your policies, claims, and personal information.

Policy Application: Easily apply for insurance plans and upload required documents.

Application Tracking: Get real-time updates on the status of your policy applications.

Claims Submission: Submit and monitor claims online with document uploads.

Notifications & Alerts: Receive timely updates about application and claim status.

### For Admins

Admin Dashboard: Comprehensive view of users, policies, claims, and overall platform analytics.

Policy Management: Create, update, and manage insurance plans with full CRUD functionality.

Application Verification: Review, approve, or reject customer policy applications.

Claims Management: Process and verify claims, request additional documents, and finalize approvals.

User Management: Manage customer accounts and provide support.

### Platform-Wide

Secure Authentication: JWT-based login with role-based access control.

Responsive Design: Works seamlessly on desktop, tablet, and mobile devices.

Scalable Architecture: Built to handle increasing numbers of users, policies, and claims.

Cloud Storage: Store uploaded documents securely using Cloudinary.

## Tech Stack

Frontend: React.js / Tailwind CSS  

Backend: Node.js (Express)  

Database: MongoDB  

Authentication: JWT / Role-Based Access  

File Uploads: Multer / Cloudinary  

Deployment: Docker  

## Infrastructure

Containerization: Docker & Docker Compose  

Reverse Proxy: Nginx  

Logging: ELK Stack (Elasticsearch, Logstash, Kibana)  

## Quick Start with Docker

Docker Engine 20.10+  

Docker Compose 2.0+  

Git
### 1. Clone the Repository

```bash
git clone https://github.com/FiraBro/OHIMS.git
cd OHIMS
```

### 2. Environment Configuration

```env
PORT=3001
MONGO_URI=mongodb://admin:admin123@mongodb_health:27017/health_insurance?authSource=admin

JWT_SECRET=your_jwt_secret_key

CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

SMTP_HOST=your_smtp_host
SMTP_USER=your_email
SMTP_PASS=your_email_password
```

### 3. Start the Applications

```bash
docker-compose up -d
```

