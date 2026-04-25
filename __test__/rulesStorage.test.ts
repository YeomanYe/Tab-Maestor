import { describe, it, expect } from 'vitest';
import { toWildcardDomain } from '@/utils/rulesStorage';

describe('toWildcardDomain', () => {
  describe('normal cases: three or more parts domain', () => {
    it('normal: should convert www.baidu.com to *.baidu.com', () => {
      expect(toWildcardDomain('www.baidu.com')).toBe('*.baidu.com');
    });

    it('normal: should convert docs.github.com to *.github.com', () => {
      expect(toWildcardDomain('docs.github.com')).toBe('*.github.com');
    });

    it('normal: should convert mail.google.com to *.google.com', () => {
      expect(toWildcardDomain('mail.google.com')).toBe('*.google.com');
    });

    it('normal: should convert support.example.org to *.example.org', () => {
      expect(toWildcardDomain('support.example.org')).toBe('*.example.org');
    });

    it('normal: should convert deep.subdomain.example.com to *.example.com', () => {
      expect(toWildcardDomain('deep.subdomain.example.com')).toBe('*.example.com');
    });
  });

  describe('normal cases: two parts domain (no wildcard needed)', () => {
    it('normal: should keep github.com unchanged', () => {
      expect(toWildcardDomain('github.com')).toBe('github.com');
    });

    it('normal: should keep baidu.com unchanged', () => {
      expect(toWildcardDomain('baidu.com')).toBe('baidu.com');
    });

    it('normal: should keep example.org unchanged', () => {
      expect(toWildcardDomain('example.org')).toBe('example.org');
    });
  });

  describe('normal cases: www prefix handling', () => {
    it('normal: should remove www. prefix for two-part domains', () => {
      expect(toWildcardDomain('www.github.com')).toBe('*.github.com');
    });

    it('normal: should handle multiple www in domain', () => {
      expect(toWildcardDomain('www.www.example.com')).toBe('*.example.com');
    });
  });

  describe('edge cases', () => {
    it('edge: should handle single-part domain', () => {
      expect(toWildcardDomain('localhost')).toBe('localhost');
    });

    it('edge: should handle empty string', () => {
      expect(toWildcardDomain('')).toBe('');
    });

    it('edge: should handle domain with numbers', () => {
      expect(toWildcardDomain('shop123.example.com')).toBe('*.example.com');
    });

    it('edge: should handle domain with hyphens', () => {
      expect(toWildcardDomain('my-site.example.com')).toBe('*.example.com');
    });
  });
});
