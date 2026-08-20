# Abhinav Infratek CMS - Fresher Interview Preparation Guide

This document is based on the actual codebase in `D:\Projects\Abhinav-Infratek-V2`.

Important honesty note for interview:

> I developed this project as a fresher using online documentation, debugging, and AI assistance from Codex. I did not blindly copy code. I integrated the modules, tested flows, fixed issues, and I can explain how the system works end to end.

## Actual Codebase Findings

- Backend exists in `backend/`.
- Frontend exists in `frontend/`.
- Database documentation exists in `database/schema.sql`, but the file says it is a reference design and is not wired into migrations.
- Backend uses Spring Boot, Java 21, Spring Security, custom JWT, JPA/Hibernate, PostgreSQL, Cloudinary, WebClient, and Resend.
- Frontend currently uses React, React Router, Axios, Lucide React, Vite, and CSS.
- Current `frontend/package.json` does not include React Hook Form, React Icons, or Framer Motion. Do not claim those are currently used unless you add them back.
- Cloudinary implementation supports image upload only: `jpg`, `jpeg`, `png`, and `webp`, maximum 5 MB.
- PDF or brochure upload is not implemented in the current codebase.
- Email sending with Resend is currently synchronous in `EnquiryServiceImpl`: save enquiry, send company email, send customer email, then return response.
- `/health` endpoint is implemented and public for all methods, including HEAD.

---

## Part 1 - Project Overview

### What Is Abhinav Infratek CMS?

Abhinav Infratek CMS is a full-stack website and content management system for a construction company. It has a public website for visitors and an admin panel for managing services, projects, leadership members, client reviews, enquiries, and site settings.

### Why Was It Built?

It was built to help the company maintain its public website content without editing code every time. The admin can log in and manage important website data through a protected CMS dashboard.

### What Problem Does It Solve?

Before a CMS, website updates usually require a developer. This project allows company content such as projects, services, leadership profiles, client reviews, logo, contact details, and hero text to be managed from an admin interface.

### Who Uses It?

- Public visitors: view company information, services, projects, leadership, client reviews, and submit enquiries.
- Admin user: logs into the CMS and manages content.

### Major Modules

- Public website
- Admin authentication
- Admin dashboard
- Services management
- Projects management
- Leadership Team management
- Client Reviews management
- Enquiries management
- Site Settings management
- Admin Account settings
- Cloudinary image upload
- Resend email notifications
- Health check endpoint

### Technology Choices

| Technology | Why Used |
|---|---|
| React | To build a dynamic single-page frontend with reusable components. |
| React Router | To handle public and admin routes on the frontend. |
| Axios | To call backend REST APIs and attach JWT tokens through interceptors. |
| Spring Boot | To build REST APIs quickly with standard Java backend patterns. |
| Spring Security | To protect admin APIs. |
| JWT | To allow stateless admin authentication. |
| PostgreSQL | Reliable relational database for CMS records. |
| JPA/Hibernate | To map Java entities to database tables. |
| Cloudinary | To store uploaded images outside the database and keep only URLs/public IDs in PostgreSQL. |
| Resend | To send enquiry notification and acknowledgement emails through an HTTP email API. |
| Vercel | Frontend hosting for React/Vite. |
| Render | Backend and PostgreSQL hosting. |

### 30-Second Explanation

Abhinav Infratek CMS is a full-stack construction company website with an admin panel. The public site shows services, projects, leadership, reviews, and a contact form. The admin can log in using JWT authentication and manage content through CRUD APIs. Images are stored in Cloudinary, enquiry emails are sent using Resend, and the app is deployed with the frontend on Vercel and backend/database on Render.

### 1-Minute Explanation

My project is Abhinav Infratek CMS, a full-stack CMS for a construction company. The frontend is built using React and Axios, and the backend is built using Spring Boot with REST APIs. Public users can view company content and submit enquiries. Admin users can log in securely, manage projects, services, leadership members, client reviews, enquiries, and site settings. PostgreSQL stores the data, Cloudinary stores uploaded images, and Resend sends emails to the company and customer after enquiry submission. The frontend is deployed on Vercel, and the backend plus database are on Render.

### 2-Minute Explanation

Abhinav Infratek CMS is a practical full-stack project for a construction company. It has two sides: a public website and a protected admin CMS. On the public website, visitors can see company services, completed projects, leadership team members, client reviews, and contact details. They can also submit an enquiry form.

On the backend, I used Spring Boot to create REST APIs. The backend follows a layered structure: controllers receive requests, services contain business logic, repositories talk to PostgreSQL, entities represent database tables, and DTOs control request and response data. The admin side is secured using Spring Security and JWT. After login, the frontend stores the token and sends it with admin API requests.

For media uploads, I used Cloudinary. The image file is uploaded to Cloudinary, and only the secure URL and public ID are stored in PostgreSQL. For email, I integrated Resend using WebClient. When a customer submits an enquiry, the backend saves it and sends a company notification and a customer acknowledgement email. The project is deployed with React on Vercel, Spring Boot on Render, PostgreSQL on Render, and custom domains for the public site and API.

---

## Part 2 - End-to-End Architecture

### Public Website Flow

```text
User
  -> React frontend
  -> Axios
  -> Spring Boot REST API
  -> Controller
  -> Service
  -> Repository
  -> PostgreSQL
  -> Response DTO
  -> React UI
```

Example: public projects

