CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ===========================================
-- DATA SOURCES
-- ===========================================

CREATE TABLE IF NOT EXISTS data_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    source_type TEXT,
    license TEXT,
    attribution_text TEXT,
    source_url TEXT,
    last_updated DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- SPECIES REFERENCE
-- ===========================================

CREATE TABLE IF NOT EXISTS species_reference (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gbif_key TEXT,
    scientific_name TEXT NOT NULL,
    common_name TEXT,

    kingdom TEXT,
    class_name TEXT,
    order_name TEXT,
    family TEXT,
    genus TEXT,
    taxon_rank TEXT,

    region TEXT,
    conservation_notes TEXT,
    short_description TEXT,
    is_sensitive_location BOOLEAN DEFAULT FALSE,

    source TEXT,
    license TEXT,
    attribution TEXT,
    image_url TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS species_scientific_name_idx 
ON species_reference (scientific_name);

CREATE INDEX IF NOT EXISTS species_common_name_idx 
ON species_reference (common_name);

-- ===========================================
-- CITIZEN REPORTS
-- ===========================================

CREATE TABLE IF NOT EXISTS citizen_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title TEXT NOT NULL,
    description TEXT,

    category TEXT NOT NULL CHECK (
        category IN (
            'pollution',
            'fire',
            'deforestation',
            'habitat_damage',
            'injured_animal',
            'species_sighting',
            'illegal_activity',
            'other'
        )
    ),

    urgency TEXT NOT NULL CHECK (
        urgency IN (
            'low',
            'medium',
            'high',
            'critical'
        )
    ),

    status TEXT NOT NULL DEFAULT 'unverified' CHECK (
        status IN (
            'unverified',
            'reviewing',
            'resolved',
            'false_report',
            'closed'
        )
    ),

    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    location GEOGRAPHY(Point, 4326),

    public_latitude DOUBLE PRECISION,
    public_longitude DOUBLE PRECISION,

    country TEXT,
    city TEXT,

    image_url TEXT,

    ai_category TEXT,
    ai_summary TEXT,
    ai_urgency TEXT CHECK (
        ai_urgency IN (
            'low',
            'medium',
            'high',
            'critical'
        )
    ),

    related_species_id UUID REFERENCES species_reference(id) ON DELETE SET NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION set_report_location()
RETURNS TRIGGER AS $$
BEGIN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;

    IF NEW.public_latitude IS NULL THEN
        NEW.public_latitude = NEW.latitude;
    END IF;

    IF NEW.public_longitude IS NULL THEN
        NEW.public_longitude = NEW.longitude;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_report_location ON citizen_reports;

CREATE TRIGGER trigger_set_report_location
BEFORE INSERT OR UPDATE ON citizen_reports
FOR EACH ROW
EXECUTE FUNCTION set_report_location();

CREATE INDEX IF NOT EXISTS citizen_reports_location_idx
ON citizen_reports
USING GIST (location);

CREATE INDEX IF NOT EXISTS citizen_reports_category_idx
ON citizen_reports (category);

CREATE INDEX IF NOT EXISTS citizen_reports_urgency_idx
ON citizen_reports (urgency);

-- ===========================================
-- REPORT IMAGES
-- ===========================================

CREATE TABLE IF NOT EXISTS report_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES citizen_reports(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_type TEXT DEFAULT 'report_photo',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- SPECIES OCCURRENCES
-- ===========================================

CREATE TABLE IF NOT EXISTS species_occurrences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    gbif_occurrence_key TEXT,
    species_id UUID REFERENCES species_reference(id) ON DELETE SET NULL,

    scientific_name TEXT NOT NULL,

    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    location GEOGRAPHY(Point, 4326),

    event_date DATE,
    country TEXT,
    basis_of_record TEXT,

    license TEXT,
    source_dataset TEXT,
    source_url TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION set_occurrence_location()
RETURNS TRIGGER AS $$
BEGIN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_occurrence_location ON species_occurrences;

CREATE TRIGGER trigger_set_occurrence_location
BEFORE INSERT OR UPDATE ON species_occurrences
FOR EACH ROW
EXECUTE FUNCTION set_occurrence_location();

CREATE INDEX IF NOT EXISTS species_occurrences_location_idx
ON species_occurrences
USING GIST (location);

-- ===========================================
-- ENVIRONMENTAL EVENTS
-- ===========================================

CREATE TABLE IF NOT EXISTS environmental_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    event_type TEXT NOT NULL CHECK (
        event_type IN (
            'fire',
            'flood',
            'drought',
            'deforestation',
            'storm',
            'heatwave',
            'other'
        )
    ),

    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    location GEOGRAPHY(Point, 4326),

    public_latitude DOUBLE PRECISION,
    public_longitude DOUBLE PRECISION,

    confidence TEXT,
    source TEXT,
    source_url TEXT,

    detected_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION set_environmental_event_location()
RETURNS TRIGGER AS $$
BEGIN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;

    IF NEW.public_latitude IS NULL THEN
        NEW.public_latitude = NEW.latitude;
    END IF;

    IF NEW.public_longitude IS NULL THEN
        NEW.public_longitude = NEW.longitude;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_environmental_event_location ON environmental_events;

CREATE TRIGGER trigger_set_environmental_event_location
BEFORE INSERT OR UPDATE ON environmental_events
FOR EACH ROW
EXECUTE FUNCTION set_environmental_event_location();

CREATE INDEX IF NOT EXISTS environmental_events_location_idx
ON environmental_events
USING GIST (location);

-- ===========================================
-- MODEL PREDICTIONS
-- ===========================================

CREATE TABLE IF NOT EXISTS model_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    report_id UUID REFERENCES citizen_reports(id) ON DELETE CASCADE,

    predicted_common_name TEXT,
    predicted_scientific_name TEXT,
    confidence DOUBLE PRECISION,

    model_name TEXT DEFAULT 'gaia-animal-identifier',
    model_version TEXT DEFAULT 'prototype',

    prediction_status TEXT NOT NULL DEFAULT 'pending' CHECK (
        prediction_status IN (
            'unverified',
            'pending',
            'completed',
            'needs_review',
            'failed'
        )
    ),

    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TRAINING IMAGES
-- ===========================================

CREATE TABLE IF NOT EXISTS training_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    image_url TEXT NOT NULL,

    label_common_name TEXT,
    label_scientific_name TEXT,
    species_id UUID REFERENCES species_reference(id) ON DELETE SET NULL,

    source TEXT DEFAULT 'gaia_user_submission',
    license TEXT,
    attribution TEXT,

    split TEXT NOT NULL DEFAULT 'unassigned' CHECK (
        split IN (
            'train',
            'validation',
            'test',
            'unassigned'
        )
    ),

    review_status BOOLEAN DEFAULT FALSE,
    usable_for_training BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);