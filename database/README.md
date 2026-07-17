# Abhinav Infratek CMS Database Design

This directory documents the planned PostgreSQL schema for the Abhinav Infratek CMS. It is documentation-only at this stage and does not create backend entities, repositories, migrations, or Java code.

The backend currently contains only the authentication module, with the `AdminUser` JPA entity mapped to `admin_users`. The remaining tables below are planned for future CMS modules and are designed to match the current React frontend models.

## Design Principles

- Use `BIGSERIAL` primary keys for backend-managed records.
- Use `slug` fields for stable frontend/API identifiers where useful.
- Store image references as `VARCHAR` URL fields. Cloudinary is not implemented yet.
- Use `display_order` and `active` for homepage ordering and visibility.
- Use `created_at` and `updated_at` on all CMS-managed tables.
- Use relational design for multiple project gallery images instead of storing arrays in one column.

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
| `slug` | `VARCHAR(140)` | Not null, unique | Stable API/frontend key. |
| `title` | `VARCHAR(180)` | Not null | Project title. |
| `description` | `TEXT` | Not null | Project summary. |
| `category` | `VARCHAR(80)` | Not null | Project category, such as Residential or Commercial. |
| `location` | `VARCHAR(180)` | Not null | Project location. |
| `project_year` | `INTEGER` | Not null | Completion or active project year. |
| `status` | `VARCHAR(60)` | Not null, default `Completed` | Project status. |
| `cover_image_url` | `VARCHAR(500)` | Not null | Main project image URL. |
| `display_order` | `INTEGER` | Not null, default `0` | Homepage/admin ordering. |
| `active` | `BOOLEAN` | Not null, default `TRUE` | Public visibility flag. |
| `created_at` | `TIMESTAMP` | Not null, default `CURRENT_TIMESTAMP` | Record creation time. |
| `updated_at` | `TIMESTAMP` | Not null, default `CURRENT_TIMESTAMP` | Last update time. |

Indexes:
- Primary key on `id`
- Unique index on `slug`
- Index on `category`
- Index on `status`
- Composite index on `active, display_order`

### project_gallery_images

Purpose: Stores multiple gallery image URLs for each project. This is the recommended relational design for `galleryImages[]`.

| Column | Type | Constraints / Default | Purpose |
| --- | --- | --- | --- |
| `id` | `BIGSERIAL` | Primary key | Unique gallery image identifier. |
| `project_id` | `BIGINT` | Not null, foreign key to `projects(id)` | Parent project. |
| `image_url` | `VARCHAR(500)` | Not null | Gallery image URL. |
| `alt_text` | `VARCHAR(180)` | Nullable | Accessible image description. |
| `display_order` | `INTEGER` | Not null, default `0` | Gallery ordering. |
| `active` | `BOOLEAN` | Not null, default `TRUE` | Gallery image visibility flag. |
| `created_at` | `TIMESTAMP` | Not null, default `CURRENT_TIMESTAMP` | Record creation time. |
| `updated_at` | `TIMESTAMP` | Not null, default `CURRENT_TIMESTAMP` | Last update time. |

Indexes:
- Primary key on `id`
- Unique constraint on `project_id, image_url`
- Foreign key index on `project_id`
- Composite index on `project_id, active, display_order`

### leadership_members

Purpose: Stores unlimited leadership team members for the public homepage.

| Column | Type | Constraints / Default | Purpose |
| --- | --- | --- | --- |
| `id` | `BIGSERIAL` | Primary key | Unique leadership member identifier. |
| `slug` | `VARCHAR(140)` | Not null, unique | Stable API/frontend key. |
| `full_name` | `VARCHAR(160)` | Not null | Member full name. |
| `designation` | `VARCHAR(160)` | Not null | Role/title. |
| `bio` | `TEXT` | Not null | Short professional description. |
| `profile_image_url` | `VARCHAR(500)` | Nullable | Member profile image URL. |
| `phone` | `VARCHAR(40)` | Nullable | Contact phone number. |
| `email` | `VARCHAR(160)` | Nullable | Contact email. |
| `linkedin_url` | `VARCHAR(500)` | Nullable | LinkedIn profile URL. |
| `display_order` | `INTEGER` | Not null, default `0` | Homepage/admin ordering. |
| `active` | `BOOLEAN` | Not null, default `TRUE` | Public visibility flag. |
| `created_at` | `TIMESTAMP` | Not null, default `CURRENT_TIMESTAMP` | Record creation time. |
| `updated_at` | `TIMESTAMP` | Not null, default `CURRENT_TIMESTAMP` | Last update time. |

