/**
 * Resolves any image path or URL (Cloudinary, relative, absolute, external, data-url)
 * ensuring optimized delivery with responsive variants and automatic format selection.
 */

export type ImageVariant = 'thumbnail' | 'card' | 'detail' | 'original' | 'optimized';

/**
 * Injects responsive dimensions and automatic compression (f_auto, q_auto)
 * into Cloudinary URLs.
 */
export function transformCloudinaryUrl(url: string, variant: ImageVariant = 'card'): string {
  if (!url || !url.includes('res.cloudinary.com/')) {
    return url;
  }

  const transforms: Record<ImageVariant, string> = {
    thumbnail: 'f_auto,q_auto,w_150,h_150,c_fill',
    card: 'f_auto,q_auto,w_400,h_400,c_limit',
    detail: 'f_auto,q_auto,w_1000,h_1000,c_limit',
    optimized: 'f_auto,q_auto',
    original: '',
  };

  const transformParam = transforms[variant];
  if (!transformParam) return url;

  const uploadToken = '/image/upload/';
  const idx = url.indexOf(uploadToken);
  if (idx === -1) return url;

  const prefix = url.slice(0, idx + uploadToken.length);
  const rest = url.slice(idx + uploadToken.length);

  // Check if first segment is an existing transformation
  const firstSlash = rest.indexOf('/');
  if (firstSlash !== -1) {
    const firstSegment = rest.slice(0, firstSlash);
    if (
      !/^v\d+$/.test(firstSegment) &&
      (firstSegment.includes(',') || /^[a-z]_[a-z0-9]/i.test(firstSegment))
    ) {
      return `${prefix}${transformParam}/${rest.slice(firstSlash + 1)}`;
    }
  }

  return `${prefix}${transformParam}/${rest}`;
}

export function getProductImageUrl(src?: string | null, variant: ImageVariant = 'card'): string {
  if (!src || typeof src !== 'string' || !src.trim()) {
    return '/images/oxygen_concentrator.png';
  }

  const trimmed = src.trim();

  // Cloudinary cloud-delivered asset: apply automatic delivery optimization
  if (trimmed.includes('res.cloudinary.com/')) {
    return transformCloudinaryUrl(trimmed, variant);
  }

  // Already a full external or local URL, or base64 data-url
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // Legacy backend upload path fallback (if any remains)
  if (trimmed.startsWith('/uploads/')) {
    const backendUrl =
      process.env.NEXT_PUBLIC_CLIENT_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL;
    if (backendUrl) {
      const cleanBackend = backendUrl.replace(/\/+$/, '');
      return `${cleanBackend}${trimmed}`;
    }
  }

  return trimmed;
}
