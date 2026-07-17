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

INSERT INTO projects (slug, title, description, category, location, project_year, status, cover_image_url, display_order, active)
VALUES
    ('urban-residence', 'Urban Residence', 'Contemporary residential planning with practical detailing and site-focused execution.', 'Residential', 'Ranebennur, Karnataka', 2025, 'Completed', '/assets/images/hero.png', 1, TRUE),
    ('premium-villa-cluster', 'Premium Villa Cluster', 'Premium villa planning with elevation concepts, estimation, and quality supervision.', 'Residential', 'Haveri, Karnataka', 2024, 'Completed', '/assets/images/hero.png', 2, TRUE),
    ('business-center', 'Business Center Fitout', 'Functional commercial space planning with structural coordination and turnkey support.', 'Commercial', 'Ranebennur, Karnataka', 2025, 'In Progress', '/assets/images/hero.png', 3, TRUE),
    ('retail-frontage', 'Retail Frontage Upgrade', 'Modern retail frontage improvement with architectural detailing and civil execution.', 'Commercial', 'Haveri, Karnataka', 2023, 'Completed', '/assets/images/hero.png', 4, TRUE),
    ('fabrication-facility', 'Fabrication Facility', 'Industrial facility execution with durable civil work and supervision controls.', 'Industrial', 'Ranebennur, Karnataka', 2024, 'Completed', '/assets/images/hero.png', 5, TRUE),
    ('warehouse-expansion', 'Warehouse Expansion', 'Warehouse expansion with efficient planning, valuation support, and site management.', 'Industrial', 'Byadagi, Karnataka', 2023, 'Completed', '/assets/images/hero.png', 6, TRUE),
    ('civic-roadworks', 'Civic Roadworks', 'Roadwork execution with disciplined construction tracking and safety-focused delivery.', 'Infrastructure', 'Ranebennur, Karnataka', 2025, 'In Progress', '/assets/images/hero.png', 7, TRUE),
    ('stormwater-upgrade', 'Stormwater Upgrade', 'Drainage and stormwater improvement work with reliable civil supervision.', 'Infrastructure', 'Haveri, Karnataka', 2024, 'Completed', '/assets/images/hero.png', 8, TRUE)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO project_gallery_images (project_id, image_url, alt_text, display_order, active)
SELECT id, cover_image_url, title || ' gallery image', 1, TRUE
FROM projects
WHERE slug IN (
    'urban-residence',
    'premium-villa-cluster',
    'business-center',
    'retail-frontage',
    'fabrication-facility',
    'warehouse-expansion',
    'civic-roadworks',
    'stormwater-upgrade'
)
ON CONFLICT (project_id, image_url) DO NOTHING;

INSERT INTO leadership_members (slug, full_name, designation, bio, profile_image_url, phone, email, linkedin_url, display_order, active)
VALUES
    ('prasad-sangamad', 'Er. Prasad S. Sangamad', 'Founder & Civil Engineer', 'Leads project planning, client coordination, and civil execution with a focus on quality, trust, and practical engineering.', '/assets/images/prasad-sangamad.png', '+91 72593 4720', 'prasadsangamad162@gmail.com', NULL, 1, TRUE),
    ('pavanraj-patil', 'Er. Pavanraj R. Patil', 'Co-Founder & Structural Engineer', 'Guides structural consultancy and engineering decisions for safe, efficient, and dependable construction outcomes.', '/assets/images/pavanraj-patil.png', '+91 91102 71018', 'prasadsangamad162@gmail.com', NULL, 2, TRUE),
    ('hammad-maroof-imdadi', 'HAMMAD MAROOF IMDADI', 'Structural Engineer', 'M.Tech in Structural Engineering from Siddaganga Institute of Technology, Tumkur with CGPA 8.89/10, and B.E. in Civil Engineering from Sapthagiri College of Engineering, Bangalore with CGPA 7.86/10.', '/assets/images/hammad-maroof-imdadi.jpeg', '+91-6363878390', NULL, NULL, 3, TRUE)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO client_reviews (slug, client_name, project_name, location, review, rating, project_image_url, client_image_url, completed_year, display_order, active)
VALUES
    ('ramesh-patil-luxury-villa', 'Ramesh Patil', 'Luxury Villa', 'Ranebennur, Karnataka', 'The team completed our dream home on time. Excellent planning, communication, and quality from concept to handover.', 5, '/assets/images/hero.png', NULL, 2025, 1, TRUE),
    ('shweta-kulkarni-family-residence', 'Shweta Kulkarni', 'Family Residence', 'Haveri, Karnataka', 'Abhinav Infratek made every construction stage clear and manageable. Their site supervision and design guidance gave us complete confidence.', 5, '/assets/images/hero.png', NULL, 2024, 2, TRUE),
    ('arun-traders-commercial-frontage', 'Arun Traders', 'Commercial Frontage Upgrade', 'Ranebennur, Karnataka', 'Our commercial space was delivered with practical planning, reliable estimates, and disciplined execution. The final finish improved our customer experience.', 5, '/assets/images/hero.png', NULL, 2024, 3, TRUE),
    ('manjunath-industrial-shed', 'Manjunath H.', 'Industrial Shed', 'Byadagi, Karnataka', 'Their structural recommendations were clear and practical. The project moved smoothly because the team coordinated drawings, materials, and site execution well.', 5, '/assets/images/hero.png', NULL, 2023, 4, TRUE),
    ('savitha-interior-execution', 'Savitha N.', 'Interior Design & Execution', 'Haveri, Karnataka', 'The interiors were handled with attention to both beauty and daily use. Their suggestions helped us get a premium finish within our planned budget.', 5, '/assets/images/hero.png', NULL, 2023, 5, TRUE)
ON CONFLICT (slug) DO NOTHING;

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
