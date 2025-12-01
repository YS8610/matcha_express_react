export function sanitizeInput(input: string, maxLength: number = 1000): string {
  if (!input) return '';

  let sanitized = input.substring(0, maxLength);

  sanitized = sanitized.replace(/\0/g, '');

  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, '');

  return sanitized;
}

export function removeTags(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}


