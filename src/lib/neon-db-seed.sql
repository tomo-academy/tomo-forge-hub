-- TOMO Academy NeonDB Seed Data
-- Run this after creating the schema to populate initial data

-- Insert Employees
INSERT INTO employees (id, name, role, department, email, phone, employee_id, join_date, avatar_url, bio, skills, location, availability, stats, card_color) VALUES
('kanish-sj', 'Kanish SJ', 'Lead Developer & Channel Manager', 'Technology', 'kanish.sj@tomoacademy.com', '+91 9940375600', 'TOMO-001', '2025-08-15', '/kanish.jpg', 'Full-stack developer and channel manager leading the technical vision for TOMO Academy.', '["React", "TypeScript", "Node.js", "Firebase", "YouTube API", "Team Leadership"]', 'salem, Tamilnadu, India', 'available', '{"videos": 28, "tasks": 165, "rating": 4.9, "projects": 24}', 'primary'),

('kamesh', 'Kamesh AJ', 'Senior Video Editor & UI Designer', 'Content Production', 'kamesh@tomoacademy.com', '+91 9385718659', 'TOMO-002', '2025-08-15', '/kamesh.jpg', 'Multi-talented video editor and UI designer with expertise in creating engaging educational content.', '["Video Editing", "UI Design", "Adobe Premiere", "After Effects", "Figma", "Motion Graphics"]', 'salem, tamilnadu, India', 'busy', '{"videos": 156, "tasks": 89, "rating": 4.8, "projects": 45}', 'accent'),

('aditya-chaurasiya', 'Aditya Chaurasiya', 'Video Editor & Social Media Manager', 'Content Production', 'aditya.chaurasiya@tomoacademy.com', '+91 98765 43212', 'TOMO-003', '2021-02-10', '/placeholder.jpg', 'Creative video editor specializing in social media content and cross-platform optimization.', '["Video Editing", "Social Media", "Content Strategy", "Adobe Creative Suite", "Analytics"]', 'Mumbai, India', 'available', '{"videos": 134, "tasks": 76, "rating": 4.7, "projects": 38}', 'success'),

('kavyashree', 'Kavyashree', 'Video Editor & Content Creator', 'Content Production', 'kavyashree@tomoacademy.com', '+91 93450 44033', 'TOMO-004', '2025-08-15', '/Kavyashree.jpg', 'Talented video editor and content creator with a passion for storytelling.', '["Video Editing", "Storytelling", "Color Grading", "Sound Design", "DaVinci Resolve"]', 'Salem, Tamilnadu, India', 'available', '{"videos": 98, "tasks": 67, "rating": 4.6, "projects": 29}', 'warning'),

('monika', 'Monika', 'Video Editor & Graphics Designer', 'Content Production', 'monika@tomoacademy.com', '+91 98765 43214', 'TOMO-005', '2022-01-20', '/placeholder.jpg', 'Creative video editor and graphics designer specializing in visual storytelling.', '["Video Editing", "Graphic Design", "Photoshop", "Illustrator", "Animation"]', 'Chennai, India', 'busy', '{"videos": 87, "tasks": 54, "rating": 4.5, "projects": 31}', 'destructive'),

('ajay-krithick', 'Ajay Krithick', 'Content Strategist & Script Writer', 'Content Strategy', 'ajay.krithick@tomoacademy.com', '+91 98765 43215', 'TOMO-006', '2021-03-10', '/placeholder.jpg', 'Content strategist with a passion for creating engaging educational material.', '["Content Strategy", "Script Writing", "SEO", "Research", "Educational Design"]', 'Mumbai, India', 'available', '{"videos": 89, "tasks": 134, "rating": 4.7, "projects": 32}', 'primary'),

('haridharuson-lj', 'Haridharuson L.J', 'Head Of Content Verification', 'HoD of Content Verification', 'haridharuson.lj@tomoacademy.com', '+91 9345304086', 'TOMO-007', '2025-07-05', '/haridharuson.jpg', 'Technical writer and research analyst specializing in emerging technologies.', '["Technical Writing", "Research", "Documentation", "Data Analysis", "Python"]', 'Salem, Tamilnadu, India', 'available', '{"videos": 45, "tasks": 98, "rating": 4.6, "projects": 28}', 'accent'),

('nithish', 'Nithish', 'Senior Full Stack Developer', 'Technology', 'nithish@tomoacademy.com', '+91 98765 43217', 'TOMO-008', '2020-08-20', '/placeholder.jpg', 'Senior full-stack developer with expertise in modern web technologies.', '["React", "Node.js", "MongoDB", "AWS", "Docker", "Microservices"]', 'Bangalore, India', 'busy', '{"videos": 12, "tasks": 156, "rating": 4.8, "projects": 42}', 'success'),

('dev', 'Dev M K', 'Hod Of marketing', 'Marketing', 'dev@tomoacademy.com', '+91 8438074241', 'TOMO-009', '2025-05-01', '/dev.jpg', 'Full-stack developer specializing in modern web technologies and API development.', '["JavaScript", "React", "Express", "PostgreSQL", "REST APIs", "Git"]', 'Salem, Ponnamapet, Tamilnadu India', 'available', '{"videos": 8, "tasks": 76, "rating": 4.5, "projects": 18}', 'warning'),

