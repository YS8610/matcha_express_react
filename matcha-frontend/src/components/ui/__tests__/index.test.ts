import { describe, it, expect } from 'vitest';
import * as UIComponents from '../index';

describe('UI Components Barrel Export', () => {
  it('should export FormInput component', () => {
    expect(UIComponents.FormInput).toBeDefined();
    expect(typeof UIComponents.FormInput).toBe('function');
  });

  it('should export FormTextarea component', () => {
    expect(UIComponents.FormTextarea).toBeDefined();
    expect(typeof UIComponents.FormTextarea).toBe('function');
  });

  it('should export FormSelect component', () => {
    expect(UIComponents.FormSelect).toBeDefined();
    expect(typeof UIComponents.FormSelect).toBe('function');
  });

  it('should export Button component', () => {
    expect(UIComponents.Button).toBeDefined();
    expect(typeof UIComponents.Button).toBe('function');
  });

  it('should export Alert component', () => {
    expect(UIComponents.Alert).toBeDefined();
    expect(typeof UIComponents.Alert).toBe('function');
  });

  it('should export all expected components', () => {
    const expectedExports = [
      'FormInput',
      'FormTextarea',
      'FormSelect',
      'Button',
      'Alert',
    ];

    expectedExports.forEach(exportName => {
      expect(UIComponents).toHaveProperty(exportName);
    });
  });

  it('should have exactly 5 exports', () => {
    const exportCount = Object.keys(UIComponents).length;
    expect(exportCount).toBe(5);
  });

  it('should not have unexpected exports', () => {
    const expectedExports = new Set([
      'FormInput',
      'FormTextarea',
      'FormSelect',
      'Button',
      'Alert',
    ]);

    Object.keys(UIComponents).forEach(exportName => {
      expect(expectedExports.has(exportName)).toBe(true);
    });
  });

  it('should export valid React components', () => {
    const components = [
      UIComponents.FormInput,
      UIComponents.FormTextarea,
      UIComponents.FormSelect,
      UIComponents.Button,
      UIComponents.Alert,
    ];

    components.forEach(Component => {
      expect(Component).toBeDefined();
      expect(typeof Component).toBe('function');
    });
  });
});
