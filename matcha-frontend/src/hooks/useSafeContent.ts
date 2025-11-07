import { useMemo, useCallback } from 'react';
import { escapeHtml, sanitizeInput, stripAndEncode, truncateText, normalizeInput } from '@/lib/security';

export function useSafeText(text: string | null | undefined) {
  return useMemo(() => {
    if (!text) return '';
    return escapeHtml(text);
  }, [text]);
}

export function useSafeHtml(html: string | null | undefined) {
  return useMemo(() => {
    if (!html) return '';

    let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    sanitized = sanitized.replace(/javascript:/gi, '');

    return sanitized;
  }, [html]);
}

export function useSafeBiography(bio: string | null | undefined, maxLength: number = 500) {
  return useMemo(() => {
    if (!bio) return '';

    const normalized = normalizeInput(bio);

    const sanitized = sanitizeInput(normalized, maxLength);

    const escaped = stripAndEncode(sanitized);

    return truncateText(escaped, maxLength);
  }, [bio, maxLength]);
}

export function useSafeUsername(username: string | null | undefined) {
  return useMemo(() => {
    if (!username) return '';

    return escapeHtml(username.slice(0, 20)); // Max 20 chars
  }, [username]);
}

export function useSafeName(firstName: string | null | undefined, lastName: string | null | undefined) {
  return useMemo(() => {
    const first = firstName ? escapeHtml(firstName.slice(0, 50)) : '';
    const last = lastName ? escapeHtml(lastName.slice(0, 50)) : '';

    return `${first} ${last}`.trim();
  }, [firstName, lastName]);
}

export function useSafeTags(tags: string[] | null | undefined) {
  return useMemo(() => {
    if (!tags || !Array.isArray(tags)) return [];

    return tags.map((tag) => {
      const sanitized = sanitizeInput(tag, 30);
      return escapeHtml(sanitized);
    });
  }, [tags]);
}

export function useSafeChatMessage(message: string | null | undefined, maxLength: number = 1000) {
  return useMemo(() => {
    if (!message) return '';

    const sanitized = sanitizeInput(message, maxLength);

    const escaped = escapeHtml(sanitized);

    return escaped;
  }, [message, maxLength]);
}

export function useSafeUrl(url: string | null | undefined) {
  return useMemo(() => {
    if (!url) return '';

    try {
      const parsed = new URL(url);
      if (!['http:', 'https:', 'ftp:'].includes(parsed.protocol)) {
        return '';
      }
      return url;
    } catch {
      return '';
    }
  }, [url]);
}

export function useSafeHref(href: string | null | undefined) {
  return useMemo(() => {
    if (!href) return '#';

    if (href.startsWith('/') || href.startsWith('.')) {
      return href;
    }

    try {
      const parsed = new URL(href);
      if (['http:', 'https:', 'ftp:', 'mailto:'].includes(parsed.protocol)) {
        return href;
      }
    } catch {
    }

    return '#';
  }, [href]);
}

export function useSafeNumber(value: any, min: number = -Infinity, max: number = Infinity): number | null {
  return useMemo(() => {
    const num = Number(value);

    if (isNaN(num) || !isFinite(num)) return null;
    if (num < min || num > max) return null;

    return num;
  }, [value, min, max]);
}

export function useSafeFormInput(input: string | null | undefined, maxLength: number = 255) {
  return useMemo(() => {
    if (!input) return '';

    let sanitized = input.replace(/[\x00-\x1F\x7F]/g, '');

    sanitized = sanitized.slice(0, maxLength);

    return escapeHtml(sanitized);
  }, [input, maxLength]);
}

export function useSafeDataAttribute(value: string | null | undefined) {
  return useMemo(() => {
    if (!value) return '';

    return value.replace(/["'<>]/g, (char) => {
      const map: Record<string, string> = {
        '"': '&quot;',
        "'": '&#39;',
        '<': '&lt;',
        '>': '&gt;',
      };
      return map[char];
    });
  }, [value]);
}

export function useSafeContentValidation(content: string | null | undefined) {
  const isSafe = useCallback((text: string): boolean => {
    if (!text) return true;

    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /onerror=/i,
      /onload=/i,
      /onclick=/i,
      /on\w+=/, 
      /<iframe/i,
      /<embed/i,
      /<object/i,
    ];

    return !dangerousPatterns.some((pattern) => pattern.test(text));
  }, []);

  return useMemo(() => isSafe(content || ''), [content, isSafe]);
}

export function useSafeTruncated(content: string | null | undefined, maxLength: number = 100) {
  return useMemo(() => {
    if (!content) return '';

    const truncated = truncateText(content, maxLength);
    return escapeHtml(truncated);
  }, [content, maxLength]);
}