('raaj-nikitaa', 'Raaj Nikitaa', 'Lead Designer & Brand Manager', 'Design', 'raaj.nikitaa@tomoacademy.com', '+91 98765 43219', 'TOMO-010', '2020-08-20', '/placeholder.jpg', 'Creative lead designer specializing in thumbnails, UI/UX, and brand identity.', '["UI/UX Design", "Brand Identity", "Thumbnail Design", "Figma", "Adobe XD", "Typography"]', 'Hyderabad, India', 'available', '{"videos": 234, "tasks": 98, "rating": 4.9, "projects": 67}', 'primary'),

('nithyasri', 'Nithyasri', 'Content Writer & Social Media Specialist', 'Marketing', 'nithyasri@tomoacademy.com', '+91 98765 43220', 'TOMO-011', '2021-11-15', '/placeholder.jpg', 'Content writer and social media specialist focused on creating engaging content.', '["Content Writing", "Social Media Marketing", "Copywriting", "SEO", "Community Management"]', 'Chennai, India', 'available', '{"videos": 67, "tasks": 89, "rating": 4.6, "projects": 34}', 'accent'),

('indhumathi', 'Indhumathi', 'Marketing Manager & Content Planner', 'Marketing', 'indhumathi@tomoacademy.com', '+91 98765 43221', 'TOMO-012', '2021-09-10', '/placeholder.jpg', 'Marketing manager with expertise in content planning and campaign management.', '["Marketing Strategy", "Content Planning", "Campaign Management", "Analytics", "Project Management"]', 'Coimbatore, India', 'busy', '{"videos": 45, "tasks": 112, "rating": 4.7, "projects": 29}', 'success'),

('keerthana', 'Keerthana', 'Content Verifier & Quality Analyst', 'Quality Assurance', 'keerthana@tomoacademy.com', '+91 98765 43222', 'TOMO-013', '2022-03-01', '/placeholder.jpg', 'Content verifier and quality analyst ensuring all educational content meets high standards.', '["Quality Assurance", "Content Review", "Attention to Detail", "Process Improvement", "Documentation"]', 'Chennai, India', 'available', '{"videos": 189, "tasks": 145, "rating": 4.8, "projects": 23}', 'warning'),

('Gowsika', 'Gowsika', 'Joint Editor (Insta)', 'Editor', 'Gowsika@tomoacademy.com', '+91 9342247332', 'TOMO-014', '2025-11-15', '/placeholder.jpg', 'Content writer and social media specialist focused on creating engaging content.', '["Content Writing", "Social Media Marketing", "Copywriting", "SEO", "Community Management"]', 'Thiruchengodu,Tamilnadu India', 'available', '{"videos": 67, "tasks": 89, "rating": 4.6, "projects": 34}', 'accent'),

('prawin-krishnan', 'Prawin Krishnan', 'Finance Manager & Operations Head', 'Finance', 'prawin.krishnan@tomoacademy.com', '+91 98765 43223', 'TOMO-015', '2020-11-01', '/placeholder.jpg', 'Finance manager and operations head overseeing financial planning and operational efficiency.', '["Financial Planning", "Operations Management", "Budgeting", "Excel", "Strategic Planning", "Team Leadership"]', 'Mumbai, India', 'available', '{"videos": 15, "tasks": 87, "rating": 4.9, "projects": 19}', 'destructive')
ON CONFLICT (id) DO NOTHING;

-- Insert Current Month Revenue
INSERT INTO revenue (id, month, year, total_revenue, ad_revenue, sponsorships, memberships, merchandise, courses) VALUES
('rev-2025-10', 'October', 2025, 3247.00, 2156.00, 891.00, 200.00, 0.00, 0.00)
ON CONFLICT (month, year) DO NOTHING;

-- Insert Recent Activities
INSERT INTO activities (id, user_id, user_name, action, title, type) VALUES
('act-001', 'kanish-sj', 'Kanish SJ', 'uploaded new video', 'Firebase Tutorial - Part 5', 'video'),
('act-002', 'kamesh', 'Kamesh AJ', 'completed design task', 'Thumbnail for Tech Review', 'task'),
('act-003', 'ajay-krithick', 'Ajay Krithick', 'reviewed and approved', 'Script: AI in Education', 'task'),
('act-004', 'kavyashree', 'Kavyashree', 'edited video', 'React Hooks Tutorial', 'video'),
('act-005', 'dev', 'Dev M K', 'updated platform', 'Analytics Dashboard Enhancement', 'system')
ON CONFLICT (id) DO NOTHING;

-- Insert Today's Analytics
INSERT INTO analytics (id, date, subscribers, views, watch_time, engagement, revenue, videos_published, tasks_completed, team_productivity) VALUES
('analytics-today', CURRENT_DATE, 125000, 5600000, 500000, 87.5, 3247.00, 234, 89, 92.3)
ON CONFLICT (date) DO UPDATE SET
  subscribers = EXCLUDED.subscribers,
  views = EXCLUDED.views,
  watch_time = EXCLUDED.watch_time,
  engagement = EXCLUDED.engagement,
  revenue = EXCLUDED.revenue,
  videos_published = EXCLUDED.videos_published,
  tasks_completed = EXCLUDED.tasks_completed,
  team_productivity = EXCLUDED.team_productivity;
