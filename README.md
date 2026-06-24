# FitScoreCV

> **Build Resumes. Measure Your Fit. Get Hired.**

FitScoreCV is an ATS-first career optimization platform. The resume builder serves the ATS engine — not the other way around.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), TypeScript (strict), Tailwind CSS v4 |
| Components | shadcn/ui, Lucide React |
| Theme | next-themes (dark/light) |
| Fonts | Inter + JetBrains Mono |
| Backend (Phase 5+) | FastAPI, spaCy, sentence-transformers |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| AI | OpenAI API |

## Project Structure

```
fitscorecv/
├── frontend/          ← Next.js 16 app
│   ├── app/           ← App Router pages
│   ├── components/    ← UI components
│   │   ├── landing/   ← Landing page sections
│   │   └── layout/    ← Navbar, Footer
│   ├── lib/           ← Utilities
│   └── public/        ← Static assets
├── backend/           ← FastAPI (Phase 5+)
└── docs/              ← Architecture, ATS engine docs
```

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/your-org/fitscorecv.git
cd fitscorecv

# 2. Set up frontend
cd frontend
npm install
cp .env.example .env.local
# Fill in .env.local with your keys

# 3. Run dev server
npm run dev
# → http://localhost:3000
```

## Phase Roadmap

| Phase | Feature | Status |
|---|---|---|
| 1 | Landing Page | ✅ Complete |
| 2 | Auth (Supabase) | 🔜 Planned |
| 3 | Resume Builder | 🔜 Planned |
| 4 | PDF/DOCX Export | 🔜 Planned |
| 5 | ATS Engine (FastAPI) | 🔜 Planned |
| 6 | JD Matching | 🔜 Planned |
| 7 | AI Suggestions | 🔜 Planned |
| 8 | Dashboard | 🔜 Planned |

## ATS Scoring Model

| Component | Weight |
|---|---|
| Skills Match | 30% |
| Keyword Match | 20% |
| Semantic Similarity | 20% |
| Formatting | 10% |
| Section Completeness | 10% |
| Readability | 10% |

Skills are extracted **dynamically** from job descriptions using NLP — no hardcoded skills database. Works for any profession.

## License

MIT
