# Medliink: Healthcare Connection Platform

**Live Demo**: [medliink.vercel.app](https://medliink.vercel.app)

**Backend Repository**: [https://github.com/yankee-svg/medliink-api](https://github.com/yankee-svg/medliink-api)

**Database**: [MongoDB Atlas Cluster](https://cloud.mongodb.com/v2/69177e83175d2115fbda7c3e#/clusters)

## Test Credentials
- **Email**: emerybarame60@gmail.com
- **Password**: 321123

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

### Backend (Separate Repository)
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Real-Time**: Socket.io
- **File Storage**: Cloud-based storage integration

**Backend Repository**: [https://github.com/yankee-svg/medliink-api](https://github.com/yankee-svg/medliink-api)

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

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Anthropic Claude AI (for health assistant)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# LiveKit (for video calls)
NEXT_PUBLIC_LIVEKIT_URL=your_livekit_url
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret

# Socket.io
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### Step 4: Set Up the Backend

1. Clone the backend repository:
```bash
git clone https://github.com/yankee-svg/medliink-api.git
cd medliink-api
```

2. Follow the setup instructions in the backend repository's README
3. Make sure the backend is running on `http://localhost:5000` (or update the `NEXT_PUBLIC_API_URL` accordingly)

### Step 5: Run the Development Server

**Using bun:**
```bash
bun run dev
```

**Using npm:**
```bash
npm run dev
```

**Using yarn:**
```bash
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Step 6: Build for Production

**Using bun:**
```bash
bun run build
bun run start
```

**Using npm:**
```bash
npm run build
npm run start
```

## Project Structure

```
medliink/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   ├── auth/                     # Authentication pages
│   ├── components/               # Reusable components
│   │   ├── HospitalMap/         # Interactive map component
│   │   ├── AppHeader/           # Navigation header
│   │   └── ...
│   ├── hospital/                 # Hospital dashboard pages
│   ├── user/                     # User dashboard pages
│   ├── store/                    # Redux store configuration
│   └── globals.css              # Global styles
├── public/                       # Static assets
├── config/                       # Configuration files
└── package.json                  # Dependencies
```

## Problem Statement

The contemporary healthcare landscape faces several systemic challenges:

- **Fragmented Communication**: Disconnect between patients and healthcare providers leads to inefficient care coordination and poor patient outcomes
- **Administrative Burden**: Healthcare institutions struggle with manual processes for appointment scheduling, patient management, and data administration
- **Limited Accessibility**: Patients face barriers in accessing their health information and scheduling appointments with healthcare providers
- **Information Asymmetry**: Lack of immediate access to healthcare information and personalized medical guidance
- **Operational Inefficiency**: Healthcare providers lack integrated digital tools to streamline their workflows and optimize resource allocation

These challenges necessitate a comprehensive digital solution that bridges the gap between patients and healthcare institutions while enhancing operational efficiency and care quality.

## Solution Overview

Medliink addresses these challenges through a dual-dashboard architecture that serves two primary stakeholder groups:

### Patient-Facing Features
- Personalized health information management dashboard
- Integrated appointment booking and scheduling system
- Real-time connection with healthcare providers
- AI-powered health assistant for personalized medical guidance
- Comprehensive health records access and management

### Hospital-Facing Features
- Centralized patient management system
- Streamlined appointment scheduling and calendar management
- Administrative workflow optimization tools
- Data analytics and reporting capabilities
- Integration-ready architecture for hospital management systems

## Technical Architecture

### Frontend Technology Stack
- **Framework**: React and Next.js for optimal performance and SEO capabilities
- **State Management**: Redux and Redux Toolkit for predictable state containers
- **Data Fetching**: Redux Toolkit Query (RTK Query) for efficient API data management
- **User Interface**: Modern, responsive design optimized for accessibility

### Backend Infrastructure
- **Runtime Environment**: Node.js for scalable server-side operations
- **API Framework**: Express.js for robust RESTful API development
- **HTTP Client**: Axios for reliable client-server communication
- **Data Management**: Integrated state synchronization between client and server

### A.I Integration
- **Health Assistant**: GPT-based conversational AI model providing:
  - Personalized healthcare information
  - Medical guidance and education
  - Symptom assessment support
  - Health-related query resolution

## Impl~ Challenges and Solutions

### Technical Challenges

**Challenge 1: RTK Query Integration**
- *Issue*: Complex configuration requirements for RTK Query within Next.js environment
- *Solution*: Developed custom configuration patterns and middleware to seamlessly integrate RTK Query with Next.js server-side rendering capabilities

**Challenge 2: Real-Time State Management**
- *Issue*: Managing real-time healthcare data while maintaining application performance
- *Solution*: Implemented optimized Redux patterns with normalized state structure and selective re-rendering strategies

**Challenge 3: Learning Curve**
- *Issue*: First-time implementation of Redux Toolkit in a large-scale production environment
- *Solution*: Adopted iterative development approach with continuous learning and code refactoring

## Key Achievements

1. **Advanced State Management**: Successfully implemented enterprise-grade state management using Redux and Redux Toolkit for the first time in a production environment

2. **AI Integration**: Pioneered the integration of GPT-based health assistant technology, representing the team's inaugural venture into AI-powered healthcare solutions

3. **Scalable Architecture**: Designed and deployed a full-stack application capable of supporting concurrent users across multiple healthcare institutions

4. **Modern Development Practices**: Adopted industry-standard development workflows including component-based architecture and API-first design

## Technical Competencies Acquired

Through the development of Medliink, the team gained expertise in:

- Advanced Redux patterns and Redux Toolkit Query implementation
- Next.js server-side rendering and static site generation
- Large-scale React application architecture
- RESTful API design and implementation
- AI/ML model integration in production environments
- Healthcare data management and privacy considerations

## Future Roadmap

### Phase 1: Monetization Strategy
- Implement subscription-based revenue model for healthcare providers
- Develop tiered service packages for different hospital sizes
- Create payment processing infrastructure

### Phase 2: Staff Management Module
- Build comprehensive staff directory and profile management
- Implement staff-to-appointment assignment system
- Develop staff scheduling and availability tracking
- Enable patient-provider matching based on specializations

### Phase 3: Enterprise Integration
- Develop Hospital Management System (HMS) integration capabilities
- Create unified platform consolidating all healthcare operations
- Build API gateway for third-party system integrations
- Implement advanced analytics and reporting dashboards

### Phase 4: Enhanced Features
- Telemedicine capabilities for remote consultations
- Electronic prescription management
- Laboratory and diagnostic test integration
- Patient feedback and satisfaction tracking
- Compliance and regulatory reporting tools

## Conclusion

Medliink represents a significant advancement in healthcare technology, demonstrating the potential of modern web technologies and artificial intelligence to transform healthcare delivery. By addressing critical pain points in patient-provider communication and healthcare administration, Medliink positions itself as a comprehensive solution for the digital transformation of healthcare institutions. The platform's modular architecture and planned feature expansions ensure its continued relevance and value in an evolving healthcare landscape.

## Technical Documentation

For implementation details, API documentation, and integration guides, please refer to the project wiki and developer documentation.

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
