---
description: Configure environment variables for the universal-audit project
---

# Setup Project Environment Variables

This workflow sets up the necessary environment variables for the Vue.js medical audit platform.

## Prerequisites
- Node.js installed
- Project dependencies installed (`npm install`)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

### Supabase Configuration
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### API Configuration
```
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### AI Service Configuration (Optional)
```
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_GROQ_API_KEY=your_groq_api_key
```

## Steps

1. Copy `.env.example` to `.env` (if exists)
2. Fill in your actual values
3. Restart the development server

## Verification

Run the following to verify setup:
```bash
npm run dev
```

The application should start without environment variable errors.
