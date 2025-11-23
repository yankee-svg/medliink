# Medliink - Quick Reference

## 🚀 Quick Start

```bash
# 1. Install all dependencies
npm run install:all

# 2. Set up environment variables
cp .env.example .env.local
cp backend/medliink-api/.env.example backend/medliink-api/.env
# Edit both files with your API keys

# 3. Run everything
npm run dev:all
```

## 📁 Monorepo Structure

```
medliink/
├── app/                          # Frontend (Next.js)
├── backend/medliink-api/         # Backend (Express.js)
├── .env.local                    # Frontend environment variables
└── backend/medliink-api/.env     # Backend environment variables
```

## 🔧 Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev:all` | Run both frontend & backend |
| `npm run dev` | Run frontend only |
| `npm run backend:dev` | Run backend only |
| `npm run backend:seed` | Seed Rwanda hospitals data |
| `npm run install:all` | Install all dependencies |
| `npm run build` | Build frontend |
| `npm run backend:build` | Build backend |

## 🌐 Default URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Base**: http://localhost:5000/api

## 🔑 Required Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_BASE_URL=http://localhost:5000/api
ANTHROPIC_API_KEY=sk-ant-xxx
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### Backend (backend/medliink-api/.env)
```env
PORT=5000
MONGODB_URL=mongodb://localhost/medliink
JWT_PRIVATE_KEY=your_secret
BREVO_API_KEY=your_key
FRONTEND_URL=http://localhost:3000
```

## 📦 API Keys Needed

1. **Anthropic Claude AI** - https://console.anthropic.com/
2. **MongoDB** - https://www.mongodb.com/cloud/atlas
3. **Brevo (Email)** - https://app.brevo.com/
4. **LiveKit (Optional)** - https://cloud.livekit.io/

## 🔍 Project Components

### Frontend (Next.js)
- Pages: `app/**/page.tsx`
- Components: `app/components/`
- API Routes: `app/api/`
- Redux Store: `app/store/`

### Backend (Express.js)
- Routes: `backend/medliink-api/routes/`
- Controllers: `backend/medliink-api/controllers/`
- Models: `backend/medliink-api/models/`
- Sockets: `backend/medliink-api/sockets/`

## 🐛 Troubleshooting

**Port in use?**
```bash
# Change ports in .env files
# Frontend: Run with PORT=3001 npm run dev
# Backend: Update PORT in backend/.env
```

**MongoDB connection failed?**
```bash
# Start MongoDB locally or use MongoDB Atlas
# Update MONGODB_URL in backend/.env
```

**Module not found?**
```bash
npm run install:all
```

## 📚 Documentation

- Full Setup: [SETUP.md](./SETUP.md)
- Main Docs: [README.md](./README.md)
- Backend API: [backend/medliink-api/DOCUMENTATION.md](./backend/medliink-api/DOCUMENTATION.md)

## 🎯 Test Account

- Email: emerybarame60@gmail.com
- Password: 321123

## 🔑 Test Credentials for Guests

### Patient Account
- **Email**: emerybarame60@gmail.com
- **Password**: 321123
- **Role**: Patient/User

### Hospital Accounts (All use password: `hospital123`)

**Popular Test Hospitals:**
- King Faisal Hospital: `kingfaisal` / `hospital123`
- CHUK: `chuk` / `hospital123`
- Rwanda Military Hospital: `rwandamilitary` / `hospital123`
- KUTH: `kuth` / `hospital123`

**More Hospitals:**
- Kibagabaga: `kibagabaga` / `hospital123`
- Nyamata: `nyamata` / `hospital123`
- Masaka: `masaka` / `hospital123`
- Rwamagana: `rwamagana` / `hospital123`
- Muhima: `muhima` / `hospital123`
- Gisenyi: `gisenyi` / `hospital123`
- Rwinkwavu: `rwinkwavu` / `hospital123`
- Shyira: `shyira` / `hospital123`
- Nemba: `nemba` / `hospital123`
- Byumba: `byumba` / `hospital123`
- CHUB: `chub` / `hospital123`

> See full list with services in [README.md](./README.md#test-credentials)
