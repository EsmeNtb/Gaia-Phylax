# GAIA PHYLAX

**Gaia Phylax** is a web application designed to amplify the voice of the environment.

The platform turns citizen observations into visible environmental alerts through an interactive map and a community bulletin board. Users can report damaged habitats, pollution, fires, injured animals, endangered species threats, illegal hunting or fishing, and other environmental issues happening near them or around the world.

Gaia Phylax combines citizen reports, biodiversity datasets, environmental alert data, and a structure designed for future 

---

## Project Vision

Environmental damage is often invisible until it becomes a crisis.

Many people see pollution, habitat destruction, injured animals, or ecosystem threats in their communities, but there is no simple way to report, organize, and visualize this information.

Gaia Phylax aims to become a citizen-powered environmental signal system: a place where people can document what is happening, understand the urgency of local issues, and connect environmental awareness with real action.

The long-term vision is to support ethical conservation workflows, including delayed or blurred locations for sensitive species, routing reports to nearby animal welfare organizations or authorities, and helping communities prioritize urgent environmental issues without exposing vulnerable wildlife to additional risk.

---

## Current MVP

This prototype currently includes:

- User authentication with Supabase Auth
- Citizen environmental report submission
- Manual report categorization and urgency selection
- Image upload through Supabase Storage
- Interactive environmental map
- Community bulletin board
- Urgent reports page
- Report view and boost counters
- NASA FIRMS fire signal visualization
- Animalia taxonomy dataset stored as biodiversity reference data
- Eco-pet gamification system
- Profile and logout flow

The current MVP does not automatically classify reports using AI. Report categories and urgency levels are selected manually by the user.

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
## MVP Scope and Limitations
The current version focuses on:

- Environmental report submission
- Manual categorization
- Map-based visualization
- Community board display
- Urgent report prioritization
- Image storage
- Basic engagement tracking through views and boosts
- Biodiversity dataset preparation

The following features are not fully implemented yet and are planned for future development:

- AI-powered automatic classification
- AI-generated report summaries
- AI-based urgency detection
- Full Animalia taxonomy search in the report form
- Sensitive species location blurring
- NGO or authority routing
- Report verification workflow
- Moderation dashboard
- Persistent pet progress through Supabase
- Full mobile responsive design
---

## Datasets

### 1. Gaia Citizen Reports Dataset

A custom test dataset created for the prototype.

It includes sample reports with categories, urgency levels, descriptions, photos, coordinates, and engagement counters.

### 2. GBIF Backbone Taxonomy

The Animalia taxonomy dataset is included as biodiversity reference data.

It is intended to support future species validation, species name normalization, and biodiversity-aware reporting. In the current MVP, the dataset exists as part of the database layer, but full frontend species search and automatic species matching are planned for a later version.

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
│   ├── data/
│   │   ├── notebooks/
│   │       ├── 01.data_preprocessing.ipynb
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── fire.py
│   │   ├── reports.py
│   │   └── species.py
│   ├──services/
│   │   └── supabase_client.py
│   ├──sql/
│   │    ├── init.sql
│   │   └── seed.sql
│   ├── main.py
│   ├── .env
│   ├── .gitignore
│   └── requirements.tsx
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
│   └── requirements.txt
│
└── README.md
```

---
## How to Run
Install the requirements.txt 

### Backend

```bash
cd backend
.\.venv\Scripts\activate
uvicorn main:app --reload
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

## Status

Gaia Phylax is currently a working web MVP prototype.

The current version focuses on environmental reporting, visualization, community engagement, and biodiversity-aware design.


