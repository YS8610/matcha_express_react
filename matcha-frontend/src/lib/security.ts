export function escapeHtml(text: string): string {
  if (!text) return '';
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
  };
  return text.replace(/[&<>"'\/]/g, (char) => map[char]);
}

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

export function sanitizeHtml(html: string, allowedTags: string[] = []): string {
  if (!html) return '';

  const parser = typeof document !== 'undefined' ? document : null;
  if (!parser) return escapeHtml(html);

  const div = document.createElement('div');
  div.innerHTML = html;

  const dangerousTags = ['script', 'iframe', 'object', 'embed', 'frame', 'frameset', 'link', 'meta', 'style'];
  dangerousTags.forEach((tag) => {
    div.querySelectorAll(tag).forEach((el) => el.remove());
  });

  div.querySelectorAll('*').forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return div.innerHTML;
}

export function encodeJs(value: string): string {
  if (!value) return '';
  return value
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/\//g, '\\/')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export function isValidUrl(url: string): boolean {
  if (!url) return false;

  try {
    const parsed = new URL(url);
    const allowedProtocols = ['http:', 'https:', 'ftp:'];
    return allowedProtocols.includes(parsed.protocol);
  } catch {
    return false;
  }
}

export function sanitizeUrl(url: string): string {
  if (!url) return '';

  if (isValidUrl(url)) {
    return url;
  }

  if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
    return url.replace(/[<>"']/g, '');
  }

  return '';
}

export function removeTags(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}

export function safeJsonParse<T = any>(json: string, fallback: T | null = null): T | null {
  if (!json || typeof json !== 'string') return fallback;

  try {
    return JSON.parse(json);
  } catch (error) {
    console.warn('Invalid JSON:', error);
    return fallback;
  }
}

export function safeJsonStringify(obj: any, maxDepth: number = 10): string {
  if (!obj) return '{}';

  let depth = 0;
  const replacer = (key: string, value: any) => {
    if (depth > maxDepth) return undefined;
    depth++;
    return value;
  };

  try {
    return JSON.stringify(obj, replacer);
  } catch (error) {
    console.warn('JSON stringify failed:', error);
    return '{}';
  }
}

export function isSafeString(str: string, allowSpaces: boolean = true): boolean {
  if (!str) return true;

  const pattern = allowSpaces ? /^[a-zA-Z0-9\s\-.,!?'()]+$/ : /^[a-zA-Z0-9\-.,!?'()]+$/;
  return pattern.test(str);
}

export function removeSensitiveData<T extends Record<string, any>>(obj: T): Partial<T> {
  if (!obj || typeof obj !== 'object') return {};

  const sensitiveKeys = ['password', 'token', 'secret', 'apiKey', 'apiSecret', 'access_token', 'refresh_token', 'credit_card', 'ssn'];
  const copy = { ...obj };

  sensitiveKeys.forEach((key) => {
    if (key in copy) {
      delete copy[key];
    }
  });

  return copy;
}

export function isValidEmail(email: string): boolean {
  if (!email) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

export function stripAndEncode(text: string): string {
  return escapeHtml(removeTags(text));
}