```text
Visitor opens /projects
  -> PublicWebsite loads data using getPublicWebsiteData()
  -> Axios GET /api/projects
  -> ProjectController.getActiveProjects()
  -> ProjectServiceImpl.getActiveProjects()
  -> ProjectRepository.findByActiveTrueOrderByDisplayOrderAsc()
  -> PostgreSQL projects table
  -> ProjectResponse list
  -> React Projects section renders cards
```

### Admin Login Flow

```text
Admin enters email/password
  -> React Login page
  -> authService.loginAdmin()
  -> Axios POST /api/auth/login
  -> AuthController
  -> AuthServiceImpl
  -> AdminUserRepository.findByEmail()
  -> PasswordEncoder.matches()
  -> JwtService.generateToken()
  -> LoginResponse returned
  -> Frontend saves token in localStorage
  -> Admin accesses protected routes
```

### Authenticated Admin API Flow

```text
Admin clicks Save Project
  -> React admin form
  -> Axios request interceptor adds Authorization: Bearer <token>
  -> Spring Security JwtAuthenticationFilter
  -> JwtService validates token
  -> Request reaches controller
  -> Service performs business logic
```

### Customer Enquiry Flow

```text
Customer submits contact form
  -> React Contact component
  -> publicWebsiteService.submitPublicEnquiry()
  -> POST /api/enquiries
  -> EnquiryController
  -> EnquiryServiceImpl.createEnquiry()
  -> Enquiry saved in PostgreSQL
  -> MailService.sendCompanyNotification()
  -> Resend company email
  -> MailService.sendCustomerAcknowledgement()
  -> Resend customer email
  -> API response returned
```

IMPORTANT - UNDERSTAND THIS BEFORE INTERVIEW:

Email sending is synchronous in the current code. That means the response waits until the email attempts complete. If email fails, `EnquiryServiceImpl` catches and logs the error, so enquiry submission still succeeds.

### Image Upload Flow

```text
Admin chooses image
  -> React FormData request
  -> Spring multipart endpoint
  -> DTO receives MultipartFile
  -> Service calls ImageStorageService
  -> CloudinaryImageStorageService uploads image
  -> Cloudinary returns secure_url and public_id
  -> Backend stores URL and public ID in PostgreSQL
  -> Frontend uses URL to display image
```

PDF/brochure upload:

Not implemented in the current codebase. Cloudinary service validates only image formats: `jpg`, `jpeg`, `png`, `webp`.

---

## Part 3 - Frontend Explanation

### Startup Flow

- `frontend/src/main.jsx` starts the React app.
- It wraps the app with `BrowserRouter` and `AuthProvider`.
- `frontend/src/App.jsx` renders `AppRoutes`.
- `frontend/src/routes/AppRoutes.jsx` defines public and admin routes.

### Routing

Public routes:

- `/`
- `/about`
- `/services`
- `/projects`
- `/contact`

Admin public routes:

- `/admin/login`
- `/admin/forgot-password` redirects to `/admin/login`
- `/admin/reset-password` redirects to `/admin/login`

Protected admin routes:

- `/admin/dashboard`
- `/admin/account`
- `/admin/projects`
- `/admin/services`
- `/admin/leadership-team`
- `/admin/client-reviews`
- `/admin/enquiries`
- `/admin/settings`

Older route redirects:

- `/admin/leadership` redirects to `/admin/leadership-team`
- `/admin/reviews` redirects to `/admin/client-reviews`

### Public Website Component

`PublicWebsite` inside `AppRoutes.jsx` loads all public content using `getPublicWebsiteData()`.

It loads:

- site settings
- services
- projects
- leadership members
- client reviews

It passes this data into:

- `Navbar`
- `Hero`
- `About`
- `Services`
- `Projects`
- `LeadershipTeam`
- `ClientReviews`
- `Contact`
- `Footer`

### Axios Configuration

File: `frontend/src/api/axios.js`

What it does:

- Creates an Axios client with `VITE_API_BASE_URL`.
- Adds JWT token to requests if available.
- Handles `401` responses for admin pages or admin requests.
- Removes token and redirects to `/admin/login` when needed.

IMPORTANT - UNDERSTAND THIS BEFORE INTERVIEW:

The frontend does not manually add the token in each API call. The Axios interceptor does it automatically.

### Authentication State

Files:

- `frontend/src/context/AuthContext.jsx`
- `frontend/src/utils/authToken.js`
- `frontend/src/hooks/useAuth.js`
- `frontend/src/components/auth/ProtectedRoute.jsx`

Flow:

- Login response is saved in localStorage.
- `AuthProvider` stores the current admin in React state.
- `ProtectedRoute` checks whether a token exists.
- If unauthenticated, it redirects to `/admin/login`.

### Admin Pages

| Page | File | Backend API |
|---|---|---|
| Dashboard | `pages/admin/Dashboard.jsx` | `GET /api/admin/dashboard` |
| Projects | `pages/admin/Projects.jsx` | `/api/admin/projects` |
| Services | `pages/admin/Services.jsx` | `/api/admin/services` |
| Leadership Team | `pages/admin/LeadershipTeam.jsx` | `/api/admin/leadership` |
| Client Reviews | `pages/admin/ClientReviews.jsx` | `/api/admin/client-reviews` |
| Enquiries | `pages/admin/Enquiries.jsx` | `/api/admin/enquiries` |
| Settings | `pages/admin/Settings.jsx` | `/api/admin/site-settings` |
| Account | `pages/admin/Account.jsx` | `/api/admin/account`, `/api/admin/change-password` |

### Forms