```bash

██████╗  ██████╗ ███╗   ███╗██╗███╗   ██╗ ██████╗       ███████╗ ██████╗  ██████╗ ███╗   ██╗
██╔══██╗██╔═══██╗████╗ ████║██║████╗  ██║██╔════╝       ██╔════╝██╔═══██╗██╔═══██╗████╗  ██║
██║     ██║   ██║██╔████╔██║██║██╔██╗ ██║██║  ███╗█████╗███████╗██║   ██║██║   ██║██╔██╗ ██║
██║  ██║██║   ██║██║╚██╔╝██║██║██║╚██╗██║██║   ██║╚════╝╚════██║██║   ██║██║   ██║██║╚██╗██║
██████╔╝╚██████╔╝██║ ╚═╝ ██║██║██║ ╚████║╚██████╔╝      ███████║╚██████╔╝╚██████╔╝██║ ╚████║
╚═════╝  ╚═════╝ ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝ ╚═════╝       ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝



⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⡀⠀⠀⠀⠀⡶⠖⣶⠤⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢀⣠⡴⠚⡉⠡⢈⠙⢦⣴⠞⠛⠳⣦⡘⠛⢩⣿⣦⠀⠀⠀⠀⠀⠀⢀⣀⣀⠀⠀⠀⠀⢀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠛⠷⢤⣴⣀⣁⣂⣬⣼⣇⣤⡌⠐⢈⠻⡦⠘⠛⡛⣧⠀⠀⠀⠀⣰⠏⠀⠙⣧⣀⣀⣴⠋⠈⠙⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⡀⠀⣶⠶⠻⢧⡀⢹⣻⡟⣿⠃⣾⣧⠁⣰⣄⠙⣿⣛⠀⣀⣀⣰⠇⠀⠀⠀⠸⢻⠻⠃⠀⠀⠀⢘⣆⣀⡀⠀⠀⠀⠀⠀⠀⠀
⠀⢀⣴⣾⡝⠛⠛⣀⣴⣾⠧⢼⣯⣧⣿⡷⠇⣻⣀⣯⢹⡀⢄⡿⠀⣉⣽⢿⠃⠠⡾⠆⢠⣷⠄⠰⡷⠀⠘⣿⡽⣧⣀⠀⠀⠀⠀⠀⠀⠀
⢀⡤⠶⠖⠋⣐⣴⠟⠁⡀⠄⡂⠈⣿⣿⠶⠶⢦⣍⠉⠈⠙⠛⠁⠀⢠⠏⠀⠀⢀⣀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠘⣇⠀⠀⠀⠀⠀⠀⠀
⡾⠷⢶⡌⠐⠈⡁⢄⣂⡰⢸⡿⣦⣿⣿⢀⠐⡀⠌⣧⠀⠀⠀⠀⢀⣾⣰⠖⠛⠉⠉⠈⢻⡿⣽⠷⣦⡀⠀⠀⠀⢰⣿⡆⠀⠀⠀⠀⠀⠀
⢴⠛⠉⢰⡟⣧⠀⣸⡟⣇⢈⣷⢹⣿⣿⢦⣔⡀⢂⣿⠀⠀⠀⡴⢋⣿⣿⡆⠀⠀⠀⠀⠀⢷⣾⣿⠋⠁⠀⠀⠀⠀⠙⣻⡄⠀⠀⠀⠀⠀
⠸⢦⣥⡾⠁⠿⣤⠼⠇⠛⠋⠀⠀⣿⣿⠀⠈⠉⠉⠁⠀⠀⠘⢷⡟⠮⣝⣇⠀⠀⠀⠀⢀⣀⡿⠁⠀⠀⠀⠀⠀⠀⠸⣿⣧⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢸⡏⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⣻⠀⠀⠀⢸⠇⠀⠀⠻⠤⠶⠖⠛⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⢹⡀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣹⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⡇⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠈⠓⣶⠶⠶⠶⠶⠶⠶⠶⠶⣶⠛⠀⠀⠀⢸⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢘⡇⠀⣴⣿⣦
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⠀⠀⠀⠀⠀⠀⠀⢠⡇⠀⠀⠀⠀⠈⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣤⣾⣅⣩⠏
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⣸⠁⠀⠀⠀⠀⢠⡞⠳⡦⠀⠀⠀⠀⠀⠀⠀⣠⠦⣤⡀⠀⠀⠀⠀⠀⢠⣿⣇⣼⠿⠋⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠓⠒⠒⠖⠲⠒⠒⠛⠀⠀⠀⠀⠀⠀⠙⠓⠒⠒⠒⠒⠒⠦⠶⠴⠿⠶⠶⠴⠖⠒⠒⠒⠚⠛⠉⠁⠀⠀⠀⠀
```


---

## Future Development

Planned improvements include:

* AI-assisted classification and summarization
* Species search connected directly to the Animalia taxonomy table
* Sensitive species location protection
* NGO and authority routing
* Moderation dashboard
* Persistent pet progress through Supabase
* Mobile responsive layout
* Advanced local alerts
* Map-based report creation
* Report verification workflow

---
