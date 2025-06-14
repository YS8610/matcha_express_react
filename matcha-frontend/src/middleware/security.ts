// src/middleware/security.ts
import { SecurityValidator } from '../utils/securityValidation';

interface SecurityConfig {
  enableRateLimiting: boolean;
  enableCSRF: boolean;
  enableXSS: boolean;
  enableSQLInjection: boolean;
  enableFileValidation: boolean;
  maxRequestsPerMinute: number;
  blockedIPs: string[];
  allowedOrigins: string[];
}

interface SecurityHeaders {
  'Content-Security-Policy': string;
  'X-Content-Type-Options': string;
  'X-Frame-Options': string;
  'X-XSS-Protection': string;
  'Strict-Transport-Security': string;
  'Referrer-Policy': string;
  'Permissions-Policy': string;
  'X-DNS-Prefetch-Control': string;
}

class SecurityMiddleware {
  private config: SecurityConfig;
  private rateLimitStore: Map<string, number[]> = new Map();
  private blockedIPs: Set<string> = new Set();
  private csrfTokens: Map<string, string> = new Map();

  constructor(config: SecurityConfig) {
    this.config = config;
    this.blockedIPs = new Set(config.blockedIPs);
    
    setInterval(() => {
      this.cleanupRateLimitStore();
    }, 10 * 60 * 1000);
  }

  public securityMiddleware = (req: any, res: any, next: any) => {
    try {
      if (this.isBlocked(req.ip)) {
        return res.status(403).json({ 
          success: false, 
          message: 'Access denied' 
        });
      }

      if (this.config.enableRateLimiting && !this.checkRateLimit(req.ip)) {
        return res.status(429).json({ 
          success: false, 
          message: 'Too many requests. Please try again later.' 
        });
      }

      this.setSecurityHeaders(res);

      if (!this.checkCORS(req)) {
        return res.status(403).json({ 
          success: false, 
          message: 'CORS policy violation' 
        });
      }

      if (!this.validateContentType(req)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid content type' 
        });
      }

      if (this.config.enableXSS) {
        this.sanitizeRequest(req);
      }

      if (this.config.enableSQLInjection) {
        if (this.detectSQLInjection(req)) {
          this.logSecurityEvent('SQL_INJECTION_ATTEMPT', req);
          return res.status(400).json({ 
            success: false, 
            message: 'Invalid request' 
          });
        }
      }

      if (this.config.enableCSRF && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        if (!this.validateCSRF(req)) {
          return res.status(403).json({ 
            success: false, 
            message: 'CSRF token validation failed' 
          });
        }
      }

