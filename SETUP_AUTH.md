# Authentication Setup Guide

## Quick Start

### 1. Set up Database

Make sure you have a `.env` file with your database connection:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/parolegy"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
```

### 2. Run Database Migrations

```bash
npm run db:generate
npm run db:push
# or
npm run db:migrate
```

### 3. Create Admin Account

Run the admin creation script:

```bash
npm run create-admin
```

This will create an admin account with:
- **Email:** `admin@parolegy.com`
- **Password:** `admin123`

⚠️ **IMPORTANT:** Change the password immediately in production!

### 4. Test Login

1. Go to http://localhost:3000/login
2. Use the admin credentials above
3. You'll be redirected to `/admin` dashboard

## Admin Account Details

**Default Admin Credentials:**
- Email: `admin@parolegy.com`
- Password: `admin123`

**To create a custom admin account:**

```bash
npx tsx scripts/create-admin.ts
```

This will prompt you for email, name, and password.

## User Roles

- **CLIENT** - Incarcerated client
- **FAMILY** - Family member
- **STAFF** - Staff member (can access admin panel)
- **ADMIN** - Administrator (full access)

## API Endpoints

- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

## Protected Routes

- `/dashboard` - Requires authentication (CLIENT or FAMILY)
- `/admin` - Requires ADMIN or STAFF role
- `/admin/cases` - Admin API endpoint
