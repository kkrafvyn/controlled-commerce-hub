import { describe, expect, it } from 'vitest';

import {
  extractProductImageStoragePath,
  resolveImageContentType,
  validateProductImageFile,
} from '@/lib/image-upload';

describe('image upload helpers', () => {
  it('rejects unsupported image types', () => {
    const file = new File(['data'], 'photo.heic', { type: 'image/heic' });
    expect(validateProductImageFile(file)).toContain('only JPG, PNG, and WebP');
  });

  it('accepts supported image types', () => {
    const file = new File(['data'], 'photo.webp', { type: 'image/webp' });
    expect(validateProductImageFile(file)).toBeNull();
  });

  it('resolves content type from file extension', () => {
    const file = new File(['data'], 'photo.JPG', { type: '' });
    expect(resolveImageContentType(file)).toBe('image/jpeg');
  });

  it('extracts storage paths from public URLs', () => {
    expect(
      extractProductImageStoragePath(
        'https://example.supabase.co/storage/v1/object/public/product-images/product-1/photo.jpg?token=abc',
      ),
    ).toBe('product-1/photo.jpg');
  });
});
