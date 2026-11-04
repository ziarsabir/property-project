# Homefinder

Homefinder is a full-stack property search application built with Next.js, TypeScript and Tailwind CSS.

Users can browse property listings, search using filters and an interactive map, view property details, submit enquiries and sign in using Google authentication.

---

## Features

### Property Search

- Search available properties
- Filter by:
  - Property type (Sale / Rent)
  - Minimum bedrooms
  - Minimum bathrooms
  - Price range
- Interactive map powered by MapLibre and OpenStreetMap

### Property Listings

- Responsive property cards
- Dynamic property detail pages
- Property images and pricing
- Property location information

### Property Enquiries

- Contact form
- Property enquiry form
- Email delivery using Resend
- Honeypot spam protection
- Success and error feedback messages

### Authentication

- Google Sign In
- Google Sign Out
- Session management with NextAuth
- Credentials authentication

### Saved Properties

- Save properties while signed in
- Saved property IDs are stored in Azure Cosmos DB
- Saved properties are linked to the authenticated user
- Saved properties are displayed on the user's profile page
- Users can remove saved properties from their profile
- Save button provides success feedback after a property is saved

---

## Tech Stack

### Frontend

- Next.js 15
- React
- TypeScript
- Tailwind CSS

### Authentication

- NextAuth
- Google OAuth

### Maps

- MapLibre GL
- OpenStreetMap

### Email Service

- Resend

### Backend

- Next.js API Routes
- Node.js

### Cloud Storage

- Azure Blob Storage
  - Nest property spreadsheet
  - Private property image container
  - Property images organised by property ID prefix

### Database

- Azure Cosmos DB
  - User accounts
  - Saved property IDs

---

## Environment Variables

Homefinder uses environment variables for authentication, email delivery, Azure Blob Storage and Azure Cosmos DB.

Create a `.env` file in the project root and provide values for the variables listed in `.env.example`.

Never commit the real `.env` file or secret values to GitHub.

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

RESEND_API_KEY=
CONTACT_TO_EMAIL=

AZURE_STORAGE_CONNECTION_STRING=
AZURE_STORAGE_CONTAINER_NAME=
AZURE_STORAGE_IMAGE_CONTAINER_NAME=

COSMOS_ENDPOINT=
COSMOS_KEY=
COSMOS_DATABASE_ID=
COSMOS_CONTAINER_ID=
```

### Variable Purpose

| Variable | Purpose |
|----------|---------|
| GOOGLE_CLIENT_ID | Google OAuth authentication |
| GOOGLE_CLIENT_SECRET | Google OAuth authentication |
| NEXTAUTH_SECRET | Encrypts authentication sessions |
| NEXTAUTH_URL | Base URL used by NextAuth |
| RESEND_API_KEY | Sends contact and enquiry emails |
| CONTACT_TO_EMAIL | Email address that receives enquiries |
| AZURE_STORAGE_CONNECTION_STRING | Connects Homefinder to Azure Blob Storage |
| AZURE_STORAGE_CONTAINER_NAME | Azure container containing the Nest property spreadsheet |
| AZURE_STORAGE_IMAGE_CONTAINER_NAME | Private Azure container containing property images |
| COSMOS_ENDPOINT | Azure Cosmos DB account endpoint |
| COSMOS_KEY | Authenticates the Cosmos DB connection |
| COSMOS_DATABASE_ID | Cosmos DB database used by Homefinder |
| COSMOS_CONTAINER_ID | Cosmos DB container containing user data |

---

## Running the Project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Current Status

### Completed

✅ Property search page  
✅ Property detail pages  
✅ Real Nest property data loaded from Azure Blob Storage  
✅ Property image gallery with multiple images per property  
✅ Private Azure Blob Storage for property images  
✅ Interactive map integration  
✅ Search filters  
✅ Contact and property enquiry system  
✅ Resend email integration  
✅ Google authentication with NextAuth  
✅ Credentials authentication  
✅ Saved properties stored in Azure Cosmos DB  
✅ Saved properties displayed on the profile page  
✅ Responsive UI  
✅ Production deployment on Render  

### Possible Next Steps

- Add CI/CD checks before deployment?
- Add more automated tests?
- Improve the authenticated user experience?
- Continue refining the UI and property search experience?
- Add location autocomplete for UK towns and cities?

---

## What I Learned

This project helped me develop experience with:

- React state management
- TypeScript
- Next.js App Router
- API routes
- OAuth authentication
- Credentials authentication
- Form handling and validation
- Email integrations with Resend
- Interactive maps with MapLibre
- Responsive design
- Component-based architecture
- Reusable helper functions and modular code
- Reading and mapping external Excel data
- Cloud storage with Azure Blob Storage
- Organising private property images by property ID
- Cloud database storage with Azure Cosmos DB
- Saving and retrieving user-specific data
- Dynamic routes
- Full-stack web development
- Cloud deployment with Render

