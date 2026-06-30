---
name: interview-extractor
description: >
  Extracts and reformats a frontend interview experience from a URL or raw
  pasted text into a clean, structured, third-person markdown case study.
  Works universally — no external APIs required. Just give it a link or text.
triggers:
  - 'extract interview'
  - 'format this interview'
  - 'rewrite this experience'
  - 'process this article'
  - 'structure this interview'
  - 'convert to interview format'
  - 'parse interview experience'
---

# Interview Experience Extractor Skill

## Purpose

Transform raw interview experience content (from a URL or pasted text) into a
clean, structured, third-person case study that is genuinely useful for
candidates preparing for frontend engineering interviews.

---

## Step-by-Step Instructions

When this skill is triggered, follow these steps in order:

### Step 1 — Acquire the content

- **If a URL is given**: Fetch the full text content of the page. Strip HTML
  tags, navigation, footers, ads, and any non-article boilerplate. Keep only
  the article body.
- **If raw text is given**: Use it directly. Strip any Medium/DEV/Hashnode
  header noise (author name, read-time badge, clap counts, "Follow" buttons).
- If neither is provided, ask: "Please share either a URL or paste the raw
  article text."

### Step 2 — Assess quality

Score the content 1–10 for being a **genuine frontend/web interview experience
narrative** using this rubric:

| Score | Meaning                                                                                            |
| ----- | -------------------------------------------------------------------------------------------------- |
| 9–10  | Detailed narrative: specific rounds, verbatim/paraphrased questions, company named, outcome stated |
| 7–8   | Good narrative but missing some details (e.g. outcome unknown, fewer questions)                    |
| 5–6   | Mostly tips/guide format — not a personal experience                                               |
| 1–4   | Not a frontend interview experience at all                                                         |

- If score < 7, respond: "This doesn't appear to be a detailed frontend
  interview experience (score: X/10). Here's why: [brief reason]. I can still
  attempt a basic summary if you'd like."
- If score ≥ 7, proceed to Step 3.

### Step 3 — Extract metadata

Identify from the content:

- `company_name` — the company being interviewed at
- `role` — job title (e.g. "Senior Software Engineer — Frontend")
- `level` — one of: intern / junior / mid / senior / staff
- `outcome` — one of: selected / rejected / pending / unknown
- `location` — city, remote, or hybrid if mentioned
- `author` — name of the person who wrote the experience (if available)
- `source_platform` — where it was originally published (Medium, DEV,
  Hashnode, LinkedIn, etc.) derived from the URL or article metadata
- `ctc` — compensation details if mentioned, else omit
- `rounds_count` — total number of interview rounds

### Step 4 — Rewrite in strict third person

**CRITICAL RULE**: The entire output MUST be in **strict third person**.

| ❌ WRONG (first person)       | ✅ CORRECT (third person)                           |
| ----------------------------- | --------------------------------------------------- |
| "I was asked about closures"  | "The candidate was asked about JavaScript closures" |
| "My first round was DSA"      | "The first round focused on DSA"                    |
| "I solved it using a hashmap" | "The candidate approached it using a hashmap"       |
| "I got the offer"             | "The candidate received an offer"                   |

**NDA / No questions disclosed**: If the article explicitly states an NDA and
gives no questions, acknowledge this in the round breakdown and focus on
round structure, skills tested, and difficulty instead of specific questions.

### Step 5 — Output the structured markdown

Produce the following sections in this exact order. Do not skip any section.
If data is unavailable for a section, write "Not mentioned" rather than
omitting the section.

---

## Output Format

