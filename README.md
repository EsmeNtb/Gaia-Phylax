# GAIA PHYLAX

**Gaia Phylax** is a web application designed to amplify the voice of the environment.

The platform turns citizen observations into visible environmental alerts through an interactive map and a community bulletin board. Users can report damaged habitats, pollution, fires, injured animals, endangered species threats, illegal hunting or fishing, and other environmental issues happening near them or around the world.

Gaia Phylax combines citizen reports, biodiversity datasets, environmental alert data, and AI-assisted classification concepts to make conservation more visible, local, and actionable.

---

## Project Vision

Environmental damage is often invisible until it becomes a crisis.

Many people see pollution, habitat destruction, injured animals, or ecosystem threats in their communities, but there is no simple way to report, organize, and visualize this information.

Gaia Phylax aims to become a citizen-powered environmental signal system: a place where people can document what is happening, understand the urgency of local issues, and connect environmental awareness with real action.

The long-term vision is to support ethical conservation workflows, including delayed or blurred locations for sensitive species, routing reports to nearby animal welfare organizations or authorities, and helping communities prioritize urgent environmental issues without exposing vulnerable wildlife to additional risk.

---

## Current MVP

This prototype currently includes:

* User authentication with Supabase Auth
* Citizen environmental report submission
* Image upload through Supabase Storage
* Interactive environmental map
* Community bulletin board
* Urgent reports page
* Report view and boost counters
* NASA FIRMS fire signal visualization
* Animalia taxonomy dataset connection
* Eco-pet gamification system
* Profile and logout flow

---

## Core Features

### 1. Interactive Environmental Map

Users can explore an interactive map showing citizen-submitted environmental reports and environmental fire signals.

Each report includes:

* Location
* Photo
* Description
* Alert category
* Urgency level
* Date submitted

### 2. Community Bulletin Board

A visual feed where users can browse recent reports from the community.

The bulletin board helps users understand what is happening through photos, descriptions, engagement signals, and local context.

Reports display:

* Category
* Urgency
* Image
* Views
* Boosts
* Location context

### 3. Report Submission

Users can submit environmental alerts such as:

* Pollution
* Fire or smoke
* Deforestation
* Habitat damage
* Injured animals
* Endangered species sightings
* Illegal hunting or fishing
* Water contamination
* Flooding
* Other environmental threats

### 4. Alert Categories and Urgency Levels

Each report can be categorized by issue type and urgency.

Urgency levels:

1. Low
2. Medium
3. High
4. Critical

### 5. Urgent Reports

The urgent page highlights reports that require more attention.

Reports may appear as urgent when:

* They are marked as high or critical urgency
* They receive community boosts
* They involve sensitive environmental categories

### 6. Community Engagement Tracking

Gaia Phylax tracks public engagement through:

* Views
* Boosts

These signals help identify which reports are receiving community attention and may need faster review or escalation.

### 7. Issues Near Me

A local awareness section designed to highlight environmental alerts close to the user's area.

This feature supports the idea that environmental action should begin with what communities can see, document, and understand locally.

### 8. AI-Assisted Report Organization

AI is planned as a support layer for the platform.

The goal is to help:

* Classify reports
* Summarize local issues
* Detect urgency patterns
* Transform scattered observations into clearer environmental signals

In the current MVP, the system is structured to support AI-generated fields such as category and summary, but full AI automation is part of future development.

---

## Ethical Conservation Design

Gaia Phylax is designed with environmental safety in mind.

Some environmental reports, especially those involving endangered species, injured animals, or illegal hunting, can create risks if exact locations are exposed publicly.

Future safeguards may include:

* Delayed publication for sensitive reports
* Blurred or approximate coordinates
* Restricted visibility for endangered species locations
* Routing reports first to trusted organizations or authorities
* Moderation before public display
* Ethical AI classification for sensitive wildlife reports

The goal is to help conservation efforts without unintentionally enabling poaching, harassment of wildlife, or harmful exposure of vulnerable habitats.

---

## Datasets

### 1. Gaia Citizen Reports Dataset

A custom test dataset created for the prototype.

It includes sample reports with categories, urgency levels, descriptions, photos, coordinates, and engagement counters.

### 2. GBIF Backbone Taxonomy

Used as a taxonomic reference to normalize species names and reduce duplicate or inconsistent species entries.

For this prototype, the Animalia kingdom was used as the main taxonomy subset.

### 3. GBIF Occurrence Data

Used as biodiversity context for species-related environmental reporting.

### 4. NASA FIRMS Fire Data

