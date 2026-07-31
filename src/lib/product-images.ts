type VariantImageSource = {
  image_url?: string | null;
};

function uniqueNonEmpty(urls: Array<string | null | undefined>): string[] {
  return [...new Set(urls.filter((url): url is string => Boolean(url)))];
}

/** Compare storage URLs regardless of query params or encoding differences. */
export function normalizeImageUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const pathname = decodeURIComponent(parsed.pathname).replace(/\/+$/, '');
    return `${parsed.origin}${pathname}`.toLowerCase();
  } catch {
    return url.trim().toLowerCase().split(/[?#]/)[0];
  }
}

export function getVariantImageUrls(variants: VariantImageSource[]): string[] {
  return uniqueNonEmpty(variants.map((variant) => variant.image_url));
}

/** Product gallery images saved by admins. Falls back to variant images when needed. */
export function getSharedProductImages(productImages: string[], variants: VariantImageSource[]): string[] {
  const uniqueProductImages = uniqueNonEmpty(productImages);
  if (uniqueProductImages.length > 0) {
    return uniqueProductImages;
  }

  return getVariantImageUrls(variants);
}

/** Product detail gallery with placeholder fallback. */
export function buildDetailGalleryImages(
  productImages: string[],
  variants: VariantImageSource[],
): string[] {
  const galleryImages = getSharedProductImages(productImages, variants);

  if (galleryImages.length > 0) {
    return galleryImages;
  }

  return ['/placeholder.svg'];
}
