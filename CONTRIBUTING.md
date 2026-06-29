# Contributing to Frontend Junction

Thank you for your interest in contributing to Frontend Junction! This project thrives on community contributions — whether it's sharing interview experiences, writing blog posts, fixing bugs, or building new features.

## Ways to Contribute

### 📝 Submit an Interview Experience

The easiest way to contribute:

1. Visit [frontend-junction.com](https://www.frontend-junction.com)
2. Sign in with your account
3. Click "Add Experience" and fill in the details
4. Your submission will be reviewed and published

Or submit via pull request:

1. Add your experience to `data/seed-experiences.json`
2. Include: title, company, role, rounds, outcome, and key takeaways
3. Open a PR with the label `experience`

### ✍️ Write a Blog Post

1. Create a new `.mdx` file in `content/blog/`
2. Follow the frontmatter format of existing posts
3. Write about frontend topics: React patterns, CSS, performance, system design, etc.
4. Open a PR with the label `blog`

### 🐛 Report Bugs

1. Check [existing issues](https://github.com/deepu0/frontend-junction/issues) to avoid duplicates
2. Open a new issue with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser and OS info

### ✨ Build Features

1. Check the [issues](https://github.com/deepu0/frontend-junction/issues) for `good first issue` or `help wanted` labels
2. Comment on the issue to let others know you're working on it
3. Fork the repo and create a feature branch
4. Open a PR when ready

## Development Setup

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/frontend-junction.git
cd frontend-junction

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start dev server
npm run dev
```

## Pull Request Process

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Make your changes
3. Ensure all checks pass:
   ```bash
   npm run lint
   npm run check-types
   npm run build
   ```
4. Write a clear PR description explaining what and why
5. Submit the PR against `main`

Our CI pipeline runs automatically:

- ESLint + TypeScript type checking
- Security audit
- Production build
- Bundle size check
- Lighthouse performance test

## Code Style

- We use **TypeScript** — no `any` types unless absolutely necessary
- **Prettier** for formatting (runs on pre-commit via Husky)
- **ESLint** for linting
- Component files go in `components/`
- Server actions go in `actions/`
- Database queries go in `lib/`

## Community Guidelines

- Be respectful and constructive
- Keep interview experiences factual and helpful
- Don't share proprietary interview questions verbatim
- Credit original sources when applicable

## Questions?

Open a [Discussion](https://github.com/deepu0/frontend-junction/discussions) or reach out on [LinkedIn](https://www.linkedin.com/in/depaksharma/).

---

Thank you for helping frontend developers ace their interviews! 🚀
