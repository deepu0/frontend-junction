This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result test.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Autopilot Growth Plan (Frontend Interview Content + SEO Blogs)

### Quick audit (current state)

- The project already has an automated ingestion pipeline at:
  - `GET /api/pipeline?token=CRON_SECRET` (collects content from Medium, Dev.to, Telegram, Hashnode)
  - `GET /api/pipeline/process?key=CRON_SECRET` (AI formatting, slug/summary/company normalization)
- Interview pages and review flow already exist (`/interview-experience`, `/admin`, and DB-backed moderation/status fields).
- The missing piece for "autopilot mode" is scheduling and a daily operating cadence.

### Goal

- Publish **10-15 high-quality frontend interview experiences per day** from reputable companies.
- Add supporting frontend engineering blog content to increase SEO and top-of-funnel traffic.

### Execution plan

1. **Enable secure automation**
   - Set environment variables:
     - `CRON_SECRET`
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `GEMINI_API_KEY`
2. **Schedule daily jobs**
   - Run ingestion daily (example: 02:00 UTC):
     - `/api/pipeline?token=<CRON_SECRET>`
   - Run processing daily after ingestion (example: 03:00 UTC):
     - `/api/pipeline/process?key=<CRON_SECRET>`
3. **Tune for daily 10-15 quality posts**
   - Keep strict narrative filtering (already present in sources such as Medium).
   - Adjust per-source fetch limits and tags if daily approved content is below target.
   - Maintain auto-approval only for strongly relevant frontend interview narratives; send weaker matches to review.
4. **Traffic-focused blog strategy**
   - Publish 3-5 SEO blog posts/week focused on:
     - Frontend interview prep trends
     - Company-specific frontend interview breakdowns
     - React/JavaScript/TypeScript interview round patterns
   - Interlink each blog to relevant interview-experience pages and tags.
5. **Monitoring and quality guardrails**
   - Track daily metrics: fetched, approved, published, duplicate rate, and source mix.
   - Weekly prune low-quality sources/tags and expand high-performing ones.

### Suggested 30-day rollout

- **Week 1:** configure secrets, scheduler, and baseline metrics.
- **Week 2:** tune source filters/tags until stable 10-15/day output.
- **Week 3:** begin SEO blog cadence and add internal links.
- **Week 4:** review traffic + engagement, then iterate sources and topics.
