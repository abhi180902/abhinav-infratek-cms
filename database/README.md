# Abhinav Infratek CMS Database Design

This directory documents the planned PostgreSQL schema for the Abhinav Infratek CMS. It is documentation-only at this stage and does not create backend entities, repositories, migrations, or Java code.

The backend currently contains only the authentication module, with the `AdminUser` JPA entity mapped to `admin_users`. The remaining tables below are planned for future CMS modules and are designed to match the current React frontend models.

## Design Principles

- Use `BIGSERIAL` primary keys for backend-managed records.
- Use `slug` fields for stable frontend/API identifiers where useful.
- Store image references as `VARCHAR` URL fields. Modules that upload to Cloudinary also store the provider `public_id`.
- Use `display_order` and `active` for homepage ordering and visibility.
- Use `created_at` and `updated_at` on all CMS-managed tables.

## Tables

### admin_users

Purpose: Stores CMS administrator accounts for authentication and authorization. This table is based on the existing backend `AdminUser` entity.

| Column | Type | Constraints / Default | Purpose |
| --- | --- | --- | --- |
| `id` | `BIGSERIAL` | Primary key | Unique admin user identifier. |
| `full_name` | `VARCHAR(120)` | Not null | Administrator display name. |
| `email` | `VARCHAR(160)` | Not null, unique | Login email and JWT subject. |
| `password` | `VARCHAR(255)` | Not null | BCrypt hashed password. |
| `role` | `VARCHAR(40)` | Not null, default `ADMIN` | Authorization role. |
| `active` | `BOOLEAN` | Not null, default `TRUE` | Enables or disables admin login. |
| `created_at` | `TIMESTAMP` | Not null, default `CURRENT_TIMESTAMP` | Record creation time. |
| `updated_at` | `TIMESTAMP` | Not null, default `CURRENT_TIMESTAMP` | Last update time. |

Indexes:
- Primary key on `id`
- Unique index on `email`
- Index on `active`

### services

Purpose: Stores public service cards shown on the homepage and managed by the CMS.

| Column | Type | Constraints / Default | Purpose |
| --- | --- | --- | --- |
| `id` | `BIGSERIAL` | Primary key | Unique service identifier. |
| `slug` | `VARCHAR(120)` | Not null, unique | Stable API/frontend key. |
| `icon_key` | `VARCHAR(80)` | Not null | Frontend icon mapping key. |
| `title` | `VARCHAR(160)` | Not null | Service name. |
| `description` | `TEXT` | Not null | Short public service description. |
| `display_order` | `INTEGER` | Not null, default `0` | Homepage/admin ordering. |
| `active` | `BOOLEAN` | Not null, default `TRUE` | Public visibility flag. |
| `created_at` | `TIMESTAMP` | Not null, default `CURRENT_TIMESTAMP` | Record creation time. |
| `updated_at` | `TIMESTAMP` | Not null, default `CURRENT_TIMESTAMP` | Last update time. |

Indexes:
- Primary key on `id`
- Unique index on `slug`
- Composite index on `active, display_order`

### projects

Purpose: Stores portfolio projects shown on the public website and managed by the CMS.

| Column | Type | Constraints / Default | Purpose |
| --- | --- | --- | --- |
| `id` | `BIGSERIAL` | Primary key | Unique project identifier. |
| `title` | `VARCHAR(150)` | Not null | Project title. |
| `slug` | `VARCHAR(170)` | Not null, unique | Stable API/frontend key. |
| `description` | `TEXT` | Not null | Project summary. |
| `category` | `VARCHAR(100)` | Not null | Project category, such as Residential or Commercial. |
| `location` | `VARCHAR(150)` | Nullable | Project location. |
| `completion_date` | `DATE` | Nullable | Project completion date. |
| `image_url` | `TEXT` | Not null | Cloudinary secure project image URL. |
| `image_public_id` | `VARCHAR(255)` | Not null, unique | Cloudinary public ID used for replace/delete operations. |
| `display_order` | `INTEGER` | Not null, default `0` | Homepage/admin ordering. |
| `featured` | `BOOLEAN` | Not null, default `FALSE` | Marks highlighted projects for future UI use. |
| `active` | `BOOLEAN` | Not null, default `TRUE` | Public visibility flag. |
| `created_at` | `TIMESTAMP` | Not null, default `CURRENT_TIMESTAMP` | Record creation time. |
| `updated_at` | `TIMESTAMP` | Not null, default `CURRENT_TIMESTAMP` | Last update time. |

Indexes:
- Primary key on `id`
- Unique index on `slug`
- Unique constraint on `image_public_id`
- Index on `category`
- Composite index on `active, display_order`
- Composite index on `featured, active`

### leadership_members

Purpose: Stores unlimited leadership team members for the public homepage.

| Column | Type | Constraints / Default | Purpose |
| --- | --- | --- | --- |
| `id` | `BIGSERIAL` | Primary key | Unique leadership member identifier. |
| `name` | `VARCHAR(120)` | Not null | Member display name. |
| `designation` | `VARCHAR(120)` | Not null | Role/title. |
| `bio` | `TEXT` | Nullable | Short professional description. |
| `image_url` | `VARCHAR(500)` | Not null | Cloudinary secure image URL. |
| `image_public_id` | `VARCHAR(255)` | Not null, unique | Cloudinary public ID used for replace/delete operations. |
| `display_order` | `INTEGER` | Not null, default `0` | Homepage/admin ordering. |
| `active` | `BOOLEAN` | Not null, default `TRUE` | Public visibility flag. |
| `created_at` | `TIMESTAMP` | Not null, default `CURRENT_TIMESTAMP` | Record creation time. |
| `updated_at` | `TIMESTAMP` | Not null, default `CURRENT_TIMESTAMP` | Last update time. |

