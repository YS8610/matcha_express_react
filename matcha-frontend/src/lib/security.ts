import DOMPurify from 'dompurify';

export function sanitizeInput(input: string, maxLength: number = 1000): string {
  if (!input) return '';

  let truncated = input.substring(0, maxLength);

  const sanitized = DOMPurify.sanitize(truncated, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });

  return sanitized.trim();
}

export function sanitizeHtml(html: string, maxLength: number = 5000): string {
  if (!html) return '';

  const truncated = html.substring(0, maxLength);

  return DOMPurify.sanitize(truncated, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'title'],
    ALLOW_DATA_ATTR: false,
  });
}

export function removeTags(html: string): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
}

export function escapeHtml(text: string): string {
  if (!text) return '';
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

export function sanitizeUrl(url: string): string {
  if (!url) return '';

  try {
    const urlObj = new URL(url, window.location.origin);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return '';
    }
    return urlObj.toString();
  } catch {
    if (url.startsWith('/') || url.startsWith('#')) {
      return url;
    }
    return '';
  }
}

export function validateFileUpload(
  file: File,
  allowedMimeTypes: string[] = ['image/jpeg', 'image/png', 'image/webp'],
  maxSizeBytes: number = 5 * 1024 * 1024
): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (file.size > maxSizeBytes) {
    return { valid: false, error: `File size exceeds ${maxSizeBytes / 1024 / 1024}MB limit` };
  }

  if (!allowedMimeTypes.includes(file.type)) {
    return { valid: false, error: `File type ${file.type} not allowed` };
  }

  const filename = file.name;
  if (!/^[\w\-. ]+$/.test(filename)) {
    return { valid: false, error: 'Invalid filename characters' };
  }

  return { valid: true };
}

export function sanitizeFilePath(filePath: string): string {
  if (!filePath) return '';

  return filePath
    .replace(/\.\./g, '')
    .replace(/\\/g, '/')
    .replace(/\/+/g, '/')
    .replace(/^\/+/, '')
    .split('/')
    .filter((part) => part && part !== '.' && part !== '..')
    .join('/');
}