The current frontend uses normal React state and controlled form handling. React Hook Form is not present in the current `package.json`.

### Responsive UI

The UI uses CSS files:

- `globals.css`
- `variables.css`
- `utilities.css`
- `home.css`
- `admin.css`

Icons are from `lucide-react`.

---

## Part 4 - Backend Explanation

### Main Application Class

File: `CmsApplication.java`

This starts the Spring Boot backend.

### Layered Architecture

| Layer | Simple Explanation | Example |
|---|---|---|
| Controller | Receives HTTP requests and returns responses. | `ProjectController` |
| DTO | Defines request/response shape. | `ProjectRequest`, `ProjectResponse` |
| Service | Contains business logic. | `ProjectServiceImpl` |
| Repository | Performs database operations. | `ProjectRepository` |
| Entity | Represents database table. | `Project` |
| Mapper | Converts between entity and DTO. | `ProjectMapper` |

### Controllers

Controllers expose REST APIs. They mostly call service methods and return `ResponseEntity`.

### Services

Services contain logic such as:

- checking duplicate project slug
- uploading images to Cloudinary
- saving records
- sending emails
- changing enquiry status
- loading dashboard counts

### Repositories

Repositories extend `JpaRepository`, so Spring Data JPA provides common methods such as:

- `findAll`
- `findById`
- `save`
- `delete`
- `count`

Custom methods include:

- `findByActiveTrueOrderByDisplayOrderAsc`
- `findBySlugAndActiveTrue`
- `countByStatus`

### DTOs

DTOs keep frontend data separate from database entities. For example, `ProjectRequest` receives form fields and image file, while `ProjectResponse` returns clean project data.

### Mappers

Mappers convert:

- request DTO to entity
- entity to response DTO
- image upload result to entity fields

### Exception Handling

File: `GlobalExceptionHandler.java`

It handles:

- validation errors
- authentication errors
- admin account errors
- not found errors
- image upload errors
- max upload size errors
- duplicate data conflicts
- unexpected server errors

It returns a standard `ErrorResponse`.

---

## Part 5 - Database

Actual JPA entities:

| Entity | Table | Purpose |
|---|---|---|
| `AdminUser` | `admin_users` | Stores admin login account. |
| `ServiceEntity` | `services` | Stores company services. |
| `Project` | `projects` | Stores project details and image metadata. |
| `Leadership` | `leadership_members` | Stores team member profiles. |
| `ClientReview` | `client_reviews` | Stores client reviews and optional image metadata. |
| `Enquiry` | `enquiries` | Stores public contact form submissions. |
| `SiteSettings` | `site_settings` | Stores singleton website settings. |

### Relationships

There are no explicit foreign key relationships between the current JPA entities. Most modules are independent CMS tables.

### Timestamps

Most entities use `@PrePersist` and `@PreUpdate` lifecycle methods to set `createdAt` and `updatedAt`.

`Enquiry` currently has only `createdAt` in the entity.

### Database Flow Examples

#### Admin Creates Service

```text
React Services page
  -> POST /api/admin/services
  -> ServiceController
  -> ServiceServiceImpl.createService()
  -> ServiceMapper.toEntity()
  -> ServiceRepository.save()
  -> services table
```

#### Admin Creates Project

```text
React Projects page sends FormData
  -> POST /api/admin/projects
  -> ProjectServiceImpl validates slug
  -> Cloudinary uploads image
  -> ProjectMapper creates Project entity
  -> ProjectRepository.save()
  -> projects table stores imageUrl and imagePublicId
```

#### Admin Updates Project

```text
PUT /api/admin/projects/{id}
  -> find project by id
  -> validate slug
  -> update fields
  -> if new image exists, replace Cloudinary image
  -> save updated project
```

#### Customer Submits Enquiry

```text
POST /api/enquiries
  -> validate request
  -> save enquiry with status NEW
  -> send emails through Resend
```

#### Admin Changes Enquiry Status

```text
PATCH /api/admin/enquiries/{id}/status
  -> find enquiry
  -> set status
  -> save enquiry
```

---

## Part 6 - Admin Login and Security

### Authentication Flow

```text
Admin enters email/password
  -> POST /api/auth/login
  -> AuthController
  -> AuthServiceImpl
  -> AdminUserRepository.findByEmail()
  -> PasswordEncoder.matches()
  -> JwtService.generateToken()
  -> LoginResponse returned
  -> Frontend stores token in localStorage
```

### Authorization Flow

```text
Admin calls protected API
  -> Axios adds Authorization header
  -> JwtAuthenticationFilter reads Bearer token
  -> JwtService extracts username
  -> CustomUserDetailsService loads admin user
  -> JwtService validates signature and expiry
  -> Spring Security allows request
```

### Authentication vs Authorization

- Authentication means verifying who the user is.
- Authorization means checking what the user is allowed to access.

In this project:

- Login authenticates the admin.
- JWT allows access to protected admin APIs.

### Password Encoding

Passwords are stored with BCrypt through `PasswordEncoder`.

### JWT

`JwtService` manually creates an HMAC SHA-256 JWT. It puts:

- subject/email
- name
- role
- issued time
- expiry time

IMPORTANT - UNDERSTAND THIS BEFORE INTERVIEW:

This project uses a custom JWT implementation using Java `Mac` and Base64 URL encoding, not a third-party JWT library.

### SecurityConfig

Public endpoints:

- `/health`
- `/api/auth/**`
- `POST /api/enquiries`
- `GET /api/services`
- `GET /api/leadership`
- `GET /api/projects`
- `GET /api/projects/{slug}`
- `GET /api/client-reviews`
- `GET /api/site-settings`

All other endpoints require authentication.

### CORS

CORS allows the Vercel frontend and local frontend to call the Render backend.

Allowed origins include:

- `http://localhost:5173`
- `https://abhinav-infratek-cms.vercel.app`
- `https://abhinavinfratek.in`
- `https://www.abhinavinfratek.in`

---

## Part 7 - CRUD Flows

### Projects

Create:

- Admin submits FormData with project fields and image.
- Backend validates slug uniqueness.
- Image is required on create.
- Image uploads to Cloudinary folder `abhinav-infratek/projects`.
- PostgreSQL stores project data plus `imageUrl` and `imagePublicId`.

Read:

- Public: `GET /api/projects` returns active projects ordered by display order.
- Public detail: `GET /api/projects/{slug}` returns active project by slug.
- Admin: `GET /api/admin/projects` returns all projects ordered by display order.

Update:

- Admin sends FormData.
- If no new image is sent, old image stays.
- If new image is sent, old Cloudinary image is replaced.

Delete:

- Backend deletes Cloudinary image using `imagePublicId`.
- Then deletes database record.

### Services

Services do not upload images in the backend. They use fields like slug, icon key, title, description, display order, and active status.

### Leadership Team

Create:

- Image is required.
- Uploads to `abhinav-infratek/leadership`.

Update:

- If no new image, existing image remains.
- If new image, Cloudinary image is replaced.

Delete:

- Deletes Cloudinary image first, then database record.

### Client Reviews

Create:

- Image is optional.
- If present, uploads to `abhinav-infratek/client-reviews`.

Update:

- Can update text fields.
- If a new image is selected, old image is replaced.

Delete:

- If image exists, Cloudinary image is deleted.
- Database record is deleted.

### Enquiries

Public:

- `POST /api/enquiries` saves enquiry and sends emails.

Admin:

- list enquiries
- view one enquiry
- delete enquiry
- update status

Admin cannot create enquiries from the CMS in the current codebase.

### Site Settings

`SiteSettingsServiceImpl` uses a singleton pattern:

- `getSettings()` returns the first record.
- If no record exists, it creates a default empty record.
- Logo upload uses Cloudinary folder `abhinav-infratek/site-settings`.

---

## Part 8 - Cloudinary

### Why Cloudinary Is Used

Images should not be stored directly in PostgreSQL. Cloudinary stores the actual image file and returns a URL. PostgreSQL stores only the URL and public ID.

### Image Upload Details

File: `CloudinaryImageStorageService.java`

Allowed formats:

- jpg
- jpeg
- png
- webp

Maximum size:

- 5 MB

Methods:

- `uploadImage(MultipartFile file, String folder)`
- `deleteImage(String publicId)`
- `replaceImage(String oldPublicId, MultipartFile newFile, String folder)`

### PostgreSQL Stores

- `imageUrl` or `logoUrl`
- `imagePublicId` or `logoPublicId`

### PDF/Brochure Upload

Not implemented in the current codebase.

---

## Part 9 - Resend Email

### Flow

```text
Customer submits enquiry
  -> Enquiry saved
  -> Company notification email sent to info@abhinavinfratek.in
  -> Customer acknowledgement email sent to enquiry.getEmail()
```

### Implementation

Files:

- `MailService.java`
- `MailServiceImpl.java`
- `ResendProperties.java`
- `WebClientConfig.java`
- `ResendEmailRequest.java`

### Resend API

Endpoint:

```text
POST https://api.resend.com/emails
```

Authorization header:

```text
Authorization: Bearer ${RESEND_API_KEY}
```

Sender:

```text
Abhinav Infratek <info@abhinavinfratek.in>
```

Company recipient:

```text
info@abhinavinfratek.in
```

Customer recipient:

```text
enquiry.getEmail()
```

Company email uses `reply_to` with the customer email, so the company can reply directly.

### Why Resend Instead of SMTP?

Resend gives a simple HTTP API, works well with verified domains, and is easier to manage in cloud deployment compared with direct SMTP configuration.

---

## Part 10 - Health Endpoint and UptimeRobot

Endpoint:

```text
GET /health
```

Response:

```json
{
  "success": true,
  "service": "Abhinav Infratek CMS Backend",
  "status": "UP",
  "timestamp": "current ISO timestamp"
}
```

Why it is lightweight:

- It does not access PostgreSQL.
- It does not call Cloudinary or Resend.
- It returns immediately.

Why it is public:

UptimeRobot needs to call it without logging in.

HEAD issue:

Initially only `GET /health` was permitted:

```java
.requestMatchers(HttpMethod.GET, "/health").permitAll()
```

UptimeRobot sent a HEAD request and got 401. It was fixed by allowing all methods for `/health`:

```java
.requestMatchers("/health").permitAll()
```

Interview explanation:

> The health endpoint is used by UptimeRobot to keep checking whether the backend is alive. Since monitoring tools may use HEAD instead of GET, I made `/health` public for all HTTP methods without changing security for other endpoints.

---

## Part 11 - Deployment

### Actual Deployment Architecture

```text
Browser
  -> Vercel frontend: https://abhinavinfratek.in
  -> API calls to https://api.abhinavinfratek.in
  -> Render Spring Boot backend
  -> Render PostgreSQL
  -> Cloudinary for images
  -> Resend for emails
```

### Frontend Deployment

