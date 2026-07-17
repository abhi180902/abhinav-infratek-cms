-- Abhinav Infratek CMS database schema
-- PostgreSQL reference design.
-- Documentation-only SQL; not wired into backend migrations yet.

CREATE TABLE IF NOT EXISTS admin_users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(40) NOT NULL DEFAULT 'ADMIN',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users (active);

CREATE TABLE IF NOT EXISTS services (
    id BIGSERIAL PRIMARY KEY,
    slug VARCHAR(120) NOT NULL UNIQUE,
    icon_key VARCHAR(80) NOT NULL,
    title VARCHAR(160) NOT NULL,
    description TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_services_active_order ON services (active, display_order);

CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    slug VARCHAR(140) NOT NULL UNIQUE,
    title VARCHAR(180) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(80) NOT NULL,
    location VARCHAR(180) NOT NULL,
    project_year INTEGER NOT NULL,
    status VARCHAR(60) NOT NULL DEFAULT 'Completed',
    cover_image_url VARCHAR(500) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_projects_category ON projects (category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects (status);
CREATE INDEX IF NOT EXISTS idx_projects_active_order ON projects (active, display_order);

CREATE TABLE IF NOT EXISTS project_gallery_images (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(180),
    display_order INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_project_gallery_images_project
        FOREIGN KEY (project_id)
        REFERENCES projects (id)
        ON DELETE CASCADE,
    CONSTRAINT uq_project_gallery_images_project_url UNIQUE (project_id, image_url)
);

CREATE INDEX IF NOT EXISTS idx_project_gallery_project_id ON project_gallery_images (project_id);
CREATE INDEX IF NOT EXISTS idx_project_gallery_project_active_order ON project_gallery_images (project_id, active, display_order);

CREATE TABLE IF NOT EXISTS leadership_members (
    id BIGSERIAL PRIMARY KEY,
    slug VARCHAR(140) NOT NULL UNIQUE,
    full_name VARCHAR(160) NOT NULL,
    designation VARCHAR(160) NOT NULL,
    bio TEXT NOT NULL,
    profile_image_url VARCHAR(500),
    phone VARCHAR(40),
    email VARCHAR(160),
    linkedin_url VARCHAR(500),
    display_order INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_leadership_members_active_order ON leadership_members (active, display_order);

CREATE TABLE IF NOT EXISTS client_reviews (
    id BIGSERIAL PRIMARY KEY,
    slug VARCHAR(160) NOT NULL UNIQUE,
    client_name VARCHAR(160) NOT NULL,
    project_name VARCHAR(180) NOT NULL,
    location VARCHAR(180) NOT NULL,
    review TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5,
    project_image_url VARCHAR(500) NOT NULL,
    client_image_url VARCHAR(500),
    completed_year INTEGER,
    display_order INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_client_reviews_rating CHECK (rating BETWEEN 1 AND 5)
);

CREATE INDEX IF NOT EXISTS idx_client_reviews_active_order ON client_reviews (active, display_order);

CREATE TABLE IF NOT EXISTS enquiries (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    email VARCHAR(160) NOT NULL,
    phone VARCHAR(40),
    project_type VARCHAR(120),
    message TEXT NOT NULL,
    status VARCHAR(40) NOT NULL DEFAULT 'NEW',
    admin_notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries (status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries (created_at);

CREATE TABLE IF NOT EXISTS site_settings (
    id BIGSERIAL PRIMARY KEY,
    setting_key VARCHAR(120) NOT NULL UNIQUE,
    setting_value TEXT,
    value_type VARCHAR(40) NOT NULL DEFAULT 'TEXT',
    group_name VARCHAR(80) NOT NULL DEFAULT 'GENERAL',
    description VARCHAR(255),
    editable BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_site_settings_group_name ON site_settings (group_name);
