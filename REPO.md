# Medliink repo Structure

This document explains the repo architecture of Medliink and how the frontend and backend are integrated.

## Tree

```
medliink/
│
├── app/                              # Frontend Application (Next.js)
│   ├── api/                          # Next.js API routes
│   ├── auth/                         # Authentication pages
│   ├── components/                   # React components
│   ├── hospital/                     # Hospital dashboard
│   ├── user/                         # User dashboard
│   ├── store/                        # Redux state management
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Homepage
│
├── backend/                          # Backend Application
│   └── medliink-api/                # Express.js REST API
│       ├── config/                   # Configuration files
│       ├── controllers/              # Request handlers
│       ├── middlewares/              # Express middlewares
│       ├── models/                   # Database models (Mongoose)
│       ├── routes/                   # API route definitions
│       ├── sockets/                  # Socket.io event handlers
│       ├── types/                    # TypeScript type definitions
│       ├── utils/                    # Utility functions
│       ├── index.ts                  # API entry point
│       ├── package.json              # Backend dependencies
│       ├── tsconfig.json             # TypeScript config
│       └── .env                      # Backend environment variables
│
├── public/                           # Static assets (images, fonts)
│   └── fonts/                        # Custom fonts
│
├── config/                           # Frontend configuration
│   └── site.ts                       # Site metadata
│
├── assets/                           # Documentation assets
│
├── .env.example                      # Frontend env template
├── .env.local                        # Frontend environment variables (create this)
├── package.json                      # Root package.json with monorepo scripts
├── middleware.ts                     # Next.js middleware
├── next.config.js                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # Frontend TypeScript config
├── README.md                         # Main documentation
├── SETUP.md                          # Setup guide
├── QUICKSTART.md                     # Quick reference
└── REPO.md                       # This file
```

## How It Works

### Package Management

The monorepo uses a **hybrid package management** approach:

1. **Root `package.json`** - Contains:
   - Frontend dependencies (Next.js, React, Redux, etc.)
   - Development tools (ESLint, TypeScript, etc.)
   - Convenience scripts to run both frontend and backend

2. **Backend `package.json`** - Contains:
   - Backend-specific dependencies (Express, MongoDB, etc.)
   - Backend scripts (dev, build, start)

### Scripts Organization

```json
// Root package.json scripts
{
  "dev": "next dev",                                    // Frontend only
  "backend:dev": "cd backend/medliink-api && npm run dev",  // Backend only
  "dev:all": "concurrently \"npm run dev\" \"npm run backend:dev\"",  // Both
  "install:all": "npm install && npm run backend:install"   // Install both
}
```

### Environment Variables

Each part of the application has its own environment file:

**Frontend**: `.env.local` (root directory)
- Next.js automatically loads this
- Contains frontend-specific config (API URLs, client-side keys)

**Backend**: `backend/medliink-api/.env`
- Loaded by backend application
- Contains backend-specific config (database, server secrets)

### Communication Flow

```
User Browser
     ↓
Frontend (Next.js) → http://localhost:3000
     ↓
HTTP/WebSocket
     ↓
Backend (Express) → http://localhost:5000
     ↓
MongoDB Database
```

## Development Workflow

### Starting Development

```bash
# Option 1: Run both together (recommended)
npm run dev:all

# Option 2: Run separately
# Terminal 1
npm run dev

# Terminal 2
npm run backend:dev
```

### Making Changes

**Frontend Changes**:
- Edit files in `app/`, `components/`, etc.
- Changes hot-reload automatically
- No need to restart server

**Backend Changes**:
- Edit files in `backend/medliink-api/`
- Nodemon auto-restarts on file changes
- Check terminal for compilation/restart messages

**Shared Types** (Future Enhancement):
- Create `types/` folder at root
- Share TypeScript interfaces between frontend and backend
- Import in both apps

### Building for Production