Used to visualize fire signals and environmental alerts related to active fire detections.

---

## Tech Stack

### Frontend

* React
* Vite
* TypeScript
* React Router
* Leaflet / React Leaflet
* Supabase JS Client

### Backend

* FastAPI
* Python
* Supabase Python Client
* Uvicorn

### Database and Storage

* Supabase PostgreSQL
* Supabase Auth
* Supabase Storage
* Row Level Security policies

---

## Project Structure

```bash
Gaia-Phylax/
├── backend/
│   ├── main.py
│   ├── routers/
│   │   ├── fire.py
│   │   ├── reports.py
│   │   └── species.py
│   └── services/
│       └── supabase_client.py
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
└── README.md
```

---

## Environment Variables

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL=http://127.0.0.1:8000

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

The backend should also be configured with Supabase credentials inside the backend environment or Supabase client configuration.

---

## How to Run

### Backend

```bash
cd backend
.\.venv\Scripts\activate
uvicorn main:app --reload
```

Backend health check:

```txt
http://127.0.0.1:8000/health
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend local URL:

```txt
http://localhost:5173
```

---

## Demo Flow

A suggested demo flow:

1. Log in
2. Open the environmental map
3. Review fire signals and citizen reports
4. Create a new environmental report with image and location
5. Open the community board
6. View the new report as a postcard
7. Boost the report
8. Check the urgent reports page
9. Open the eco-pets page
10. Log out from the profile page

---

## Prototype Image Credits and References

Some prototype report images were sourced or referenced from the following pages.

### Xochimilco

Source: https://grupoanimal.mx/estilo-de-vida/limpieza-ciudadana-canal-xochimilco
Photo credit: Sharenii Guzmán

### Tepoztlán Fire

Source: https://www.elfinanciero.com.mx/estados/2025/03/25/incendio-en-tepoztlan-24-horas-de-lucha-contra-el-fuego-fotos/
Photo credit: Margarito Pérez

### Mangrove / Wetland

Source: https://unsplash.com/es/s/fotos/mangrove-wetland

### Bird

Source: https://www.pexels.com/photo/starling-bird-on-green-grass-8891719/

### Fishing Net

Source: https://unsplash.com/es/fotos/textil-de-ganchillo-blanco-y-marron-3-3X50TIm-M

### Oil Residue

Source: https://www.pexels.com/photo/colorful-iridescent-oil-spill-on-asphalt-surface-36759207/

### Burning Trash / Smoke

Source: https://unsplash.com/es/fotos/un-monton-de-basura-encima-de-un-campo-de-tierra-r9GWhOODqoc

### Dead Fish

Source: https://www.pexels.com/photo/dead-silver-fishes-on-sand-9297009/

### Sea Turtle

Source: https://unsplash.com/es/fotos/tortuga-negra-y-marron-en-la-orilla-de-la-playa-durante-el-dia-Xchp9dzP0ao

### Axolotl

Source: https://openverse.org/image/527047f6-b233-42a0-ba4a-aa2f37015e2b?q=axolotl&p=17

### Illegal Dumping

Source: https://unsplash.com/es/s/fotos/illegal-dumping

### Forest Clearing

Source: https://unsplash.com/es/fotos/tronco-de-arbol-marron-en-un-campo-de-hierba-verde-durante-el-dia-BkTsP32Dfnc

### Stray Dog

Source: https://www.pexels.com/photo/calm-stray-dog-resting-in-urban-park-setting-33291177/

### Wildfire

Source: https://unsplash.com/es/fotos/incendio-forestal-ardiendo-por-la-ladera-al-anochecer-kbTp7dBzHyY

### Wildlife Trap

Source: https://openverse.org/image/c06f2603-d608-4098-93c2-608943386289?q=wildlife+trap+human&p=12

---

## Notes on Image Use

This prototype uses images for demonstration purposes only.

For a public deployment, images should be replaced with properly licensed assets, user-submitted photos, or images with confirmed permission and complete attribution.

---

## Future Development

Planned improvements include:

* AI-assisted classification and summarization
* Species search connected directly to the Animalia taxonomy table
* Sensitive species location protection
* NGO and authority routing
* Moderation dashboard
* User reputation and points
* Persistent pet progress through Supabase
* Mobile responsive layout
* Advanced local alerts
* Map-based report creation
* Report verification workflow

---

## Status

Gaia Phylax is currently a working web MVP prototype.

The current version focuses on environmental reporting, visualization, community engagement, and biodiversity-aware design.
