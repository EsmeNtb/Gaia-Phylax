CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

create table if not exists species_reference (
  id uuid primary key default gen_random_uuid(),
  gbif_key text,
  common_name text not null,
  scientific_name text not null,
  kingdom text,
  class_name text,
  order_name text,
  family text,
  genus text,
  taxon_rank text,
  conservation_note text,
  short_description text,
  region text,
  image_url text,
  source text default 'GBIF',
  license text default 'CC BY 4.0',
  attribution text,
  created_at timestamp with time zone default now()
);

create table if not exists citizen_reports (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null,
  latitude numeric not null,
  longitude numeric not null,
  country text,
  city text,
  urgency text default 'medium',
  status text default 'unverified',
  image_url text,
  related_species text,
  ai_category text,
  ai_summary text,
  created_at timestamp with time zone default now()
);

create table if not exists environmental_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null default 'fire',
  latitude numeric not null,
  longitude numeric not null,
  country text,
  region text,
  detected_at timestamp with time zone,
  confidence text,
  brightness numeric,
  frp numeric,
  satellite text,
  instrument text,
  source text default 'NASA FIRMS',
  source_url text,
  created_at timestamp with time zone default now()
);

create table if not exists fire_nasa (
  id bigserial primary key,
  latitude double precision,
  longitude double precision,
  confidence text,
  frp double precision,
  brightness double precision,
  daynight text,
  detected_at_utc timestamp,
  fire_intensity text
);

create index if not exists idx_fire_nasa_intensity
on fire_nasa(fire_intensity);

create index if not exists idx_fire_nasa_detected_at
on fire_nasa(detected_at_utc);

create index if not exists idx_fire_nasa_location
on fire_nasa(latitude, longitude);

create table if not exists animalia_species_catalog (
  id bigserial primary key,
  taxon_id bigint,
  parent_name_usage_id bigint,
  accepted_name_usage_id bigint,
  taxonomic_status text,
  taxon_rank text,
  scientific_name text,
  scientific_name_authorship text,
  kingdom text,
  phylum text,
  class_name text,
  order_name text,
  family text,
  genus text,
  higher_classification text,
  tax_group text
);

create index if not exists idx_species_scientific_name
on animalia_species_catalog(scientific_name);

create index if not exists idx_species_taxon_rank
on animalia_species_catalog(taxon_rank);

create table if not exists animalia_taxonomy (
  id bigserial primary key,
  taxon_id bigint,
  parent_name_usage_id bigint,
  accepted_name_usage_id bigint,
  taxonomic_status text,
  taxon_rank text,
  scientific_name text,
  scientific_name_authorship text,
  kingdom text,
  phylum text,
  class_name text,
  order_name text,
  family text,
  genus text,
  higher_classification text,
  tax_group text
);

create index if not exists idx_taxonomy_scientific_name
on animalia_taxonomy(scientific_name);

create index if not exists idx_taxonomy_taxon_id
on animalia_taxonomy(taxon_id);

create table if not exists citizen_reports (
  id bigserial primary key,
  title text,
  description text,
  category text,
  latitude double precision,
  longitude double precision,
  country text,
  city text,
  urgency text,
  status text,
  related_species text,
  created_at timestamp with time zone default now()
);