```bash
# Build frontend
npm run build

# Build backend
npm run backend:build

# Or build both
npm run build && npm run backend:build
```

## Git Workflow

Since everything is in one repo:

```bash
# Make changes to both frontend and backend
git add .
git commit -m "feat: add appointment notification feature"
git push

# Both frontend and backend changes are in one commit
```

### .gitignore Structure

The root `.gitignore` handles both:
```
# Frontend
.next/
.env.local

# Backend
backend/medliink-api/dist/
backend/medliink-api/.env

# Shared
node_modules/
```

## Deployment Strategies

### Option 1: Deploy Separately

**Frontend** (Vercel):
- Connect Vercel to GitHub repo
- Set root directory to `.`
- Vercel automatically detects Next.js

**Backend** (Render/Railway):
- Set root directory to `backend/medliink-api`
- Deploy as Node.js app

### Option 2: Deploy Together

Use a platform that supports monorepos:
- Set up build commands for both
- Use different start commands
- Configure proper routing

## Common Operations

### Adding a New Frontend Dependency

```bash
# From root directory
npm install <package-name>
```

### Adding a New Backend Dependency

```bash
# Option 1: From root
cd backend/medliink-api
npm install <package-name>

# Option 2: Using script
npm run backend:install -- <package-name>
```

### Running Backend Tests

```bash
cd backend/medliink-api
npm run test
```

### Linting

```bash
# Frontend
npm run lint

# Backend
cd backend/medliink-api
npm run lint
```

## TypeScript Configuration

### Frontend (`tsconfig.json` at root)
- Configured for Next.js
- JSX support
- Path aliases (`@/app/components`)

### Backend (`backend/medliink-api/tsconfig.json`)
- Configured for Node.js
- ES Modules
- Strict type checking

## Advantages Over Separate Repos

| Aspect | Monorepo | Separate Repos |
|--------|----------|----------------|
| Setup Time | ⚡ Fast (one clone) | 🐌 Slower (two clones) |
| Dependency Sync | ✅ Automatic | ❌ Manual |
| Feature Development | ✅ Single PR | ❌ Multiple PRs |
| Code Sharing | ✅ Easy | ❌ Complex |
| Version Control | ✅ Unified history | ❌ Split history |
| CI/CD Setup | ⚠️ Slightly complex | ✅ Simple |

## Future Enhancements

1. **Shared Types Package**
   ```
   packages/
   └── shared-types/
       ├── models/
       ├── api/
       └── index.ts
   ```

2. **Workspaces** (using npm/yarn workspaces)
   - Better dependency management
   - Hoisted node_modules
   - Faster installs

3. **Turborepo** (build optimization)
   - Faster builds
   - Intelligent caching
   - Parallel task execution

4. **Shared Utilities**
   ```
   packages/
   └── utils/
       ├── validation/
       ├── formatting/
       └── constants/
   ```

## Troubleshooting

### Backend won't start
```bash
cd backend/medliink-api
npm install
npm run dev
```

### Frontend can't connect to backend
- Check `NEXT_PUBLIC_BASE_URL` in `.env.local`
- Ensure backend is running on correct port
- Check CORS settings in backend

### Dependency conflicts
```bash
# Clear everything and reinstall
rm -rf node_modules backend/medliink-api/node_modules
npm run install:all
```

## Best Practices

1. **Keep backend self-contained** - Backend should work independently
2. **Use environment variables** - Never hardcode URLs or secrets
3. **Document changes** - Update README when structure changes
4. **Test both parts** - Ensure frontend and backend work together
5. **Use conventional commits** - Clear commit messages for both parts

## Questions?

- Check [SETUP.md](./SETUP.md) for detailed setup
- See [QUICKSTART.md](./QUICKSTART.md) for quick commands
- Read [README.md](./README.md) for project overview
- Review backend [DOCUMENTATION.md](./backend/medliink-api/DOCUMENTATION.md) for API docs
