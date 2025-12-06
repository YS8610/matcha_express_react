import { describe, it, expect } from 'vitest';
import { sanitizeInput, removeTags } from '@/lib/security';

describe('Security Utilities', () => {
  describe('sanitizeInput', () => {
    it('should return empty string for empty input', () => {
      expect(sanitizeInput('')).toBe('');
    });

    it('should return empty string for null/undefined input', () => {
      expect(sanitizeInput(null as unknown as string)).toBe('');
      expect(sanitizeInput(undefined as unknown as string)).toBe('');
    });

    it('should truncate input to max length', () => {
      const longString = 'a'.repeat(1001);
      const result = sanitizeInput(longString);
      expect(result.length).toBe(1000);
    });

    it('should truncate to custom max length', () => {
      const longString = 'a'.repeat(100);
      const result = sanitizeInput(longString, 50);
      expect(result.length).toBe(50);
    });

    it('should handle null bytes', () => {
      const input = 'hello\0world';
      const result = sanitizeInput(input);
      expect(result).toBeDefined();
    });

    it('should handle control characters', () => {
      const input = 'hello\x00\x01\x02world';
      const result = sanitizeInput(input);
      expect(result).toBeDefined();
    });

    it('should remove script tags', () => {
      const input = 'hello<script>alert("xss")</script>world';
      const result = sanitizeInput(input);
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
    });

    it('should remove event handlers with quoted attributes', () => {
      const input = '<div onclick="alert(\'xss\')">click</div>';
      const result = sanitizeInput(input);
      expect(result).not.toContain('onclick');
      expect(result).not.toContain('alert');
    });

    it('should remove event handlers with unquoted attributes', () => {
      const input = '<img src=x onerror=alert(1)>';
      const result = sanitizeInput(input);
      expect(result).not.toContain('onerror');
    });

    it('should preserve normal text content', () => {
      const input = 'This is a normal message with some text';
      const result = sanitizeInput(input);
      expect(result).toBe(input);
    });

    it('should handle multiple script tags', () => {
      const input = '<script>bad</script>text<script>worse</script>';
      const result = sanitizeInput(input);
      expect(result).not.toContain('<script>');
      expect(result).toContain('text');
    });
  });

  describe('removeTags', () => {
    it('should return empty string for empty input', () => {
      expect(removeTags('')).toBe('');
    });

    it('should return empty string for null/undefined input', () => {
      expect(removeTags(null as unknown as string)).toBe('');
      expect(removeTags(undefined as unknown as string)).toBe('');
    });

    it('should remove simple HTML tags', () => {
      const input = '<div>hello</div>';
      const result = removeTags(input);
      expect(result).toBe('hello');
    });

    it('should remove self-closing tags', () => {
      const input = '<br/><img src="test"/><hr>';
      const result = removeTags(input);
      expect(result).toBe('');
    });

    it('should remove tags with attributes', () => {
      const input = '<a href="http://example.com" class="link">click here</a>';
      const result = removeTags(input);
      expect(result).toBe('click here');
    });

    it('should remove nested tags', () => {
      const input = '<div><span><b>text</b></span></div>';
      const result = removeTags(input);
      expect(result).toBe('text');
    });

    it('should preserve text between tags', () => {
      const input = '<p>hello</p> <p>world</p>';
      const result = removeTags(input);
      expect(result).toBe('hello world');
    });

    it('should handle tags with line breaks', () => {
      const input = '<div\nclass="test">content</div>';
      const result = removeTags(input);
      expect(result).toBe('content');
    });

    it('should remove script tags and content', () => {
      const input = '<script>alert("xss")</script>safe';
      const result = removeTags(input);
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('</script>');
      expect(result).toContain('safe');
    });
  });
});
