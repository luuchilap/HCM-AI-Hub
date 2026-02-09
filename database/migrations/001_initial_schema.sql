-- ============================================================
-- HCMC AI Hub - Initial Database Schema
-- Database: Neon (PostgreSQL)
-- Created: 2026-02-09
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. USERS TABLE
-- Stores user accounts with authentication and profile data
-- ============================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),               -- For email/password auth (bcrypt)
    name VARCHAR(255),
    image VARCHAR(500),                        -- OAuth profile image URL
    email_verified_at TIMESTAMPTZ,
    phone VARCHAR(20),
    phone_verified_at TIMESTAMPTZ,
    role VARCHAR(20) NOT NULL DEFAULT 'member'
        CHECK (role IN ('admin', 'member')),
    -- Extended profile fields
    job_title VARCHAR(255),
    organization VARCHAR(255),
    expertise TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    bio_image_url VARCHAR(500),                -- Uploaded bio/profile image
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================
-- 2. EVENTS TABLE
-- Stores events with bilingual (Vietnamese/English) content
-- Uses _vi/_en suffix pattern for localized fields
-- ============================================================
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    -- Bilingual title
    title_vi VARCHAR(500) NOT NULL,
    title_en VARCHAR(500) NOT NULL,
    -- Event type
    type VARCHAR(20) NOT NULL
        CHECK (type IN ('conference', 'workshop', 'forum', 'symposium', 'seminar')),
    -- Bilingual subtitle (optional)
    subtitle_vi VARCHAR(500),
    subtitle_en VARCHAR(500),
    -- Bilingual description (rich text)
    description_vi TEXT NOT NULL,
    description_en TEXT NOT NULL,
    -- Bilingual target audience (optional)
    target_audience_vi TEXT,
    target_audience_en TEXT,
    -- Date & time
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    -- Venue info (embedded, bilingual name)
    venue_name_vi VARCHAR(255) NOT NULL,
    venue_name_en VARCHAR(255) NOT NULL,
    venue_address VARCHAR(500) NOT NULL,
    venue_city VARCHAR(100) NOT NULL,
    venue_google_maps_url VARCHAR(500),
    -- Registration settings
    registration_deadline DATE,
    registration_url VARCHAR(500),              -- External registration fallback URL
    qr_code_url VARCHAR(500),
    banner_image VARCHAR(500),
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'published', 'upcoming', 'past', 'cancelled')),
    max_attendees INTEGER,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Event indexes
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_featured ON events(is_featured) WHERE is_featured = TRUE;

-- ============================================================
-- 3. EVENT AGENDA ITEMS TABLE
-- Normalized agenda items for each event (bilingual)
-- ============================================================
CREATE TABLE event_agenda_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    -- Bilingual title
    title_vi VARCHAR(500) NOT NULL,
    title_en VARCHAR(500) NOT NULL,
    -- Bilingual description (optional)
    description_vi TEXT,
    description_en TEXT,
    -- Time slot (e.g., "09:00 - 09:30")
    time_slot VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Agenda indexes
CREATE INDEX idx_agenda_event_id ON event_agenda_items(event_id);
CREATE INDEX idx_agenda_sort ON event_agenda_items(event_id, sort_order);

-- ============================================================
-- 4. REGISTRATIONS TABLE
-- Event registrations linking attendees to events
-- ============================================================
CREATE TABLE registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    organization VARCHAR(255) NOT NULL,
    role VARCHAR(100),                          -- Attendee's job role/title
    organization_type VARCHAR(20)
        CHECK (organization_type IN ('university', 'tech_company', 'government_other')),
    suggestions TEXT,                           -- Guest questions/suggestions
    dietary_requirements TEXT,                  -- Legacy field for backward compat
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- One registration per email per event
    UNIQUE(event_id, email)
);

-- Registration indexes
CREATE INDEX idx_registrations_event ON registrations(event_id);
CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_registrations_user ON registrations(user_id);
CREATE INDEX idx_registrations_status ON registrations(event_id, status);

-- ============================================================
-- 5. TEAM MEMBERS TABLE
-- Executive board and network members
-- ============================================================
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_key VARCHAR(100) UNIQUE NOT NULL,    -- URL-friendly key, e.g., "mai-thanh-phong"
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    image VARCHAR(500),                         -- Photo URL/path
    -- Organization & role (stored directly, not i18n keys)
    organization VARCHAR(255),
    role_title VARCHAR(255),                    -- e.g., "AI Researcher"
    bio TEXT,
    -- Executive board info
    is_core_member BOOLEAN DEFAULT FALSE,
    exec_role VARCHAR(100),                     -- e.g., "Chairman", "Secretary"
    sort_order INTEGER DEFAULT 0,
    -- Link to user account if they've registered
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Team member indexes
CREATE INDEX idx_team_members_key ON team_members(member_key);
CREATE INDEX idx_team_members_core ON team_members(is_core_member) WHERE is_core_member = TRUE;
CREATE INDEX idx_team_members_user ON team_members(user_id);

-- ============================================================
-- 6. CONTACT MESSAGES TABLE
-- Stores messages from the contact form
-- ============================================================
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(500),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contact_messages_read ON contact_messages(is_read);

-- ============================================================
-- 7. NEWSLETTER SUBSCRIBERS TABLE
-- Email subscribers for newsletter
-- ============================================================
CREATE TABLE newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_active ON newsletter_subscribers(is_active) WHERE is_active = TRUE;

-- ============================================================
-- TRIGGER: Auto-update updated_at timestamp
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_registrations_updated_at
    BEFORE UPDATE ON registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
    BEFORE UPDATE ON team_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
