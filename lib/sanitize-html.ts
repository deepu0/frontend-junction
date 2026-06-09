/**
 * Basic HTML sanitizer for user-generated content.
 * Strips <script>, <iframe>, event handlers (onclick, onerror, etc.),
 * javascript: URIs, and data: URIs from HTML strings.
 *
 * For a production-grade solution, consider using DOMPurify on the client
 * or sanitize-html on the server.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  return (
    html
      // Remove <script> tags and contents
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Remove <iframe> tags
      .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '')
      // Remove <object>, <embed>, <applet> tags
      .replace(/<(object|embed|applet)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
      // Remove event handlers (onclick, onerror, onload, etc.)
      .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '')
      // Remove javascript: URIs
      .replace(/href\s*=\s*["']?\s*javascript\s*:/gi, 'href="')
      // Remove data: URIs in src attributes (except images)
      .replace(/src\s*=\s*["']?\s*data\s*:(?!image\/)/gi, 'src="data:removed')
  );
}
