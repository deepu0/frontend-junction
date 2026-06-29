/**
 * Robustly extracts and parses JSON from a Gemini AI response.
 * Handles: markdown fences, leading/trailing text, truncated content field.
 */
export function parseAIJson(raw: string): any {
  let text = raw.trim();

  // 1. Strip markdown code fences
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '');

  // 2. Find the outermost JSON object boundaries
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    text = text.slice(start, end + 1);
  }

  // 3. Try direct parse first
  try {
    return JSON.parse(text);
  } catch {
    // 4. The `content` field (multi-line markdown) is the usual culprit.
    //    Extract all fields except `content` safely, then splice content back.
    try {
      // Replace the content value with a placeholder, parse, then restore.
      const contentMatch = text.match(/"content"\s*:\s*"([\s\S]*?)(?<!\\)",/);
      if (contentMatch) {
        const safeText = text.replace(
          contentMatch[0],
          '"content": "__CONTENT_PLACEHOLDER__",'
        );
        const parsed = JSON.parse(safeText);
        parsed.content = contentMatch[1]
          .replace(/\\n/g, '\n')
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\');
        return parsed;
      }
    } catch {
      /* fall through */
    }

    // 5. Last resort: strip the content field entirely (we can re-process later)
    try {
      const withoutContent = text.replace(/"content"\s*:\s*"[\s\S]*?(?<!\\)",?\s*/g, '"content": "",');
      return JSON.parse(withoutContent);
    } catch {
      throw new Error(`AI returned unparseable JSON. Raw (first 200 chars): ${raw.substring(0, 200)}`);
    }
  }
}