Indexes:
- Primary key on `id`
- Unique constraint on `image_public_id`
- Composite index on `active, display_order`

### client_reviews

Purpose: Stores public client review cards with optional reviewer imagery, ratings, and display ordering.

| Column | Type | Constraints / Default | Purpose |
| --- | --- | --- | --- |
| `id` | `BIGSERIAL` | Primary key | Unique client review identifier. |
| `client_name` | `VARCHAR(120)` | Not null | Review author/client name. |
| `company_name` | `VARCHAR(150)` | Nullable | Client company name, if applicable. |
| `designation` | `VARCHAR(120)` | Nullable | Client designation or relationship to project. |
| `review` | `TEXT` | Not null | Client review text. |
| `rating` | `INTEGER` | Not null, check 1-5 | Star rating. |
| `image_url` | `TEXT` | Nullable | Optional Cloudinary secure reviewer image URL. |
| `image_public_id` | `VARCHAR(255)` | Nullable | Optional Cloudinary public ID used for replace/delete operations. |
| `display_order` | `INTEGER` | Not null, default `0` | Homepage/admin ordering. |
| `active` | `BOOLEAN` | Not null, default `TRUE` | Public visibility flag. |
| `created_at` | `TIMESTAMP` | Not null, default `CURRENT_TIMESTAMP` | Record creation time. |
| `updated_at` | `TIMESTAMP` | Not null, default `CURRENT_TIMESTAMP` | Last update time. |

Indexes:
- Primary key on `id`
- Composite index on `active, display_order`
- Check constraint on `rating` between 1 and 5

### enquiries

Purpose: Stores public contact form submissions for admin review.

| Column | Type | Constraints / Default | Purpose |
| --- | --- | --- | --- |
| `id` | `BIGSERIAL` | Primary key | Unique enquiry identifier. |
| `name` | `VARCHAR(160)` | Not null | Sender name. |
| `email` | `VARCHAR(160)` | Not null | Sender email. |
| `phone` | `VARCHAR(40)` | Nullable | Sender phone. |
| `project_type` | `VARCHAR(120)` | Nullable | Selected project/service interest. |
| `message` | `TEXT` | Not null | Enquiry details. |
| `status` | `VARCHAR(40)` | Not null, default `NEW` | Admin workflow status. |
| `admin_notes` | `TEXT` | Nullable | Internal admin notes. |
| `created_at` | `TIMESTAMP` | Not null, default `CURRENT_TIMESTAMP` | Submission time. |
| `updated_at` | `TIMESTAMP` | Not null, default `CURRENT_TIMESTAMP` | Last update time. |

Indexes:
- Primary key on `id`
- Index on `status`
- Index on `created_at`

### site_settings

Purpose: Stores the singleton website-wide settings record used by the public website and admin CMS.

| Column | Type | Constraints / Default | Purpose |
| --- | --- | --- | --- |
| `id` | `BIGSERIAL` | Primary key | Singleton settings identifier. |
| `company_name` | `VARCHAR(150)` | Not null | Public company name. |
| `tagline` | `VARCHAR(200)` | Nullable | Company tagline. |
| `phone` | `VARCHAR(40)` | Nullable | Primary phone number. |
| `alternate_phone` | `VARCHAR(40)` | Nullable | Secondary phone number. |
| `email` | `VARCHAR(160)` | Nullable | Primary contact email. |
| `address` | `TEXT` | Nullable | Company address. |
| `hero_title` | `VARCHAR(200)` | Nullable | Homepage hero headline. |
| `hero_subtitle` | `TEXT` | Nullable | Homepage hero supporting copy. |
| `about_company` | `TEXT` | Nullable | Public about/company description. |
| `logo_url` | `TEXT` | Nullable | Cloudinary secure logo URL. |
| `logo_public_id` | `VARCHAR(255)` | Nullable | Cloudinary public ID used for logo replace/delete operations. |
| `facebook_url` | `VARCHAR(500)` | Nullable | Facebook profile URL. |
| `instagram_url` | `VARCHAR(500)` | Nullable | Instagram profile URL. |
| `linkedin_url` | `VARCHAR(500)` | Nullable | LinkedIn profile URL. |
| `youtube_url` | `VARCHAR(500)` | Nullable | YouTube channel URL. |
| `google_maps_embed_url` | `TEXT` | Nullable | Google Maps embed URL. |
| `created_at` | `TIMESTAMP` | Not null, default `CURRENT_TIMESTAMP` | Record creation time. |
| `updated_at` | `TIMESTAMP` | Not null, default `CURRENT_TIMESTAMP` | Last update time. |

Indexes:
- Primary key on `id`

## Image Storage Notes

Image columns store Cloudinary secure delivery URLs where upload support exists. Modules that replace or delete uploaded assets also store Cloudinary public IDs.

- `projects.image_url`
- `projects.image_public_id`
- `leadership_members.image_url`
- `leadership_members.image_public_id`
- `client_reviews.image_url`
- `client_reviews.image_public_id`
- `site_settings.logo_url`
- `site_settings.logo_public_id`

Future modules should follow the same pattern when they need image replacement or deletion.

## Files

- `schema.sql`: PostgreSQL DDL reference for the planned schema.
- `sample-data.sql`: Seed data aligned with the current frontend mock data.
