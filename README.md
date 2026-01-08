# Parolegy

A production-grade web platform that helps parole-eligible incarcerated people and their families create high-quality "Parole Campaign" booklets (magazine-style) that improve parole approval outcomes in Texas.

## Overview

Parolegy was founded in 2017 by Ebonie Conner. The platform combines narrative engineering, behavior/linguistic analytics, psychology, reentry planning, and strong graphic design to create compelling parole campaign materials.

**Key Statistics:**
- Texas average parole approval rate: ~34%
- Parolegy client approval rate: ~3x the Texas average
- Panel members spend ~7–10 minutes per case reviewing materials

## Features

### Service Options

1. **White-Glove "Done For You"** - Full-service campaign creation with unlimited review cycles
2. **Hybrid "Self-Serve + Consultation + Team Review"** - Guided process with team review
3. **Self-Serve "AI Campaign Generator"** - Fully automated AI-powered campaign generation

### Core Capabilities

- **Assessment Wizard** - Convert 16-page assessment into step-by-step UI
- **Document Upload Center** - Support letters, photos, certificates, employment/housing plans
- **AI Campaign Blueprint Generation** - OpenAI-powered narrative engineering
- **Campaign Builder** - Interactive editor with AI suggestions
- **PDF Generation** - High-fidelity magazine-style campaign booklets
- **Reentry Guide** - Personalized post-release planning guide
- **Multi-language Support** - UI and PDFs in 14 languages
- **Admin Portal** - Case management and review workflow

## Tech Stack

- **Framework**: Next.js 14+ (App Router) + TypeScript
- **UI**: Tailwind CSS + shadcn/ui components
- **Database**: PostgreSQL + Prisma ORM
- **File Storage**: S3-compatible (configurable via env vars)
- **PDF Generation**: @react-pdf/renderer
- **AI**: OpenAI (GPT-4)
- **Authentication**: NextAuth.js (to be implemented)
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database
- OpenAI API key
- S3-compatible storage (or local storage for development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd parolegy
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/parolegy"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"
OPENAI_MODEL="gpt-4-turbo-preview"

# File Storage (S3-compatible)
STORAGE_PROVIDER="s3" # or "local" for development
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_BUCKET_NAME="parolegy-uploads"

# NextAuth (to be configured)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# App
NODE_ENV="development"
```

4. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Open Prisma Studio to view data
npm run db:studio
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
parolegy/
├── app/                    # Next.js App Router pages
│   ├── about/             # Marketing pages
│   ├── testimonials/
│   ├── resources/
│   ├── login/             # Authentication
│   ├── signup/
│   ├── dashboard/        # Client portal
│   │   ├── assessment/   # Assessment wizard
│   │   ├── uploads/      # Document upload
│   │   └── campaign/     # Campaign builder
│   └── admin/            # Admin portal (to be implemented)
├── components/           # React components
│   ├── landing/          # Landing page components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utilities and services
│   ├── ai/               # OpenAI integration
│   ├── pdf/              # PDF generation
│   └── db.ts             # Prisma client
├── prisma/               # Database schema
└── public/               # Static assets
```

## Key Features Implementation

### Assessment Wizard

The assessment wizard converts the 16-page client background assessment into a step-by-step UI with:
- Section-based navigation
- Progress tracking
- Auto-save functionality
- Validation

### AI Campaign Generation

The AI integration uses OpenAI to:
1. Parse and structure intake data
2. Extract risk factors and panel concerns
3. Generate campaign blueprint with structured JSON
4. Draft all campaign sections
5. Provide improvement suggestions

### PDF Generation

Campaign PDFs are generated using `@react-pdf/renderer` with:
- Premium typography (Libre Baskerville)
- Magazine-style layout
- Consistent spacing and formatting
- Support for images, quotes, and callouts
- Bilingual output (English + selected language)

### Document Upload

Document upload system supports:
- Multiple file types (support letters, photos, certificates, etc.)
- File validation and size limits
- Metadata tagging
- S3-compatible storage with encryption
- Signed URLs for secure access

## Demo Mode

To test the platform without real client data:

1. Use the demo case option in the dashboard
2. Mock data is available for testing UI and PDF generation
3. Redaction mode available for previews

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Environment Variables for Production

Ensure all environment variables are set in your deployment platform:
- Database connection string
- OpenAI API key
- Storage credentials
- NextAuth secrets
- Any other service credentials

## Security & Privacy

- **Encryption**: All uploads encrypted at rest
- **Access Control**: Role-based access control (Client/Family, Staff, Admin)
- **Audit Logs**: All actions logged with actor, timestamp, and metadata
- **Data Retention**: Users can request data deletion
- **Consent Flows**: Required for uploading third-party letters/photos
- **Truth & Accuracy**: Confirmation checkboxes and digital signatures

## Ethics & Compliance

- **No Fabrication**: Platform never fabricates facts, credentials, or certificates
- **No Deception**: Photo enhancements limited to non-deceptive edits only
- **Truthfulness**: Users must confirm truth and accuracy before submission
- **Disclaimers**: Clear disclaimers that Parolegy is not a law firm and results are not guaranteed

## Multi-language Support

Supported languages:
- English, Spanish, French, Hindi, Urdu, Arabic, Vietnamese, Chinese, Portuguese, Tagalog, Korean, Igbo, Twi, Yoruba

Campaign PDFs can be generated in:
- English + selected language (two separate PDFs)

## Contributing

This is a private project. For questions or issues, contact the development team.

## License

MIT License - See LICENSE file for details.

## Support

For support, contact:
- Email: ebonie@parolegy.com
- Website: [Parolegy](https://parolegy.com)

---

**Important**: Parolegy is not a law firm and does not provide legal advice. Parole is discretionary, and results are not guaranteed.
