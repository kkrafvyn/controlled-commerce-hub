import { describe, expect, it } from 'vitest';

import { buildDetailGalleryImages, getSharedProductImages, normalizeImageUrl } from '@/lib/product-images';

describe('product image gallery helpers', () => {
  const productImages = [
    'https://cdn.example.com/lifestyle.jpg',
    'https://cdn.example.com/tan-variant.jpg',
    'https://cdn.example.com/blue-variant.jpg',
  ];

  const variants = [
    { image_url: 'https://cdn.example.com/tan-variant.jpg' },
    { image_url: 'https://cdn.example.com/blue-variant.jpg' },
  ];

  it('keeps all uploaded product images in the gallery', () => {
    expect(getSharedProductImages(productImages, variants)).toEqual(productImages);
  });

  it('deduplicates repeated product image URLs', () => {
    expect(
      getSharedProductImages(
        ['https://cdn.example.com/lifestyle.jpg', 'https://cdn.example.com/lifestyle.jpg'],
        variants,
      ),
    ).toEqual(['https://cdn.example.com/lifestyle.jpg']);
  });

  it('falls back to variant images when no product images exist', () => {
    expect(getSharedProductImages([], variants)).toEqual([
      'https://cdn.example.com/tan-variant.jpg',
      'https://cdn.example.com/blue-variant.jpg',
    ]);
  });

  it('builds the detail gallery from uploaded product images', () => {
    expect(buildDetailGalleryImages(productImages, variants)).toEqual(productImages);
  });

  it('shows placeholder when no product or variant images exist', () => {
    expect(buildDetailGalleryImages([], [])).toEqual(['/placeholder.svg']);
  });

  it('normalizes image URLs for stable comparison', () => {
    expect(normalizeImageUrl('https://CDN.example.com/path/file.jpg?token=abc')).toBe(
      'https://cdn.example.com/path/file.jpg',
    );
  });
});
