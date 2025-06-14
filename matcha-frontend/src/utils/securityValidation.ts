// src/utils/securityValidation.ts
import DOMPurify from 'dompurify';

export class SecurityValidator {
  
  static readonly COMMON_WORDS = [
    'password', 'admin', 'user', 'login', 'welcome', 'hello', 'test', 'guest',
    'root', 'master', 'super', 'administrator', 'access', 'secret', 'private',
    'public', 'system', 'database', 'server', 'client', 'manager', 'control',
    'security', 'firewall', 'network', 'internet', 'computer', 'software',
    'hardware', 'program', 'application', 'website', 'email', 'account',
    'profile', 'settings', 'config', 'default', 'backup', 'restore', 'update',
    'upgrade', 'install', 'download', 'upload', 'delete', 'remove', 'create',
    'new', 'old', 'current', 'previous', 'next', 'first', 'last', 'main',
    'home', 'work', 'office', 'personal', 'family', 'friend', 'love', 'life'
  ];

  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    const lowerPassword = password.toLowerCase();
    for (const word of this.COMMON_WORDS) {
      if (lowerPassword.includes(word) && word.length > 3) {
        errors.push('Password cannot contain common English words');
        break;
      }
    }

    if (/(.)\1{2,}/.test(password)) {
      errors.push('Password cannot contain repeated characters');
    }

    if (this.hasSequentialChars(password)) {
      errors.push('Password cannot contain sequential characters (123, abc, etc.)');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private static hasSequentialChars(password: string): boolean {
    const sequences = ['123456789', 'abcdefghijklmnopqrstuvwxyz', 'qwertyuiop'];
    const lowerPassword = password.toLowerCase();
    
    for (const sequence of sequences) {
      for (let i = 0; i <= sequence.length - 3; i++) {
        const subSequence = sequence.substring(i, i + 3);
        if (lowerPassword.includes(subSequence)) {
          return true;
        }
      }
    }
    return false;
  }

  static sanitizeInput(input: string): string {
    if (!input) return '';
    
    const sanitized = DOMPurify.sanitize(input, { 
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    });
    
    return sanitized
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/data:text\/html/gi, '');
  }

  static validateFileUpload(file: File): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; 
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (file.size > MAX_FILE_SIZE) {
      errors.push('File size cannot exceed 5MB');
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      errors.push('Only JPEG, PNG, and WebP images are allowed');
    }

    const fileName = file.name.toLowerCase();
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.js', '.vbs', '.jar'];
    
    for (const ext of dangerousExtensions) {
      if (fileName.includes(ext)) {
        errors.push('File type not allowed for security reasons');
        break;
      }
    }

    if (/[<>:"/\\|?*]/.test(fileName)) {
      errors.push('File name contains invalid characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static sanitizeForDatabase(input: string): string {
    if (!input) return '';
    
    return input
      .replace(/'/g, "''")  
      .replace(/;/g, '')    
      .replace(/--/g, '')   
      .replace(/\/\*/g, '') 
      .replace(/\*\//g, '')
      .replace(/xp_/gi, '') 
      .replace(/sp_/gi, '') 
      .trim();
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  }

  static validateUsername(username: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (username.length < 3 || username.length > 20) {
      errors.push('Username must be between 3 and 20 characters');
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.push('Username can only contain letters, numbers, and underscores');
    }

    if (/^[0-9]+$/.test(username)) {
      errors.push('Username cannot be only numbers');
    }

    const reserved = ['admin', 'root', 'administrator', 'moderator', 'support', 'help', 'api', 'www', 'mail', 'ftp'];
    if (reserved.includes(username.toLowerCase())) {
      errors.push('This username is reserved');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateAge(age: number): boolean {
    return age >= 18 && age <= 100;
  }

  static validateBio(bio: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const sanitizedBio = this.sanitizeInput(bio);

    if (sanitizedBio.length > 500) {
      errors.push('Bio cannot exceed 500 characters');
    }

    if (sanitizedBio.length < 10) {
      errors.push('Bio must be at least 10 characters');
    }

    const spamPatterns = [
      /(.)\1{4,}/g,           
      /\b(https?:\/\/)\S+/gi, 
      /\b[\w\.-]+@[\w\.-]+\.\w+/gi, 
      /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, 
    ];

    for (const pattern of spamPatterns) {
      if (pattern.test(bio)) {
        errors.push('Bio contains prohibited content');
        break;
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateTags(tags: string[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (tags.length > 10) {
      errors.push('Maximum 10 tags allowed');
    }

    for (const tag of tags) {
      const sanitizedTag = this.sanitizeInput(tag.trim());
      
      if (sanitizedTag.length < 2 || sanitizedTag.length > 20) {
        errors.push('Each tag must be between 2 and 20 characters');
        break;
      }

      if (!/^[a-zA-Z0-9_#]+$/.test(sanitizedTag)) {
        errors.push('Tags can only contain letters, numbers, underscores, and hashtags');
        break;
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static createRateLimiter(maxRequests: number, windowMs: number) {
    const requests = new Map<string, number[]>();

    return (identifier: string): boolean => {
      const now = Date.now();
      const userRequests = requests.get(identifier) || [];
      
      const validRequests = userRequests.filter(time => now - time < windowMs);
      
      if (validRequests.length >= maxRequests) {
        return false; 
      }

      validRequests.push(now);
      requests.set(identifier, validRequests);
      return true;
    };
  }

  static generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  static getCSPHeaders(): Record<string, string> {
    return {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self'",
        "connect-src 'self' ws: wss:",
        "media-src 'self'",
        "object-src 'none'",
        "frame-src 'none'"
      ].join('; ')
    };
  }

  static getSecurityHeaders(): Record<string, string> {
    return {
      ...this.getCSPHeaders(),
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    };
  }
}

export const validateForm = (formData: any, rules: any): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  for (const [field, value] of Object.entries(formData)) {
    if (rules[field]) {
      const rule = rules[field];
      
      if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
        errors[field] = `${field} is required`;
        continue;
      }

      switch (field) {
        case 'password':
          if (value) {
            const passwordValidation = SecurityValidator.validatePassword(value as string);
            if (!passwordValidation.isValid) {
              errors[field] = passwordValidation.errors[0];
            }
          }
          break;

        case 'email':
          if (value && !SecurityValidator.validateEmail(value as string)) {
            errors[field] = 'Invalid email format';
          }
          break;

        case 'username':
          if (value) {
            const usernameValidation = SecurityValidator.validateUsername(value as string);
            if (!usernameValidation.isValid) {
              errors[field] = usernameValidation.errors[0];
            }
          }
          break;

        case 'age':
          if (value && !SecurityValidator.validateAge(Number(value))) {
            errors[field] = 'Age must be between 18 and 100';
          }
          break;

        case 'bio':
          if (value) {
            const bioValidation = SecurityValidator.validateBio(value as string);
            if (!bioValidation.isValid) {
              errors[field] = bioValidation.errors[0];
            }
          }
          break;

        case 'tags':
          if (value) {
            const tagsValidation = SecurityValidator.validateTags(value as string[]);
            if (!tagsValidation.isValid) {
              errors[field] = tagsValidation.errors[0];
            }
          }
          break;

        default:
          if (typeof value === 'string' && value.length > 0) {
            const sanitized = SecurityValidator.sanitizeInput(value);
            if (sanitized !== value) {
              errors[field] = 'Field contains invalid content';
            }
          }
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default SecurityValidator;
