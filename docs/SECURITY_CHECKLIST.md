# Security Checklist

## Authentication & sessions

- [x] JWT for API auth; passwords hashed with bcrypt
- [x] `profileRef` links User → Coach / Student / Parent documents
- [x] RBAC middleware on protected routes
- [x] Secure cookie flag when served over HTTPS (frontend session cookies)
- [ ] Enforce password change for seeded accounts in production
- [ ] OTP: mock only — integrate Twilio/Firebase before production mobile login

## API hardening

- [x] Helmet security headers
- [x] Rate limiting on `/api/*` and stricter limits on `/api/auth` and `/api/otp`
- [x] Request body size limit (1mb)
- [x] Centralized error handler (no stack traces in production 5xx)
- [x] Environment validation on boot (`MONGODB_URI`, `JWT_SECRET` in production)
- [ ] Joi validation on all write endpoints (partial — middleware available)
- [ ] CSRF if moving to cookie-only auth (currently Bearer + localStorage)

## Data & secrets

- [ ] Never commit `.env` files
- [ ] MongoDB Atlas IP allowlist + least-privilege DB user
- [ ] Rotate credentials after any leak
- [ ] Audit logs for admin actions (not implemented)

## Frontend

- [x] Next.js middleware RBAC for portal routes
- [ ] Content Security Policy tuning for blog HTML (sanitize if allowing user HTML)
- [ ] Image domains restricted in `next.config.ts` for production

## Score guide (current)

| Area | Status |
|------|--------|
| Auth/RBAC | Strong |
| Transport | HTTPS required in prod |
| API limits | Good |
| OTP/Notifications | Placeholder only |
| Input validation | Moderate |

**Estimated security score: 72/100** (production-ready after OTP provider + HTML sanitization + full Joi coverage)
