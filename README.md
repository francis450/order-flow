# OrderFlow Kenya

OrderFlow Kenya is a full-stack demo application for automating WhatsApp-based order intake, customer credit checks, ERP dispatch simulation, and payment reconciliation for FMCG and pharmaceutical distributors in Nairobi, Kenya.

It is designed to mimic an operations desk for a wholesale distributor: incoming WhatsApp messages are parsed into structured order line items, evaluated against credit exposure rules, and optionally pushed through an ERP-style dispatch workflow.

## Features

- Parses WhatsApp-style order messages in Kenyan English, Swahili, and distributor shorthand
- Supports both FMCG and pharmaceutical catalogs
- Matches products to SKUs, unit types, prices, and totals
- Performs real-time credit evaluation using customer balances and overdue aging
- Blocks or warns on credit exposure based on policy rules
- Simulates ERP sync and warehouse bay assignment
- Shows debtor and payment workflows with M-Pesa-style prompts
- Includes a dashboard for live order monitoring, credit gates, and ROI estimation

## Tech Stack

- Frontend: React 19 + TypeScript + Vite
- Styling: Tailwind CSS
- Backend: Express + TypeScript
- AI: Google Gemini via `@google/genai`
- UI motion: `motion`
- Icons: `lucide-react`
- Runtime: Node.js

## Project Structure

```text
.
├── .env.example              # Example environment variables
├── .gitignore                # Git ignore rules
├── index.html                # Vite app entry point
├── metadata.json             # App metadata
├── package.json              # Scripts and dependencies
├── server.ts                 # Express server and API routes
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite configuration
├── src/
│   ├── App.tsx              # Main dashboard orchestration
│   ├── index.css            # Global styling
│   ├── main.tsx             # React bootstrap
│   ├── components/          # Dashboard panels and modal views
│   ├── data/
│   │   └── mockData.ts      # Sample customers and orders
│   ├── services/
│   │   └── orderService.ts  # Parse / credit / ERP / M-Pesa API client logic
│   └── types/
│       └── index.ts         # Domain models and TypeScript interfaces
└── dist/                    # Built frontend output (generated)
