# Kitchora — Deployment & Production Guide

This guide details how to deploy **Kitchora** to free/low-cost production cloud platforms (**Vercel / Render / Neon / Railway**) without any mandatory Docker requirements.

---

## Architecture Overview

```text
[ Vercel / Netlify ]  ---> HTTP / REST API ---> [ Render / Railway ] ---> [ Neon PostgreSQL ]
  React + Vite SPA                               FastAPI App               Managed DB
  (VITE_API_URL)      <--- WebSockets (Live) --- (PORT=$PORT)
```

---

## 1. Database Deployment (Neon PostgreSQL / Railway)

1. Create a PostgreSQL database instance on [Neon.tech](https://neon.tech) or [Railway](https://railway.app).
2. Copy the Connection String (e.g. `postgresql://user:password@ep-xyz.neon.tech/kitchora?sslmode=require`).
3. Set `DATABASE_URL` in your backend environment configuration.

---

## 2. Backend Deployment (Render / Railway)

### On Render / Railway:
- **Build Command**:
  ```bash
  pip install -r requirements.txt
  ```
- **Start Command**:
  ```bash
  uvicorn app.main:app --host 0.0.0.0 --port $PORT
  ```
- **Environment Variables**:
  | Variable Name | Example Production Value |
  |---|---|
  | `ENVIRONMENT` | `production` |
  | `PORT` | `10000` (automatically injected by Render) |
  | `JWT_SECRET` | `your-secure-random-256-bit-string` |
  | `DATABASE_URL` | `postgresql://user:pass@ep-xyz.neon.tech/kitchora?sslmode=require` |
  | `FRONTEND_URL` | `https://kitchora.vercel.app` |
  | `AI_PROVIDER` | `fallback` or `gemini` |
  | `AI_API_KEY` | `your_google_gemini_api_key` |

### Database Migrations & Seeding:
After backend service spins up, open backend web shell and execute:
```bash
alembic upgrade head
python -m app.db.seed
```

---

## 3. Frontend Deployment (Vercel / Netlify)

### On Vercel / Netlify:
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  | Variable Name | Example Production Value |
  |---|---|
  | `VITE_API_URL` | `https://kitchora-backend.onrender.com` |
  | `VITE_WS_URL` | `wss://kitchora-backend.onrender.com` |

---

## 4. Local vs Production Parity Checklist

- [x] No hardcoded `localhost:8000` or `localhost:5173` in frontend source code.
- [x] WebSockets fallback cleanly to HTTP polling if WebSocket drops or proxy blocks WS.
- [x] Role-Based Access Control (RBAC) enforced on backend route dependencies.
- [x] Zero Docker dependencies required to run or deploy.
- [x] Rule-based AI fallbacks active so app functions seamlessly even without external AI keys.