Vercel hosts the Vite React frontend. `frontend/vercel.json` rewrites all routes to `index.html` so React Router routes work after refresh.

### Backend Deployment

Render runs the Spring Boot app. `backend/Dockerfile` uses:

- Java 21 build image
- Maven wrapper
- multi-stage build
- JRE runtime image
- non-root app user

### Environment Variables

Backend uses:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION_SECONDS`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `RESEND_API_KEY`

Frontend uses:

- `VITE_API_BASE_URL`

Why secrets are not committed:

Database passwords, JWT secrets, Cloudinary keys, and Resend API keys must stay private. They are configured in Render or local `.env` files.

---

## Part 12 - Important API Endpoints

| Method | Endpoint | Purpose | Auth Required |
|---|---|---|---|
| GET/HEAD | `/health` | Health check for monitoring | No |
| POST | `/api/auth/login` | Admin login | No |
| GET | `/api/services` | Public active services | No |
| GET | `/api/projects` | Public active projects | No |
| GET | `/api/projects/{slug}` | Public project detail | No |
| GET | `/api/leadership` | Public active leadership members | No |
| GET | `/api/client-reviews` | Public active client reviews | No |
| GET | `/api/site-settings` | Public site settings | No |
| POST | `/api/enquiries` | Public contact form submission | No |
| GET | `/api/admin/dashboard` | Dashboard counts | Yes |
| GET | `/api/admin/account` | Get admin account | Yes |
| PUT | `/api/admin/account` | Update admin account | Yes |
| PUT | `/api/admin/change-password` | Change admin password | Yes |
| GET | `/api/admin/services` | List services | Yes |
| GET | `/api/admin/services/{id}` | Get service by ID | Yes |
| POST | `/api/admin/services` | Create service | Yes |
| PUT | `/api/admin/services/{id}` | Update service | Yes |
| DELETE | `/api/admin/services/{id}` | Delete service | Yes |
| GET | `/api/admin/projects` | List projects | Yes |
| GET | `/api/admin/projects/{id}` | Get project | Yes |
| POST | `/api/admin/projects` | Create project with image | Yes |
| PUT | `/api/admin/projects/{id}` | Update project | Yes |
| DELETE | `/api/admin/projects/{id}` | Delete project | Yes |
| GET | `/api/admin/leadership` | List leadership members | Yes |
| POST | `/api/admin/leadership` | Create leadership member | Yes |
| PUT | `/api/admin/leadership/{id}` | Update leadership member | Yes |
| DELETE | `/api/admin/leadership/{id}` | Delete leadership member | Yes |
| GET | `/api/admin/client-reviews` | List reviews | Yes |
| POST | `/api/admin/client-reviews` | Create review | Yes |
| PUT | `/api/admin/client-reviews/{id}` | Update review | Yes |
| DELETE | `/api/admin/client-reviews/{id}` | Delete review | Yes |
| GET | `/api/admin/enquiries` | List enquiries | Yes |
| GET | `/api/admin/enquiries/{id}` | View enquiry | Yes |
| PATCH | `/api/admin/enquiries/{id}/status` | Update enquiry status | Yes |
| DELETE | `/api/admin/enquiries/{id}` | Delete enquiry | Yes |
| GET | `/api/admin/site-settings` | Get settings | Yes |
| PUT | `/api/admin/site-settings` | Update settings/logo | Yes |

---

## Part 13 - Important Files

| File/Class | Purpose | What to Know |
|---|---|---|
| `SecurityConfig` | Security rules and CORS | Public vs protected endpoints |
| `JwtService` | Creates and validates JWT | Custom HMAC SHA-256 token |
| `JwtAuthenticationFilter` | Reads Bearer token | Runs before controller |
| `AuthServiceImpl` | Login logic | BCrypt password check and JWT generation |
| `AdminUserSeeder` | Creates first admin | Uses env variables, no hardcoded credentials |
| `GlobalExceptionHandler` | Standard error responses | Validation, not found, upload size errors |
| `ProjectController` | Project APIs | Public and admin endpoints |
| `ProjectServiceImpl` | Project business logic | Slug validation and Cloudinary image upload |
| `CloudinaryImageStorageService` | Image storage | 5 MB limit, image types only |
| `MailServiceImpl` | Resend email sending | WebClient, sender, reply_to |
| `WebClientConfig` | Resend WebClient | Base URL and Authorization header |
| `ResendProperties` | Resend config | Reads `RESEND_API_KEY` |
| `HealthController` | Monitoring endpoint | No DB or auth |
| `AppRoutes.jsx` | Frontend routing | Public/admin/protected routes |
| `axios.js` | API client | Base URL, token interceptor, 401 handling |
| `AuthContext.jsx` | Frontend auth state | Saves token and admin info |
| `ProtectedRoute.jsx` | Admin route guard | Redirects unauthenticated users |
| `publicWebsiteService.js` | Public data loading | Uses `Promise.allSettled` |
| `projectsService.js` | Admin project API calls | Uses FormData for image upload |
| `Dockerfile` | Backend deployment | Multi-stage Java 21 Docker build |

---

## Part 14 - Recruiter Questions for a Fresher

1. Tell me about your project.
   - It is a full-stack CMS for a construction company with a public website and admin panel.

2. Why did you build this project?
   - To solve a real content management need for a company website and to practice full-stack development.

3. What was your role?
   - I worked on building and integrating the frontend, backend APIs, authentication, database, deployment, image upload, and email flow. I also used Codex as an AI assistant and made sure I understood and tested the code.

4. What technologies did you use?
   - React, Axios, Spring Boot, Spring Security, JWT, PostgreSQL, Cloudinary, Resend, Vercel, and Render.

5. Explain the architecture.
   - React calls Spring Boot REST APIs using Axios. Spring Boot uses controllers, services, repositories, and entities. PostgreSQL stores data, Cloudinary stores images, and Resend sends emails.

6. Why Spring Boot?
   - It provides a structured way to build Java REST APIs with security, validation, and database integration.

7. Why PostgreSQL?
   - It is a reliable relational database suitable for structured CMS data.

8. Why React?
   - React makes it easier to build reusable UI components and dynamic admin pages.

9. What was the hardest part?
   - Understanding the full authentication and deployment flow, especially JWT, CORS, and connecting frontend/backend on different domains.

10. What did you learn?
    - I learned full-stack flow, REST APIs, JWT security, image uploads, email integration, and deployment.

---

## Part 15 - Technical Cross Questions

### Java

Question: Where is Java used in your project?

Answer: Java is used in the Spring Boot backend for controllers, services, entities, repositories, security, and integrations.

Cross-question: Which Java feature is used in DTOs?

Answer: Some DTOs use Lombok builders/getters/setters, and Resend request uses a Java record.

### Spring Boot

Question: What does Spring Boot do in your project?

Answer: It runs the backend application and exposes REST APIs for the public website and admin CMS.

Cross-question: What starts the app?

Answer: `CmsApplication.java` with `SpringApplication.run`.

### REST API

Question: What is a REST API?

Answer: It is a way for frontend and backend to communicate using HTTP methods like GET, POST, PUT, PATCH, and DELETE.

Cross-question: Give one example.

Answer: `GET /api/projects` returns active projects for the public website.

### Spring Security

Question: How is admin protected?

Answer: Admin APIs are protected by Spring Security. Public routes are explicitly permitted, and all other routes require authentication.

Cross-question: Which file controls this?

Answer: `SecurityConfig.java`.

### JWT

Question: What is JWT?

Answer: JWT is a token returned after login. The frontend sends it with admin requests so the backend can verify the admin.

Cross-question: Where is it validated?

Answer: `JwtAuthenticationFilter` and `JwtService`.

### PostgreSQL

Question: What data is stored in PostgreSQL?

Answer: Admin users, services, projects, leadership members, client reviews, enquiries, and site settings.

Cross-question: Are images stored in PostgreSQL?

Answer: No. Images are stored in Cloudinary. PostgreSQL stores URLs and public IDs.

### JPA/Hibernate

Question: Why use JPA?

Answer: JPA maps Java entities to database tables and reduces manual SQL for basic CRUD operations.

Cross-question: What is a repository?

Answer: A repository is an interface that provides database methods such as save, find, delete, and count.

### React

Question: What does React do?

Answer: React builds the frontend UI using components like Navbar, Hero, Projects, and admin pages.

Cross-question: How does routing work?

Answer: `AppRoutes.jsx` defines routes using React Router.

### Axios

Question: Why Axios?

Answer: Axios is used to call backend APIs. The shared Axios client adds the JWT token automatically.

Cross-question: Where is Axios configured?

Answer: `frontend/src/api/axios.js`.

### Cloudinary

Question: Why Cloudinary?

Answer: It stores uploaded images outside the database and gives secure URLs for display.

Cross-question: What file handles it?

Answer: `CloudinaryImageStorageService.java`.

### Resend

Question: Why Resend?

Answer: Resend sends emails using an HTTP API, which is easier to use in cloud deployment than SMTP.

Cross-question: What email is used as sender?

Answer: `Abhinav Infratek <info@abhinavinfratek.in>`.

### WebClient

Question: Why WebClient?

Answer: It is used to call Resend's external HTTP API from Spring Boot.

Cross-question: Where is it configured?

Answer: `WebClientConfig.java`.

### CORS

Question: What is CORS?

Answer: CORS controls which frontend domains can call the backend from the browser.

Cross-question: Why was it needed?

Answer: The frontend is on Vercel and backend is on Render, so they are different origins.

### Exception Handling

Question: How are errors handled?

Answer: `GlobalExceptionHandler` catches common exceptions and returns a consistent JSON error response.

Cross-question: What happens for validation errors?

Answer: It returns HTTP 400 with field-level validation messages.

---

## Part 16 - Project Cross-Question Simulation

1. Interviewer: Explain your project.
   - My answer: It is a CMS for Abhinav Infratek, a construction company. It has a public React website and a protected Spring Boot admin panel for managing content.

2. Interviewer: What modules are included?
   - My answer: Services, projects, leadership team, client reviews, enquiries, site settings, dashboard, and admin account management.

3. Interviewer: How does React communicate with Spring Boot?
   - My answer: React uses Axios to call REST APIs. The base URL is configured using `VITE_API_BASE_URL`.

4. Interviewer: How do you secure the admin panel?
   - My answer: Admin login returns a JWT. The frontend stores it and sends it in the Authorization header. Spring Security validates it before allowing admin APIs.

5. Interviewer: What happens when a customer submits an enquiry?
   - My answer: The contact form calls `POST /api/enquiries`. The backend saves the enquiry and sends notification emails through Resend.

6. Interviewer: Are emails asynchronous?
   - My answer: In the current code, emails are synchronous but failures are caught and logged so the enquiry is still saved.

7. Interviewer: Why not store images in PostgreSQL?
   - My answer: It is better to store files in Cloudinary and keep only URLs/public IDs in the database.

8. Interviewer: What is stored for a project image?
   - My answer: `imageUrl` and `imagePublicId`.

9. Interviewer: What happens on project update without a new image?
   - My answer: The backend updates text fields and keeps the existing image.

10. Interviewer: What happens on project update with a new image?
    - My answer: The backend uploads the new image to Cloudinary, deletes the old image, updates image fields, and saves the project.

11. Interviewer: Does your project support PDF upload?
    - My answer: Not implemented in the current codebase. The upload service currently supports only image formats.

12. Interviewer: What is a DTO?
    - My answer: A DTO controls what data comes in and goes out of the API without exposing the entity directly.

13. Interviewer: What is a mapper?
    - My answer: It converts between DTOs and entities.

14. Interviewer: What is a repository?
    - My answer: It handles database operations using Spring Data JPA.

15. Interviewer: What is a service layer?
    - My answer: It contains business logic, like validating slugs or uploading images before saving.

16. Interviewer: Why did you use JWT?
    - My answer: JWT allows stateless authentication, so the backend does not need to store sessions.

17. Interviewer: Where is JWT stored on frontend?
    - My answer: In localStorage through `authToken.js`.

18. Interviewer: What happens when JWT expires?
    - My answer: The backend returns 401. Axios interceptor removes the token and redirects to login for admin requests.

19. Interviewer: What is the health endpoint?
    - My answer: `/health` returns a simple UP response for UptimeRobot monitoring.

20. Interviewer: Why permit HEAD for health?
    - My answer: UptimeRobot may use HEAD requests, so `/health` is permitted for all methods.

21. Interviewer: How is CORS configured?
    - My answer: `SecurityConfig` allows the local frontend and production frontend domains.

22. Interviewer: How is first admin created?
    - My answer: `AdminUserSeeder` reads `ADMIN_EMAIL` and `ADMIN_PASSWORD` from environment variables and creates an admin only if no ADMIN role exists.

23. Interviewer: Can admin change password?
    - My answer: Yes, through `/api/admin/change-password`.

24. Interviewer: How is password stored?
    - My answer: Using BCrypt through Spring Security `PasswordEncoder`.

25. Interviewer: How does site settings work?
    - My answer: It uses a singleton style. The service gets the first record or creates a default empty one if none exists.

26. Interviewer: How does dashboard get counts?
    - My answer: `DashboardServiceImpl` uses repository count methods, including enquiry status counts.

27. Interviewer: What deployment issue did you face?
    - My answer: React routes on Vercel returned 404 on refresh. I fixed it with `vercel.json` rewriting routes to `index.html`.

28. Interviewer: Why was CORS needed?
    - My answer: Because frontend and backend are hosted on different domains.

29. Interviewer: Why did you use Resend?
    - My answer: It provides a clean API for domain-based email sending, and it works well with Render.

30. Interviewer: What would you improve?
    - My answer: I would add automated tests, pagination/search for large data, async email queueing, and formal database migrations.

---

## Part 17 - Questions About AI Assistance

Question: Did you build this yourself?

Answer: I built this project with support from Codex as an AI coding assistant. I used it to speed up implementation, but I also tested the flows, debugged issues, connected services, and made sure I understood the code.

Question: How much code did you write?

Answer: I worked through the project module by module. Some code was generated or assisted by Codex, but I reviewed and integrated it. For interview, I am focusing on understanding the architecture and flow honestly.

Question: Do you understand the code?

Answer: Yes, I can explain the main flows: login/JWT, CRUD APIs, Cloudinary image upload, Resend email sending, frontend Axios calls, routing, and deployment.

Question: Why did you use AI tools?

Answer: As a fresher, I used AI like a development assistant to learn faster, avoid boilerplate mistakes, and understand full-stack integration. I still took responsibility for testing and debugging the final project.

Question: What was the most difficult part?

Answer: Connecting all parts together: frontend, backend, JWT, CORS, deployment domains, Cloudinary, and email integration.

Question: What bug did you face?

Answer: One example was the `/health` endpoint. GET worked, but UptimeRobot used HEAD and got 401. I fixed it by permitting `/health` for all HTTP methods in Spring Security.

Question: What would you change if rebuilt?

Answer: I would add tests earlier, use database migrations like Flyway or Liquibase, make email sending asynchronous, and add pagination for admin lists.

---

## Part 18 - 20 Files You Must Understand

| File | What It Does | 3 Things To Know | Possible Questions |
|---|---|---|---|
| `SecurityConfig.java` | Security and CORS | Public routes, protected fallback, JWT filter | Which APIs are public? How is CORS handled? |
| `JwtService.java` | JWT create/validate | HMAC SHA-256, expiry, subject email | How is token generated? How is it validated? |
| `JwtAuthenticationFilter.java` | Reads Bearer token | Authorization header, SecurityContext, invalid token clears auth | What happens for protected requests? |
| `AuthServiceImpl.java` | Login | email lookup, BCrypt check, token response | How does login work? |
| `AdminUserSeeder.java` | First admin | env vars, BCrypt, creates only if no ADMIN | Are credentials hardcoded? |
| `AdminAccountServiceImpl.java` | Profile/password | current admin only, email uniqueness, password change | How can admin change password? |
| `GlobalExceptionHandler.java` | Error JSON | validation, not found, upload size | How are errors returned? |
| `ProjectServiceImpl.java` | Project CRUD | slug uniqueness, image upload, delete image | How does project create/update work? |
| `ServiceServiceImpl.java` | Service CRUD | no image, active public services, mapper | How are services managed? |
| `LeadershipServiceImpl.java` | Leadership CRUD | required image, Cloudinary replace, active list | How is team data managed? |
| `ClientReviewServiceImpl.java` | Reviews CRUD | optional image, rating, active list | How are reviews managed? |
| `EnquiryServiceImpl.java` | Contact form | save enquiry, status, emails | What happens after enquiry submit? |
| `SiteSettingsServiceImpl.java` | Settings singleton | get or create, logo upload, update settings | Why only one settings record? |
| `CloudinaryImageStorageService.java` | Image upload | formats, 5 MB, public ID | What is stored in DB? |
| `MailServiceImpl.java` | Resend emails | WebClient, sender, reply_to | How are emails sent? |
| `HealthController.java` | Monitoring | no DB, public, timestamp | Why is it lightweight? |
| `AppRoutes.jsx` | Frontend routes | public vs admin, redirects, data loading | Why does `/` not require login? |
| `axios.js` | API client | base URL, JWT interceptor, 401 handling | How is JWT attached? |
| `AuthContext.jsx` | Auth state | login, logout, localStorage | How does frontend remember login? |
| `projectsService.js` | Frontend project API | FormData, CRUD, shared Axios | How is image sent? |

---

## Part 19 - One-Page Revision Sheet

Project: Abhinav Infratek CMS, a construction company website plus admin CMS.

Architecture: React frontend calls Spring Boot REST APIs. Backend uses Controller -> Service -> Repository -> PostgreSQL.

Frontend: React, React Router, Axios, Lucide React, Vite, CSS. Public and admin routes are in `AppRoutes.jsx`.

Backend: Java 21, Spring Boot, Spring Security, custom JWT, JPA/Hibernate, WebClient, Cloudinary.

Database: PostgreSQL tables/entities for admin users, services, projects, leadership, client reviews, enquiries, site settings.

Authentication: Admin logs in with email/password. Password checked with BCrypt. Backend returns JWT. Frontend stores token and sends it with admin requests.

File Storage: Images uploaded to Cloudinary. DB stores image URL and public ID. PDF upload is not implemented.

Email: Resend sends company notification and customer acknowledgement after enquiry save. Sender is `Abhinav Infratek <info@abhinavinfratek.in>`.

Deployment: Frontend on Vercel, backend on Render, PostgreSQL on Render, Cloudinary for images, Resend for email.

Important APIs: `/api/auth/login`, `/api/projects`, `/api/enquiries`, `/api/admin/projects`, `/api/admin/dashboard`, `/api/admin/site-settings`, `/health`.

Important classes: `SecurityConfig`, `JwtService`, `JwtAuthenticationFilter`, `AuthServiceImpl`, `ProjectServiceImpl`, `CloudinaryImageStorageService`, `MailServiceImpl`, `HealthController`, `AppRoutes.jsx`, `axios.js`.

Main project flow: Visitor opens website, React loads public data from APIs. Admin logs in, gets JWT, uses CMS to manage content. Image uploads go to Cloudinary. Enquiries are saved and emailed through Resend.

---

## Top 25 Questions I Must Be Able To Answer

1. What is your project?
   - A full-stack CMS for a construction company with public website and admin panel.

2. What problem does it solve?
   - It lets company content be managed without code changes.

3. What technologies are used?
   - React, Axios, Spring Boot, Spring Security, JWT, PostgreSQL, Cloudinary, Resend, Vercel, Render.

4. How is the frontend structured?
   - Routes, public components, admin pages, reusable admin components, services, context, and styles.

5. How is the backend structured?
   - Controllers, DTOs, services, repositories, entities, mappers, security, config, exceptions.

6. How does login work?
   - Admin sends credentials, backend verifies password, generates JWT, frontend stores token.

7. How are admin APIs protected?
   - Spring Security requires JWT for all non-public endpoints.

8. How is JWT validated?
   - `JwtAuthenticationFilter` and `JwtService` validate token structure, signature, expiry, and username.

9. How is password stored?
   - BCrypt hash in `admin_users`.

10. How does project creation work?
    - FormData with image, Cloudinary upload, save project data and image metadata.

11. What happens if project image is updated?
    - New image uploads, old image is deleted, DB updates image URL/public ID.

12. What is Cloudinary used for?
    - Storing images and providing secure URLs.

13. Are PDFs supported?
    - Not implemented currently.

14. What is Resend used for?
    - Sending enquiry notification and acknowledgement emails.

15. What is `reply_to` used for?
    - Company notification email uses customer email as reply_to.

16. What happens when email fails?
    - Error is logged, enquiry remains saved because `EnquiryServiceImpl` catches RuntimeException.

17. Is email async?
    - Not in the current codebase.

18. What does `/health` do?
    - Returns simple UP status for monitoring without DB or external calls.

19. Why was HEAD allowed for `/health`?
    - UptimeRobot may use HEAD, so `/health` is public for all methods.

20. What is CORS?
    - It allows the Vercel frontend domain to call the Render backend.

21. What is a DTO?
    - A class that defines request/response data separate from the entity.

22. What is an entity?
    - A Java class mapped to a database table.

23. What is a repository?
    - A Spring Data interface for database operations.

24. What would you improve?
    - Add tests, pagination, async email, database migrations, and stronger monitoring.

25. Did you use AI?
    - Yes, I used Codex as an assistant, but I reviewed, integrated, tested, debugged, and learned the flows.
