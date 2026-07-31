export const PRODUCT_IMAGE_PLACEHOLDER = '/placeholder.svg';

export const ALLOWED_PRODUCT_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

export const ALLOWED_PRODUCT_IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp';

export const MAX_PRODUCT_IMAGE_BYTES = 5 * 1024 * 1024;

export function validateProductImageFile(file: File): string | null {
  if (!ALLOWED_PRODUCT_IMAGE_TYPES.has(file.type)) {
    return `${file.name}: only JPG, PNG, and WebP are supported.`;
  }

  if (file.size > MAX_PRODUCT_IMAGE_BYTES) {
    return `${file.name} is too large (max 5MB).`;
  }

  return null;
}

export function resolveImageContentType(file: File): string {
  if (ALLOWED_PRODUCT_IMAGE_TYPES.has(file.type)) {
    return file.type;
  }

  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension === 'jpg' || extension === 'jpeg') {
    return 'image/jpeg';
  }

  if (extension === 'png') {
    return 'image/png';
  }

  if (extension === 'webp') {
    return 'image/webp';
  }

  return 'image/jpeg';
}

export function resolveProductImageUrl(url?: string | null): string {
  return url?.trim() || PRODUCT_IMAGE_PLACEHOLDER;
}

export function extractProductImageStoragePath(imageUrl: string): string | null {
  const urlParts = imageUrl.split('/product-images/');
  if (urlParts.length < 2) {
    return null;
  }

  return decodeURIComponent(urlParts[1].split(/[?#]/)[0]);
}
