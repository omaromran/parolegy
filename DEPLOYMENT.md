# Deployment Guide

## Password Protection

The site is password protected with the password: `angel123@`

Users will be prompted to enter this password when they first visit the site. The password is stored in a cookie for 30 days.

To change the password, update the `SITE_PASSWORD` environment variable.

## Environment Variables

Required environment variables:

```env
DATABASE_URL="file:./dev.db"  # For SQLite, or PostgreSQL connection string
NEXTAUTH_SECRET="your-secret-key"  # Generate with: openssl rand -base64 32
SITE_PASSWORD="angel123@"
```

## GitHub Repository

The code has been pushed to: https://github.com/omaromran/parolegy

## Admin Credentials

- Email: `admin@parolegy.com`
- Password: `admin123`

⚠️ **IMPORTANT:** Change these credentials in production!

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and update values
4. Run database setup: `npm run db:push`
5. Create admin account: `npm run create-admin`
6. Start server: `npm run dev`

## Production Deployment

For production:
1. Use PostgreSQL instead of SQLite
2. Update `DATABASE_URL` in environment variables
3. Change `prisma/schema.prisma` provider back to `postgresql`
4. Generate secure `NEXTAUTH_SECRET`
5. Change admin password
6. Change site password if needed
7. Set up proper file storage (S3)
