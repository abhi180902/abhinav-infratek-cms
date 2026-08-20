# Abhinav Infratek CMS

A full-stack Content Management System (CMS) for managing the Abhinav Infratek construction company website.

## Tech Stack

- Java 21
- Spring Boot
- Spring Security
- JWT Authentication
- PostgreSQL
- React
- Vite

## Setup

Create the required environment variables before running the application.

## Current Schema Notes

- `site_settings.whatsapp_number` stores the public WhatsApp contact number managed from the admin settings screen.
- `projects.image_url` and `projects.image_public_id` remain the cover image fields so existing projects continue working.
- `project_images` stores additional project gallery images with a `project_id` foreign key, Cloudinary public ID, image URL, and display order.
- Production databases using schema validation must apply the matching SQL changes before deploying backend code that references the new fields/tables.

Frontend:

```bash
npm install
npm run dev
```

Backend:

```bash
mvn spring-boot:run
```
