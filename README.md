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

### Saved Properties

- Save Property button
- API endpoint created
- Currently returns successful responses
- Database storage planned for future implementation

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

---

## Environment Variables

The application requires the following environment variables:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=

RESEND_API_KEY=
CONTACT_TO_EMAIL=
```

### Variable Purpose

| Variable | Purpose |
|-----------|-----------|
| GOOGLE_CLIENT_ID | Google OAuth authentication |
| GOOGLE_CLIENT_SECRET | Google OAuth authentication |
| NEXTAUTH_SECRET | Encrypts authentication sessions |
| RESEND_API_KEY | Sends contact and enquiry emails |
| CONTACT_TO_EMAIL | Email address that receives enquiries |

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

✅ Interactive map integration

✅ Search filters

✅ Contact page

✅ Property enquiry system

✅ Resend email integration

✅ Google authentication

✅ Sign In / Sign Out functionality

✅ Responsive UI

### In Progress

🚧 Saved Properties functionality

### Planned Improvements

- Store saved properties in MySQL
- Connect Save Property button to database
- Create Saved Properties page
- Display saved properties for authenticated users
- Move property data from hardcoded listings into MySQL
- Improve authenticated user experience
- Deploy production version to cloud infrastructure
- Implement CI/CD workflow

---

## What I Learned

This project helped me develop experience with:

- React state management
- TypeScript
- Next.js App Router
- API routes
- OAuth authentication
- Form handling
- Email integrations
- Interactive maps
- Responsive design
- Component-based architecture
- Full-stack web development