# Deployment Checklist — BrainSeekers Chess Academy

## Targets

| Component | Platform | Notes |
|-----------|----------|--------|
| Frontend (Next.js 16) | [Vercel](https://vercel.com) | App Router, `NEXT_PUBLIC_API_URL` |
| Backend (Express) | [Render](https://render.com) | Web Service, Node 20+ |
| Database | MongoDB Atlas | Database name: `brainseekers` |

## Pre-deploy

- [ ] Rotate all secrets (JWT, MongoDB user password, seed passwords)
- [ ] Set `NODE_ENV=production` on Render
- [ ] Set strong `JWT_SECRET` (32+ random characters)
- [ ] Set `CORS_ORIGIN` to your Vercel URL (comma-separated if multiple)
- [ ] Run `npm run build` in `backend/` and root frontend
- [ ] Run `npm run seed` once on production DB (or migrate manually)
- [ ] Run `npm run link-coaches` if coaches existed before profile linking

## Render (backend)

1. Create **Web Service** from repo, root directory: `backend`
2. Build: `npm install && npm run build`
3. Start: `npm start`
4. Environment variables (from `backend/.env.example`)
5. Health check path: `/health`

## Vercel (frontend)

1. Import repo, framework: Next.js
2. Set `NEXT_PUBLIC_API_URL=https://your-api.onrender.com`
3. Deploy; verify `/blog`, `/gallery`, `/login` work against production API

## Post-deploy smoke tests

- [ ] Admin login + dashboard stats
- [ ] `/admin/students` list, edit, assign batch/coach
- [ ] Coach login (`coach@brainseekers.com` after seed) + dashboard shows name
- [ ] Public `/blog` and `/gallery`
- [ ] Rate limit: auth endpoints return 429 after threshold (expected)

## Rollback

- Render: redeploy previous successful deploy from dashboard
- Vercel: instant rollback to prior deployment
- Database: restore from Atlas snapshot (see `BACKUP_STRATEGY.md`)
