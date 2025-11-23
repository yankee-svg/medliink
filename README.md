# Medliink: Healthcare Connection Platform

**Live Demo**: [medliink.vercel.app](https://medliink.vercel.app)

**Database**: [MongoDB Atlas Cluster](https://cloud.mongodb.com/v2/69177e83175d2115fbda7c3e#/clusters)

> **Note**: This is a monorepo containing both the frontend (Next.js) and backend (Express API) in a single repository.

## 📚 Documentation

- **[Quick Start Guide](./QUICKSTART.md)** - Get up and running in minutes
- **[Full Setup Guide](./SETUP.md)** - Comprehensive installation and configuration
- **[Monorepo Guide](./MONOREPO.md)** - Understanding the monorepo structure
- **[Backend API Docs](./backend/medliink-api/DOCUMENTATION.md)** - API documentation

## 🔑 Test Credentials

### Patient/User Account
- **Email**: emerybarame60@gmail.com
- **Password**: 321123
- **Role**: Patient (User)

### Hospital Accounts (Rwanda Hospitals)

All hospital accounts use the same password for testing: **hospital123**

| Hospital Name | Username | Email | Location |
|--------------|----------|-------|----------|
| King Faisal Hospital | `kingfaisal` | info@kfh.rw | Kigali, Gasabo |
| CHUK | `chuk` | info@chuk.rw | Kigali, Nyarugenge |
| CHUB | `chub` | info@chub.rw | Huye, Southern Province |
| Rwanda Military Hospital | `rwandamilitary` | info@rmh.rw | Kigali, Kicukiro |
| Kibagabaga District Hospital | `kibagabaga` | info@kibagabaga.rw | Kigali, Gasabo |
| Nyamata District Hospital | `nyamata` | info@nyamata.rw | Bugesera |
| Masaka District Hospital | `masaka` | info@masaka.rw | Kigali, Kicukiro |
| KUTH | `kuth` | info@kuth.rw | Kigali, Nyarugenge |
| Rwamagana Provincial Hospital | `rwamagana` | info@rwamagana.rw | Eastern Province |
| Muhima District Hospital | `muhima` | info@muhima.rw | Kigali, Nyarugenge |
| Gisenyi District Hospital | `gisenyi` | info@gisenyi.rw | Rubavu, Western Province |
| Rwinkwavu District Hospital | `rwinkwavu` | info@rwinkwavu.rw | Kayonza |
| Shyira District Hospital | `shyira` | info@shyira.rw | Nyabihu |
| Nemba District Hospital | `nemba` | info@nemba.rw | Gakenke |
| Byumba District Hospital | `byumba` | info@byumba.rw | Gicumbi, Northern Province |

**Quick Login Examples:**
- Username: `kingfaisal` | Password: `hospital123` (Cardiology, Oncology, ICU)
- Username: `chuk` | Password: `hospital123` (Neurology, Orthopedics, ICU)
- Username: `rwandamilitary` | Password: `hospital123` (Cardiology, Physical Therapy)

> **Note**: To seed hospital data into your local database, run: `npm run backend:seed`

## Overview

Medliink is a modern healthcare connection platform that bridges the gap between patients and clinical organizations. It's designed to help people quickly find and connect with healthcare providers, book appointments, and access medical services across different hospitals and clinics - all from one centralized platform.

## What is Medliink?

Medliink is **not** a hospital management system. Instead, it's a **healthcare marketplace and connection platform** that:

- Connects patients with multiple clinical organizations and healthcare providers
- Enables quick discovery of nearby hospitals and clinics using real-time maps
- Facilitates seamless appointment booking across different healthcare facilities
- Provides real-time communication between patients and healthcare providers
- Offers AI-powered health assistance for preliminary medical guidance

Think of it as the "Uber for Healthcare" - connecting those who need medical services with those who provide them, all in one place.

## Key Features

### For Patients
- 🗺️ **Interactive Map**: Find nearby hospitals and clinics using real-time geolocation with Leaflet maps
- 📅 **Quick Appointments**: Book appointments with any registered healthcare provider
- 💬 **Real-Time Messaging**: Direct communication with hospitals and clinics
- 🤖 **AI Health Assistant**: Get preliminary medical guidance powered by Claude AI
- ⭐ **Reviews & Ratings**: Read and submit reviews for healthcare providers
- 🏥 **Multi-Provider Access**: Connect with multiple hospitals from a single account

### For Healthcare Providers
- 📊 **Dashboard**: Manage appointments, patients, and communications
- 👥 **Patient Management**: View and manage patient requests and appointments
- 💬 **Messaging System**: Communicate with patients in real-time
- 📝 **Profile Management**: Showcase services, facilities, and specializations
- ⭐ **Reputation Management**: Build credibility through patient reviews

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (React 18)
- **State Management**: Redux Toolkit with RTK Query
- **Styling**: TailwindCSS with DaisyUI and custom Neumorphic design
- **Real-Time**: Socket.io Client
- **Video Calls**: LiveKit
- **Maps**: Leaflet with OpenStreetMap (free, no API key required)
- **AI Integration**: Anthropic Claude API
- **HTTP Client**: Axios
- **TypeScript**: For type safety

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Real-Time**: Socket.io
- **Email**: Nodemailer
- **AI Integration**: OpenAI API
- **Video**: LiveKit Server SDK
- **TypeScript**: For type safety
- **Location**: `backend/medliink-api/`

## APIs & Services Used

1. **Anthropic Claude AI** - AI-powered health assistant for medical guidance
2. **OpenStreetMap** - Free map tiles and geolocation services (via Leaflet)
3. **Browser Geolocation API** - Real-time user location tracking
4. **LiveKit** - Video conferencing for telemedicine appointments
5. **Socket.io** - Real-time messaging and notifications
6. **DiceBear API** - Avatar generation for user profiles

## Local Development Setup

### Prerequisites
- Node.js 18+ or Bun runtime
- npm, yarn, or bun package manager
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/yankee-svg/medliink.git
cd medliink
```

### Step 2: Install Dependencies

**Using bun (recommended):**
```bash
bun install
```

**Using npm:**
```bash
npm install
```

**Using yarn:**
```bash
yarn install
```

### Step 3: Set Up Environment Variables

**Frontend** - Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:5000/api

# Anthropic Claude AI (for health assistant)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# LiveKit (for video calls)
NEXT_PUBLIC_LIVEKIT_URL=your_livekit_url
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret

# Socket.io
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

**Backend** - Create a `.env` file in `backend/medliink-api/`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Secrets
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

# Email Configuration (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# OpenAI (for AI features)
OPENAI_API_KEY=your_openai_api_key

# LiveKit
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
LIVEKIT_URL=your_livekit_url

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Step 4: Install All Dependencies

Install both frontend and backend dependencies:

```bash
# Install frontend dependencies
bun install

# Install backend dependencies
cd backend/medliink-api
npm install
cd ../..

# Or use the convenience script
bun run install:all
```

### Step 5: Run the Development Servers

**Option 1: Run both servers simultaneously (recommended)**

```bash
npm run dev:all
```

This will start:
- Frontend at [http://localhost:3000](http://localhost:3000)
- Backend API at [http://localhost:5000](http://localhost:5000)

**Option 2: Run servers separately**

Terminal 1 (Frontend):
```bash
bun run dev
```

Terminal 2 (Backend):

```bash
npm run backend:dev
```

### Step 6: Build for Production

**Frontend:**

```bash
bun run build
bun run start
```

**Backend:**
```bash
npm run backend:build
npm run backend:start
```

**Or build both:**
```bash
npm run build && npm run backend:build
```

## Project Structure

```
medliink/
├── app/                          # Next.js app directory (Frontend)
│   ├── api/                      # Next.js API routes
│   ├── auth/                     # Authentication pages
│   ├── components/               # Reusable components
│   │   ├── HospitalMap/         # Interactive map component
│   │   ├── AppHeader/           # Navigation header
│   │   └── ...
│   ├── hospital/                 # Hospital dashboard pages
│   ├── user/                     # User dashboard pages
│   ├── store/                    # Redux store configuration
│   └── globals.css              # Global styles
├── backend/                      # Backend API (Monorepo)
│   └── medliink-api/            # Express.js REST API
│       ├── config/              # API configuration
│       ├── controllers/         # Request handlers
│       ├── middlewares/         # Express middlewares
│       ├── models/              # Mongoose models
│       ├── routes/              # API routes
│       ├── sockets/             # Socket.io handlers
│       ├── types/               # TypeScript types
│       ├── utils/               # Utility functions
│       ├── index.ts             # API entry point
│       └── package.json         # Backend dependencies
├── public/                       # Static assets
├── config/                       # Frontend configuration
├── package.json                  # Root dependencies & scripts
└── README.md                     # This file
```


## Sreenshots

### Dashboard
![Dashboard](./assets/img-1.png)


### Appointments
![Appointments](./assets/img-2.png)

### Search Hospitals
![Search Hospitals](./assets/img-3.png)


### Hospital Profile
![Hospital Profile](./assets/img-4.png)


### Messages
![Messages](./assets/img-5.png)


### Message Hospital
![Message Hospital](./assets/img-6.png)

### Message Hospital
![Message Hospital](./assets/img-7.png)


### User Profile
![User Profile](./assets/img-8.png)

### Specific Appointment
![Specific Appointment](./assets/img-9.png)

### Submit Hospital Review
![Submit Hospital Review](./assets/img-10.png)


### View All Reviews Made
![View Reviews Made](./assets/img-11.png)


### Hospital Mini Profile
![Hospital Mini Profile](./assets/img-12.png)

---

**Keywords**: Healthcare Technology, Digital Health, Patient Management, Hospital Administration, Redux, Next.js, Node.js, AI Healthcare Assistant, Healthcare SaaS
