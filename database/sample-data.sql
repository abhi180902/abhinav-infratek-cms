-- Abhinav Infratek CMS sample data
-- PostgreSQL reference seed data aligned with current frontend mocks.
-- Password below is a placeholder hash; production seeding is handled by the backend seeder.

INSERT INTO admin_users (full_name, email, password, role, active)
VALUES
    ('Abhinav Infratek Admin', 'admin@abhinavinfratek.com', '$2a$10$replace_with_backend_generated_bcrypt_hash', 'ADMIN', TRUE)
ON CONFLICT (email) DO NOTHING;

INSERT INTO services (slug, icon_key, title, description, display_order, active)
VALUES
    ('building-planning', 'planning', 'Building Planning', 'Practical building layouts shaped around site conditions, budget, approvals, and long-term usability.', 1, TRUE),
    ('elevation-design', 'elevation', '3D Elevation Design', 'Modern exterior concepts and visual direction that help clients understand the final built form.', 2, TRUE),
    ('estimation-valuation', 'estimation', 'Estimation & Valuation', 'Clear quantity, cost, and valuation support for confident project planning and decision-making.', 3, TRUE),
    ('structural-consultancy', 'structure', 'Structural Consultancy', 'Engineering guidance for safe, efficient, and durable structural systems across project types.', 4, TRUE),
    ('architectural-consultancy', 'architecture', 'Architectural Consultancy', 'Design consultation for residential and commercial spaces with a focus on function and quality.', 5, TRUE),
    ('interior-design', 'interior', 'Interior Design', 'Interior planning and detailing for comfortable, efficient, and polished living or work environments.', 6, TRUE),
    ('turnkey-projects', 'turnkey', 'Turnkey Projects', 'End-to-end project execution from planning to handover with coordinated site supervision.', 7, TRUE),
    ('building-approval', 'approval', 'Building Approval', 'Approval-focused documentation and coordination to support smooth project compliance workflows.', 8, TRUE),
    ('road-construction', 'road', 'Road Construction', 'Road construction and design services delivered with civil engineering discipline and site control.', 9, TRUE),
    ('civil-contract-supervision', 'supervision', 'Civil Contract & Supervision', 'Civil contract execution and supervision work focused on quality, progress, and accountability.', 10, TRUE)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects (title, slug, description, category, location, completion_date, image_url, image_public_id, display_order, featured, active)
VALUES
    ('Urban Residence', 'urban-residence', 'Contemporary residential planning with practical detailing and site-focused execution.', 'Residential', 'Ranebennur, Karnataka', '2025-04-15', 'https://res.cloudinary.com/demo/image/upload/abhinav-infratek/projects/urban-residence.jpg', 'abhinav-infratek/projects/urban-residence', 1, TRUE, TRUE),
    ('Business Center Fitout', 'business-center-fitout', 'Functional commercial space planning with structural coordination and turnkey support.', 'Commercial', 'Ranebennur, Karnataka', '2025-01-20', 'https://res.cloudinary.com/demo/image/upload/abhinav-infratek/projects/business-center-fitout.jpg', 'abhinav-infratek/projects/business-center-fitout', 2, FALSE, TRUE)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO leadership_members (name, designation, bio, image_url, image_public_id, display_order, active)
VALUES
    ('Er. Prasad S. Sangamad', 'Founder & Civil Engineer', 'Leads project planning, client coordination, and civil execution with a focus on quality, trust, and practical engineering.', 'https://res.cloudinary.com/demo/image/upload/abhinav-infratek/leadership/prasad-sangamad.png', 'abhinav-infratek/leadership/prasad-sangamad', 1, TRUE),
    ('Er. Pavanraj R. Patil', 'Co-Founder & Structural Engineer', 'Guides structural consultancy and engineering decisions for safe, efficient, and dependable construction outcomes.', 'https://res.cloudinary.com/demo/image/upload/abhinav-infratek/leadership/pavanraj-patil.png', 'abhinav-infratek/leadership/pavanraj-patil', 2, TRUE)
ON CONFLICT (image_public_id) DO NOTHING;

INSERT INTO client_reviews (client_name, company_name, designation, review, rating, image_url, image_public_id, display_order, active)
VALUES
    ('Ramesh Patil', NULL, 'Villa Owner', 'The team completed our dream home on time. Excellent planning, communication, and quality from concept to handover.', 5, 'https://res.cloudinary.com/demo/image/upload/abhinav-infratek/client-reviews/ramesh-patil.jpg', 'abhinav-infratek/client-reviews/ramesh-patil', 1, TRUE),
    ('Shweta Kulkarni', NULL, 'Homeowner', 'Abhinav Infratek made every construction stage clear and manageable. Their site supervision and design guidance gave us complete confidence.', 5, 'https://res.cloudinary.com/demo/image/upload/abhinav-infratek/client-reviews/shweta-kulkarni.jpg', 'abhinav-infratek/client-reviews/shweta-kulkarni', 2, TRUE);

INSERT INTO enquiries (name, email, phone, project_type, message, status)
VALUES
    ('Residential planning request', 'client@example.com', '+91 90000 00000', 'Building Planning', 'I would like to discuss planning for a residential project in Ranebennur.', 'NEW'),
    ('Road construction consultation', 'contractor@example.com', '+91 91111 11111', 'Road Construction', 'Please share the next steps for a road construction consultation.', 'NEW'),
    ('Interior design discussion', 'homeowner@example.com', '+91 92222 22222', 'Interior Design', 'We need interior design and execution support for a family home.', 'IN_REVIEW');

INSERT INTO site_settings (setting_key, setting_value, value_type, group_name, description, editable)
VALUES
    ('company_name', 'Abhinav Infratek', 'TEXT', 'COMPANY', 'Public company name.', TRUE),
    ('company_tagline', 'Engineers & Architects', 'TEXT', 'COMPANY', 'Public company tagline.', TRUE),
    ('location', 'Ranebennur, Karnataka', 'TEXT', 'COMPANY', 'Primary service location.', TRUE),
    ('address', 'Basavashree Nilaya, Vageesh Nagar 2nd Cross, Behind Adishakthi Temple, Medleri Road, Ranebennur - 581115, Haveri, Karnataka', 'TEXT', 'CONTACT', 'Registered office address.', TRUE),
    ('email', 'prasadsangamad162@gmail.com', 'EMAIL', 'CONTACT', 'Primary contact email.', TRUE),
    ('phone_primary', '+91 72593 4720', 'PHONE', 'CONTACT', 'Primary contact phone.', TRUE),
    ('phone_secondary', '+91 91102 71018', 'PHONE', 'CONTACT', 'Secondary contact phone.', TRUE),
    ('homepage_client_reviews_visible', 'true', 'BOOLEAN', 'HOMEPAGE', 'Controls Client Reviews section visibility.', TRUE),
    ('homepage_leadership_visible', 'true', 'BOOLEAN', 'HOMEPAGE', 'Controls Leadership Team section visibility.', TRUE)
ON CONFLICT (setting_key) DO NOTHING;