Indexes:
- Primary key on `id`
- Unique index on `slug`
- Composite index on `active, display_order`

### client_reviews

Purpose: Stores public client review cards with project imagery, client avatar support, ratings, and display ordering.

| Column | Type | Constraints / Default | Purpose |
| --- | --- | --- | --- |
| `id` | `BIGSERIAL` | Primary key | Unique client review identifier. |
| `slug` | `VARCHAR(160)` | Not null, unique | Stable API/frontend key. |
| `client_name` | `VARCHAR(160)` | Not null | Review author/client name. |
| `project_name` | `VARCHAR(180)` | Not null | Related project name. |
| `location` | `VARCHAR(180)` | Not null | Project/client location. |
| `review` | `TEXT` | Not null | Client review text. |
| `rating` | `INTEGER` | Not null, default `5`, check 1-5 | Star rating. |
| `project_image_url` | `VARCHAR(500)` | Not null | Completed project image URL. |
| `client_image_url` | `VARCHAR(500)` | Nullable | Client avatar/photo URL. |
| `completed_year` | `INTEGER` | Nullable | Completion year. |
| `display_order` | `INTEGER` | Not null, default `0` | Homepage/admin ordering. |
| `active` | `BOOLEAN` | Not null, default `TRUE` | Public visibility flag. |
| `created_at` | `TIMESTAMP` | Not null, default `CURRENT_TIMESTAMP` | Record creation time. |
| `updated_at` | `TIMESTAMP` | Not null, default `CURRENT_TIMESTAMP` | Last update time. |

Indexes:
- Primary key on `id`
- Unique index on `slug`
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

Purpose: Stores key-value site settings such as company details, contact info, homepage visibility controls, and future configuration values.

| Column | Type | Constraints / Default | Purpose |
| --- | --- | --- | --- |
| `id` | `BIGSERIAL` | Primary key | Unique setting identifier. |
| `setting_key` | `VARCHAR(120)` | Not null, unique | Stable setting key. |
| `setting_value` | `TEXT` | Nullable | Setting value. |
| `value_type` | `VARCHAR(40)` | Not null, default `TEXT` | Type hint for parsing/display. |
| `group_name` | `VARCHAR(80)` | Not null, default `GENERAL` | Admin grouping. |
| `description` | `VARCHAR(255)` | Nullable | Admin help text. |
| `editable` | `BOOLEAN` | Not null, default `TRUE` | Whether admins can edit this setting. |
| `created_at` | `TIMESTAMP` | Not null, default `CURRENT_TIMESTAMP` | Record creation time. |
| `updated_at` | `TIMESTAMP` | Not null, default `CURRENT_TIMESTAMP` | Last update time. |

Indexes:
- Primary key on `id`
- Unique index on `setting_key`
- Index on `group_name`

## Image Storage Notes

Cloudinary is not implemented yet. Until Cloudinary integration is added, image columns are documented as URL strings:

- `projects.cover_image_url`
- `project_gallery_images.image_url`
- `leadership_members.profile_image_url`
- `client_reviews.project_image_url`
- `client_reviews.client_image_url`

Future Cloudinary integration can continue storing secure delivery URLs in these fields, with optional future columns for provider public IDs if needed.

## Files

- `schema.sql`: PostgreSQL DDL reference for the planned schema.
- `sample-data.sql`: Seed data aligned with the current frontend mock data.
