<p align="center">
  <img src="public/opengraph-image.jpeg" alt="Frontend Junction" width="600" />
</p>

<h1 align="center">Frontend Junction</h1>

<p align="center">
  <strong>The open-source hub for frontend interview experiences, curated jobs, and developer resources.</strong>
</p>

<p align="center">
  <a href="https://www.frontend-junction.com">🌐 Live Site</a> •
  <a href="#features">✨ Features</a> •
  <a href="#tech-stack">🛠 Tech Stack</a> •
  <a href="#getting-started">🚀 Getting Started</a> •
  <a href="#contributing">🤝 Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-Backend-green?logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-Styling-38bdf8?logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/github/license/deepu0/frontend-junction" alt="License" />
</p>

---

## Why Frontend Junction?

Frontend developers preparing for interviews often rely on scattered LinkedIn posts, random Medium articles, and word-of-mouth. **Frontend Junction** brings it all together — real interview experiences from 100+ companies, curated blog content, and a community-driven platform where developers share what actually gets asked.

**Live at [frontend-junction.com](https://www.frontend-junction.com)**

## Features

- **106+ Interview Experiences** — Real stories from Google, Meta, Amazon, Flipkart, Stripe, Adobe, and 100+ more companies, with round-by-round breakdowns
- **23 Technical Blog Posts** — In-depth articles on React patterns, system design, performance optimization, and modern CSS
- **103 Company Profiles** — Dedicated pages per company with all related experiences and interview patterns
- **AI-Powered Content Pipeline** — Automated ingestion and summarization of interview experiences from Medium, Dev.to, and Hashnode using Google Gemini
- **Full-Text Search & Filters** — Search by company, year, tech stack, and outcome (selected/rejected)
- **Community Submissions** — Authenticated users can submit their own interview experiences
- **Admin Dashboard** — Content moderation, approval workflows, and analytics
- **Blog with MDX** — Rich content with code highlighting, embedded components, and SEO optimization
- **SEO & Performance** — ISR, sitemap generation, OpenGraph images, structured data, Lighthouse CI

## Tech Stack

| Layer          | Technology                                                                 |
| -------------- | -------------------------------------------------------------------------- |
| **Framework**  | Next.js 15 (App Router, Server Actions, ISR)                               |
| **Language**   | TypeScript                                                                 |
| **Database**   | Supabase (PostgreSQL + Auth + Storage)                                     |
| **Styling**    | Tailwind CSS + Radix UI primitives                                         |
| **Animations** | Framer Motion                                                              |
| **Content**    | MDX via Velite                                                             |
| **AI**         | Google Gemini (content processing pipeline)                                |
| **CI/CD**      | GitHub Actions (lint, type check, security audit, bundle size, Lighthouse) |
| **Auth**       | Supabase SSR Auth with middleware                                          |
| **Deployment** | Vercel                                                                     |

## Getting Started

### Prerequisites

- Node.js 20.x
- npm
- Supabase account (for database & auth)

### Installation

```bash
# Clone the repository
git clone https://github.com/deepu0/frontend-junction.git
cd frontend-junction

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in the values from Supabase plus any pipeline, analytics, or deployment settings you need

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

| Variable                        | Description                                                                                           |
| ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL                                                                             |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key                                                                         |
| `SUPABASE_SERVICE_ROLE_KEY`     | Server-only Supabase key for admin routes, data pipelines, and sitemap generation                     |
| `GEMINI_API_KEY`                | Server-only Google Gemini API key for the content pipeline                                            |
| `CRON_SECRET`                   | Server-only bearer token that authorizes the protected pipeline and seed API routes                   |
| `NEXT_GOOGLE_ANALYTICS`         | Optional Google Analytics measurement ID used to load the site tag                                    |
| `GOOGLE_SITE_VERIFICATION`      | Optional Google Search Console verification token exposed in the page metadata                        |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Optional public Cloudflare Turnstile site key used by bot-protected forms                            |
| `TURNSTILE_SECRET_KEY`          | Optional server-only Cloudflare Turnstile secret used to verify bot-protected form submissions        |
| `NEXT_PUBLIC_IS_DEV`            | Optional non-production flag that relaxes cron protection for local pipeline testing                  |
| `NEXT_PUBLIC_LOGO_DEV_KEY`      | Optional public Logo.dev token for company logos; the app falls back to a bundled demo key when unset |

### Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run ESLint
npm run check-types  # TypeScript type checking
npm run check:size   # Bundle size analysis
npm run check:unused # Find unused exports (Knip)
```

## Project Structure

```
frontend-junction/
├── app/                    # Next.js App Router pages
│   ├── interview-experience/  # Experience listing & detail pages
│   ├── blog/               # Blog listing & posts
│   ├── companies/          # Company profiles
│   ├── admin/              # Admin dashboard
│   ├── api/                # API routes (experiences, pipeline, stats)
│   └── auth/               # Authentication flows
├── components/             # React components (23 components)
├── content/blog/           # MDX blog posts
├── data/                   # Seed data & fixtures
├── actions/                # Server Actions
├── hooks/                  # Custom React hooks
├── lib/                    # Supabase clients, utilities
├── public/companies/       # 103 company logos
└── .github/workflows/      # CI/CD pipeline
```

## Contributing

We welcome contributions! Whether it's:

- 📝 **Submitting interview experiences** — Share your story to help others
- 🐛 **Bug fixes** — Found something broken? PRs welcome
- ✨ **New features** — Check the [issues](https://github.com/deepu0/frontend-junction/issues) for what's planned
- 📖 **Blog posts** — Write about frontend topics in MDX
- 🌐 **Translations** — Help make the content accessible

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Roadmap

- [ ] Salary insights and compensation data per company
- [ ] Interview preparation checklists by company
- [ ] Email notifications for new experiences at followed companies
- [ ] Community upvoting and commenting on experiences
- [ ] Mobile app (React Native)
- [ ] Internationalization (i18n)

## Stats

| Metric                | Count |
| --------------------- | ----- |
| Interview Experiences | 106+  |
| Blog Posts            | 23    |
| Companies Covered     | 103   |
| Pull Requests         | 91+   |
| Commits               | 127+  |

## License

This project is licensed under [The Unlicense](LICENSE) — it's free and unencumbered software released into the public domain.

## Author

**Deepak Sharma** — Senior Frontend Engineer

- 🌐 [frontend-junction.com](https://www.frontend-junction.com)
- 💼 [LinkedIn](https://www.linkedin.com/in/depaksharma/)
- 🐙 [GitHub](https://github.com/deepu0)

---

<p align="center">
  <strong>If this project helps you land your next frontend role, consider giving it a ⭐</strong>
</p>