```markdown
## Overview

[2–3 sentences: company, role, total rounds, outcome. Third person only.]

## Role & Compensation Details

- **Position**: [role title]
- **Company**: [company name]
- **Location**: [city / remote / hybrid]
- **Level**: [intern/junior/mid/senior/staff]
- **Experience Required**: [years if mentioned, else "Not mentioned"]
- **CTC / Stipend**: [if mentioned, else omit this line]
- **Outcome**: [Selected ✅ / Rejected ❌ / Pending ⏳ / Unknown]

## Interview Process Summary

[Bullet list of all rounds in order — name, type, duration if available]

- Round 1: [Name] — [Type] — [~duration if known]
- Round 2: ...

## Round-by-Round Breakdown

### Round N — [Round Name]

**Type**: [coding / machine-coding / system-design / conceptual / behavioral / hr]
**Difficulty**: [Easy / Medium / Hard]

**Questions asked:**

1. [Question verbatim or paraphrased — mark "(paraphrased)" if not exact]
2. ...

**What the interviewer focused on:**
[What skills/depth were being evaluated]

**Tips for this round:**
[1–2 specific, actionable tips derived from this experience]

---

[Repeat for each round]

## Key Technical Topics Covered

- **JavaScript / TypeScript**: [specific topics: closures, promises, generics…]
- **React / Framework**: [hooks, rendering, state management…]
- **CSS / Layout**: [flexbox, grid, animations…]
- **System Design**: [component design, API design, caching…]
- **DSA**: [data structures and algorithms covered]
- **Behavioral**: [themes: conflict, leadership, growth…]

## Preparation Tips

1. [Concrete, actionable tip specific to this company/role]
2. [Another tip]
3. [Another tip]
4. [Another tip — optional]
5. [Another tip — optional]

## Verdict

[2–3 sentences: outcome, overall difficulty rating (1–5 stars), whether the
candidate recommends the process/company, and any standout observation about
the hiring culture.]
```

---

## Metadata Block

After the markdown, output this JSON block (fenced) for programmatic use:

```json
{
  "company_name": "string",
  "role": "string",
  "level": "intern|junior|mid|senior|staff",
  "outcome": "selected|rejected|pending|unknown",
  "difficulty": 1-5,
  "quality_score": 1-10,
  "rounds": [
    {
      "name": "string",
      "type": "coding|machine-coding|system-design|conceptual|behavioral|hr",
      "difficulty": "easy|medium|hard"
    }
  ],
  "topics": ["react", "javascript", "..."],
  "questions": [
    {
      "question": "string",
      "type": "machine-coding|dsa|system-design|conceptual|behavioral",
      "difficulty": "easy|medium|hard",
      "topics": ["string"]
    }
  ],
  "source_platform": "Medium|DEV|Hashnode|LinkedIn|other",
  "suggested_slug": "kebab-case-seo-slug-max-8-words"
}
```

---

## Edge Case Handling

| Situation                       | How to handle                                                                                                    |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| NDA — no questions disclosed    | Focus on round structure, skills tested, difficulty. Note "Questions not disclosed (NDA)" in each round section. |
| First person throughout         | Rewrite entirely in third person. Do not leave any "I/my/me/we" references.                                      |
| No clear outcome                | Set outcome to "unknown". Do not guess.                                                                          |
| Multiple companies mentioned    | Extract the PRIMARY company being interviewed at.                                                                |
| Tips/guide format (score 5–6)   | Offer a partial extraction with a note that it's a guide, not a narrative.                                       |
| Very short content (<500 words) | Note that detail is limited and some sections may be incomplete.                                                 |
| Paywalled or inaccessible URL   | Ask the user to paste the text directly.                                                                         |

---

## Example Trigger

User says:

> "Extract interview: https://medium.com/@user/google-frontend-interview-2024"

or:

> "Format this interview experience: [pastes raw text]"

The skill then follows Steps 1–5 and outputs the full structured markdown +
metadata JSON.

---

## Quality Checklist (self-verify before outputting)

Before producing the final output, verify:

- [ ] No first-person pronouns anywhere in the markdown
- [ ] Every round has a difficulty tag
- [ ] Preparation Tips are specific to this experience, not generic
- [ ] Metadata JSON is valid and all required fields are present
- [ ] Suggested slug is ≤ 8 words, kebab-case, SEO-friendly
- [ ] Source platform is derived from URL, not from the `source` field in DB
