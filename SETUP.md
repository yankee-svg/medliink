# Medliink Setup Guide

This guide will help you set up the Medliink monorepo for local development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ (recommended: 18.18.0)
- **npm** or **Bun** package manager
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yankee-svg/medliink.git
cd medliink
```

### 2. Install Dependencies

**Option A: Install all dependencies at once (recommended)**
```bash
npm run install:all
```

**Option B: Install separately**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend/medliink-api
npm install
cd ../..
```

### 3. Set Up Environment Variables

#### Frontend Configuration

Copy the frontend environment example file:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:
```env
NEXT_PUBLIC_BASE_URL=http://localhost:5000/api
ANTHROPIC_API_KEY=your_anthropic_api_key
NEXT_PUBLIC_LIVEKIT_URL=your_livekit_url
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_secret
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

#### Backend Configuration

Copy the backend environment example file:
```bash
cp backend/medliink-api/.env.example backend/medliink-api/.env
```

Edit `backend/medliink-api/.env` with your values:
```env
PORT=5000
NODE_ENV=development
MONGODB_URL=mongodb://localhost/medliink
JWT_PRIVATE_KEY=your_secret_key
BREVO_API_KEY=your_brevo_key
OPEN_AI_API_KEY=your_openai_key
LK_API_KEY=your_livekit_key
LK_API_SECRET=your_livekit_secret
FRONTEND_URL=http://localhost:3000
```

### 4. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# Visit: https://www.mongodb.com/try/download/community

# Start MongoDB service
# Windows: MongoDB should start automatically
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URL` in backend `.env` file

### 5. Run the Application

**Option A: Run both frontend and backend together (recommended)**
```bash
npm run dev:all
```

**Option B: Run separately in different terminals**

Terminal 1 (Frontend):
```bash
npm run dev
```

Terminal 2 (Backend):
```bash
npm run backend:dev
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api

## Required API Keys

### 1. Anthropic Claude AI (Required for AI Health Assistant)

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Add to `.env.local`: `ANTHROPIC_API_KEY=sk-ant-xxx`

### 2. LiveKit (Required for Video Calls)

1. Visit [LiveKit Cloud](https://cloud.livekit.io/)
2. Sign up or log in
3. Create a new project
4. Get your API credentials
5. Add to both `.env.local` and `backend/medliink-api/.env`

### 3. MongoDB (Required)

See MongoDB setup section above.

### 4. Brevo/Sendinblue (Required for Email)

1. Visit [Brevo](https://app.brevo.com/)
2. Sign up for a free account
3. Navigate to Settings → API Keys
4. Create a new API key
5. Add to `backend/medliink-api/.env`: `BREVO_API_KEY=xxx`

### 5. OpenAI (Optional - for additional AI features)

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Add to `backend/medliink-api/.env`: `OPEN_AI_API_KEY=sk-xxx`

## Package Manager Options

You can use any of the following package managers:

### Using Bun (Recommended for speed)
```bash
bun install
bun run dev:all
```

### Using npm
```bash
npm install
npm run dev:all
```

### Using yarn
```bash
yarn install
yarn dev:all
```

## Available Scripts

### Root Level Scripts

- `npm run dev` - Start frontend development server
- `npm run build` - Build frontend for production
- `npm run start` - Start frontend production server
- `npm run lint` - Run ESLint on frontend
- `npm run backend:dev` - Start backend development server
- `npm run backend:build` - Build backend for production
- `npm run backend:start` - Start backend production server
- `npm run backend:install` - Install backend dependencies
- `npm run dev:all` - Run both frontend and backend together
- `npm run install:all` - Install all dependencies (frontend + backend)

### Backend Scripts (from backend/medliink-api)

- `npm run dev` - Start with ts-node (development)
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Troubleshooting

### Port Already in Use

If port 3000 or 5000 is already in use:

**Frontend:**
```bash
# Run on a different port
PORT=3001 npm run dev
```

**Backend:**
Update `PORT` in `backend/medliink-api/.env`

### MongoDB Connection Issues

1. Ensure MongoDB is running:
```bash
# Check MongoDB status
# Windows: Check Services
# Mac: brew services list
# Linux: sudo systemctl status mongod
```

2. Verify connection string in `.env`
3. Check if firewall is blocking MongoDB port (27017)

### Module Not Found Errors

```bash
# Clear all node_modules and reinstall
rm -rf node_modules backend/medliink-api/node_modules
npm run install:all
```

### CORS Errors

Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL (default: http://localhost:3000)

## Development Workflow

1. Create a new branch for your feature
2. Make your changes
3. Test both frontend and backend
4. Commit your changes
5. Push and create a pull request

## Production Build

### Build Frontend
```bash
npm run build
```

### Build Backend
```bash
npm run backend:build
```

### Build Both
```bash
npm run build && npm run backend:build
```

## Project Structure

```
medliink/
├── app/                      # Next.js frontend
├── backend/
│   └── medliink-api/        # Express.js backend
├── public/                   # Static assets
├── config/                   # Frontend config
├── .env.example             # Frontend env template
├── .env.local               # Frontend env (create this)
└── package.json             # Root dependencies & scripts
```

## Need Help?

- Check the main [README.md](./README.md)
- Review backend [DOCUMENTATION.md](./backend/medliink-api/DOCUMENTATION.md)
- Open an issue on GitHub

## License

MIT