      next();
    } catch (error) {
      console.error('Security middleware error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal security error' 
      });
    }
  };

  public fileUploadSecurity = (req: any, res: any, next: any) => {
    if (!this.config.enableFileValidation) {
      return next();
    }

    if (req.files || req.file) {
      const files = req.files ? Object.values(req.files).flat() : [req.file];
      
      for (const file of files as any[]) {
        if (file) {
          const validation = SecurityValidator.validateFileUpload(file);
          if (!validation.isValid) {
            return res.status(400).json({
              success: false,
              message: validation.errors[0]
            });
          }

          if (!this.validateFileContent(file)) {
            return res.status(400).json({
              success: false,
              message: 'File content validation failed'
            });
          }
        }
      }
    }

    next();
  };

  public authenticationMiddleware = (req: any, res: any, next: any) => {
    try {
      const token = this.extractToken(req);
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const user = this.validateToken(token);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token'
        });
      }

      if (this.detectSuspiciousActivity(user, req)) {
        this.logSecurityEvent('SUSPICIOUS_ACTIVITY', req, user);
        return res.status(403).json({
          success: false,
          message: 'Account temporarily restricted'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({
        success: false,
        message: 'Authentication failed'
      });
    }
  };

  private checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const windowStart = now - 60000; 
    
    if (!this.rateLimitStore.has(ip)) {
      this.rateLimitStore.set(ip, [now]);
      return true;
    }

    const requests = this.rateLimitStore.get(ip)!;
    const validRequests = requests.filter(time => time > windowStart);
    
    if (validRequests.length >= this.config.maxRequestsPerMinute) {
      return false;
    }

    validRequests.push(now);
    this.rateLimitStore.set(ip, validRequests);
    return true;
  }

  private setSecurityHeaders(res: any): void {
    const headers: SecurityHeaders = {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "img-src 'self' data: https: blob:",
        "font-src 'self' https://fonts.gstatic.com",
        "connect-src 'self' ws: wss: https:",
        "media-src 'self' blob:",
        "object-src 'none'",
        "frame-src 'none'",
        "base-uri 'self'",
        "form-action 'self'"
      ].join('; '),
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(self), microphone=(), camera=(self), payment=()',
      'X-DNS-Prefetch-Control': 'off'
    };

    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    res.removeHeader('X-Powered-By');
    res.removeHeader('Server');
  }

  private checkCORS(req: any): boolean {
    const origin = req.headers.origin;
    
    if (!origin) return true; 
    
    return this.config.allowedOrigins.includes('*') || 
           this.config.allowedOrigins.includes(origin);
  }

  private validateContentType(req: any): boolean {
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      const contentType = req.headers['content-type'];
      
      if (!contentType) return false;
      
      const allowedTypes = [
        'application/json',
        'multipart/form-data',
        'application/x-www-form-urlencoded'
      ];
      
      return allowedTypes.some(type => contentType.includes(type));
    }
    
    return true;
  }

  private sanitizeRequest(req: any): void {
    if (req.body && typeof req.body === 'object') {
      this.sanitizeObject(req.body);
    }
    
    if (req.query && typeof req.query === 'object') {
      this.sanitizeObject(req.query);
    }
    
    if (req.params && typeof req.params === 'object') {
      this.sanitizeObject(req.params);
    }
  }

  private sanitizeObject(obj: any): void {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = SecurityValidator.sanitizeInput(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        this.sanitizeObject(obj[key]);
      }
    }
  }

  private detectSQLInjection(req: any): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
      /('(\s*OR\s*)*'=')/i,
      /(;\s*(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC))/i,
      /(\bUNION\s+(ALL\s+)?SELECT)/i,
      /(\b(CONCAT|SUBSTRING|ASCII|CHAR|LENGTH)\s*\()/i,
      /(\/\*.*\*\/)/,
      /(\b(EXEC|EXECUTE)\s+)/i,
      /(\bWAITFOR\s+DELAY)/i,
      /(\bCAST\s*\()/i
    ];

    const checkString = (str: string): boolean => {
      return sqlPatterns.some(pattern => pattern.test(str));
    };

    const checkObject = (obj: any): boolean => {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          if (checkString(obj[key])) return true;
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (checkObject(obj[key])) return true;
        }
      }
      return false;
    };

    return checkObject({ ...req.body, ...req.query, ...req.params });
  }

  private validateCSRF(req: any): boolean {
    const token = req.headers['x-csrf-token'] || req.body._csrf;
    const sessionId = req.sessionID || req.user?.id;
    
    if (!token || !sessionId) return false;
    
    const expectedToken = this.csrfTokens.get(sessionId);
    return token === expectedToken;
  }

  public generateCSRFToken(sessionId: string): string {
    const token = SecurityValidator.generateCSRFToken();
    this.csrfTokens.set(sessionId, token);
    
    setTimeout(() => {
      this.csrfTokens.delete(sessionId);
    }, 60 * 60 * 1000);
    
    return token;
  }

  private validateFileContent(file: any): boolean {
    const imageSignatures = {
      'image/jpeg': [0xFF, 0xD8, 0xFF],
      'image/png': [0x89, 0x50, 0x4E, 0x47],
      'image/webp': [0x52, 0x49, 0x46, 0x46]
    };

    if (file.mimetype && imageSignatures[file.mimetype as keyof typeof imageSignatures]) {
      const expectedSignature = imageSignatures[file.mimetype as keyof typeof imageSignatures];
      const fileBuffer = file.buffer || file.data;
      
      if (fileBuffer) {
        for (let i = 0; i < expectedSignature.length; i++) {
          if (fileBuffer[i] !== expectedSignature[i]) {
            return false;
          }
        }
      }
    }

    return true;
  }

  private extractToken(req: any): string | null {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }
    
    return req.headers['x-auth-token'] || req.query.token || null;
  }

  private validateToken(token: string): any {
    try {
      const decoded = this.decodeJWT(token);
      return decoded;
    } catch (error) {
      return null;
    }
  }

  private decodeJWT(token: string): any {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp && payload.exp < Date.now() / 1000) {
        throw new Error('Token expired');
      }
      return payload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  private detectSuspiciousActivity(user: any, req: any): boolean {
    const suspiciousPatterns = [
      this.checkRapidRequests(user.id),
      this.checkUnusualLocation(user, req),
      this.checkFailedAttempts(user.id)
    ];

    return suspiciousPatterns.some(Boolean);
  }

  private checkRapidRequests(userId: string): boolean {
    return false; 
  }

  private checkUnusualLocation(user: any, req: any): boolean {
    return false; 
  }

  private checkFailedAttempts(userId: string): boolean {
    return false; 
  }

  private isBlocked(ip: string): boolean {
    return this.blockedIPs.has(ip);
  }

  public blockIP(ip: string, duration?: number): void {
    this.blockedIPs.add(ip);
    
    if (duration) {
      setTimeout(() => {
        this.blockedIPs.delete(ip);
      }, duration);
    }
  }

  public unblockIP(ip: string): void {
    this.blockedIPs.delete(ip);
  }

  private cleanupRateLimitStore(): void {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    
    for (const [ip, requests] of this.rateLimitStore.entries()) {
      const validRequests = requests.filter(time => time > oneHourAgo);
      
      if (validRequests.length === 0) {
        this.rateLimitStore.delete(ip);
      } else {
        this.rateLimitStore.set(ip, validRequests);
      }
    }
  }

  private logSecurityEvent(eventType: string, req: any, user?: any): void {
    const event = {
      type: eventType,
      timestamp: new Date().toISOString(),
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      url: req.url,
      method: req.method,
      userId: user?.id,
      headers: req.headers
    };

    console.log('Security Event:', JSON.stringify(event, null, 2));
    
  }

  public getSecurityStats() {
    return {
      rateLimitStore: this.rateLimitStore.size,
      blockedIPs: this.blockedIPs.size,
      activeCSRFTokens: this.csrfTokens.size,
      lastCleanup: new Date().toISOString()
    };
  }
}

export const defaultSecurityConfig: SecurityConfig = {
  enableRateLimiting: true,
  enableCSRF: true,
  enableXSS: true,
  enableSQLInjection: true,
  enableFileValidation: true,
  maxRequestsPerMinute: 100,
  blockedIPs: [],
  allowedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ]
};

export const securityMiddleware = new SecurityMiddleware(defaultSecurityConfig);

export const withSecurity = (handler: any) => {
  return async (req: any, res: any) => {
    return new Promise((resolve, reject) => {
      securityMiddleware.securityMiddleware(req, res, (error: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(handler(req, res));
        }
      });
    });
  };
};

export const withAuth = (handler: any) => {
  return async (req: any, res: any) => {
    return new Promise((resolve, reject) => {
      securityMiddleware.authenticationMiddleware(req, res, (error: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(handler(req, res));
        }
      });
    });
  };
};

export const withFileUpload = (handler: any) => {
  return async (req: any, res: any) => {
    return new Promise((resolve, reject) => {
      securityMiddleware.fileUploadSecurity(req, res, (error: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(handler(req, res));
        }
      });
    });
  };
};
