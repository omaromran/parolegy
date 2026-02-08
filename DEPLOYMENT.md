# Deployment Guide

## 1. Create a PostgreSQL database (required for app + production)

The app uses **PostgreSQL**. Use a free hosted DB for local and production:

- **[Neon](https://neon.tech)** – sign up, create a project, copy the connection string.
- **[Supabase](https://supabase.com)** – create a project → Settings → Database → Connection string (URI).

You’ll get a URL like:
`postgresql://user:password@host/database?sslmode=require`

## 2. Set environment variables (local and production)

### Local (`.env` or `.env.local`)

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
NEXTAUTH_SECRET="your-secret-key"   # Generate: openssl rand -base64 32
OPENAI_API_KEY="sk-..."             # For campaign generation
# Optional:
# SITE_PASSWORD="angel123@"
```

### Production (Vercel / Railway / Render / etc.)

In your hosting dashboard → **Project** → **Settings** → **Environment Variables**, add:

| Name | Value |
|------|--------|
| `DATABASE_URL` | Your Postgres URL (same as above or a separate prod DB) |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` (use a new one for prod) |
| `OPENAI_API_KEY` | Your OpenAI key (for campaign generation) |
| `SITE_PASSWORD` | Optional site gate password |

Save and **redeploy** so the new variables are used.

## 3. Run database setup

**Local (first time):**

```bash
npm install
cp .env.example .env
# Edit .env and set DATABASE_URL (and others)
npx prisma generate
npx prisma db push
npm run create-admin
npm run dev
```

**Production:**  
Your host usually runs `prisma generate` in the build. Run migrations once against the production DB:

```bash
DATABASE_URL="your-production-postgres-url" npx prisma db push
```

Or add a build script that runs `prisma generate` and, if you use migrations, `prisma migrate deploy`.

## 4. Password protection (optional)

Default site password: `angel123@` (set via `SITE_PASSWORD`). Change it in production.

## 5. Admin credentials

- Email: `admin@parolegy.com`
- Password: `admin123`

Create with: `npm run create-admin`  
⚠️ Change the password in production.

## 6. GitHub

Repo: https://github.com/omaromran/parolegy

## 7. Production checklist

- [ ] `DATABASE_URL` set in hosting env (Postgres)
- [ ] `NEXTAUTH_SECRET` set in hosting env
- [ ] `OPENAI_API_KEY` set if using campaign generation
- [ ] Ran `prisma db push` (or migrations) against production DB
- [ ] Admin password changed
- [ ] Site password (`SITE_PASSWORD`) changed if used
- [ ] File storage (e.g. S3) if you need persistent uploads
