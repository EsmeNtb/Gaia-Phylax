## GAIA PHYLAX 
Gaia Phylax is a web app designed to amplify the voice of the environment.

The platform turn citizen observation into visible environmental alerts through an interactive map and a community bulletin boards.
Users can report damaged habitats, pollution, fires, injured animals, endangered species threats, and other environmental issues happening near them or around the world.

Gaia Phylax combines community reports, biodiversity datasets environmental alerts data, and AI-assisted classification to make conservation more visible,local and actionable

----

## Project Vision
Environmental damage is often invisible until it becomes a crisis. Many people see pollution, habitat destruction, injured animals, or ecosystem threats in their communities, but there is no simple way to report, organize, and visualize this information.

Gaia Phylax aims to become a citizen-powered environmental signal system: a place where people can document what is happening, understand the urgency of local issues, and connect environmental awareness with real action.

-----

## Core Features
1. Interactive Environmental Map
Users cna explore an interactive map showing citizen-submitted environmental report
Each report includes:
- Location.
- Photo.
- Description.
- Alert category.
- Urgency level.
- Data submitted.

2. Community Bulletin Board
A visual feed where users can browse recent reports from the community. The bulletin board helps users see what's happening through photos,descriptions, and local context.

3. Report Submission
Users can submit environmental alerts such as:
- Pollution
- Fire or smoke
- Deforestation
- Habitat damage
- Injured animals
- Endangered species sightings
- Illegal huntinf or fishing
- Other environmental threats.

4. Alert Categories and Urgency Levels
Each report can be categorized by type and ugency:

- Urgency levels:
  1. Low
  2. Medium
  3. High
  4. Critical

 -----
 ## Issues Near Me
 A local awareness section that highlights environmental alerts cloose to user's area.

----
## AI-Assited Repor Organization
Ai is used to support the platform by helping classify reports summarize local issues, and transfrom scattered observations into clearer environmental signal.

---
## Datasets
1. Gaia Citizen Reports Datasets (custom test dataset created for the prototype)
2. GBIF Backbone Taxonomy
   It's used as a taxonomic reference to normalize species name and avoid duplicates.
   The data used was from Animalia(Kigdom)
3. GBIF Occurence Data (was used to provided biodiversity context)
4. NASA FIRMS Environmental Events

----
## Tech Stack
Frontend:
- Rect

Backend:
- Supbase
- PostgreSQL

## How to run
Backend:
```bash
cd backend
.\.venv\Scripts\activate 
uvicorn main:app --reload
```
Frontend:
```bash+
cd frontend
npm run dev
```



Material de las fotos
Xochimilco: https://grupoanimal.mx/estilo-de-vida/limpieza-ciudadana-canal-xochimilco
 Foto: Sharenii Guzmán.

Tepoztlán: https://www.elfinanciero.com.mx/estados/2025/03/25/incendio-en-tepoztlan-24-horas-de-lucha-contra-el-fuego-fotos/
 Foto: MARGARITO PÉREZ

Belize city:
https://unsplash.com/es/s/fotos/mangrove-wetland

Bird:
https://www.pexels.com/photo/starling-bird-on-green-grass-8891719/

Fishing:
https://unsplash.com/es/fotos/textil-de-ganchillo-blanco-y-marron-3-3X50TIm-M

Oil:
https://www.pexels.com/photo/colorful-iridescent-oil-spill-on-asphalt-surface-36759207/

Smoke:
https://unsplash.com/es/fotos/un-monton-de-basura-encima-de-un-campo-de-tierra-r9GWhOODqoc

Dead Fish:
https://www.pexels.com/photo/dead-silver-fishes-on-sand-9297009/

Turtle:
https://unsplash.com/es/fotos/tortuga-negra-y-marron-en-la-orilla-de-la-playa-durante-el-dia-Xchp9dzP0ao

Axolote:
https://openverse.org/image/527047f6-b233-42a0-ba4a-aa2f37015e2b?q=axolotl&p=17