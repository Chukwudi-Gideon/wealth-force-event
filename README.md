# Wealth Force 2026

Event website for ROCKBANQ's Wealth Force 2026.

## Run locally

Requires Node.js 22 or later.

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:8080. Set the Paystack and Resend values in `.env` to enable payments and email.

## Deploy

Deploy to Vercel with `npm run build`. Add the variables from `.env.example` to the project environment, and keep `.env` out of version control.
