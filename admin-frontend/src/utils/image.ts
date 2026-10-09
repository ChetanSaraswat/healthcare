/**
 * Resolves any image path or URL (relative, absolute, external, data-url)
 * ensuring it points to the correct backend host or static asset path.
 */
export function getProductImageUrl(src?: string | null): string {
  if (!src || typeof src !== 'string' || !src.trim()) {
    return '/images/oxygen_concentrator.png';
  }

  const trimmed = src.trim();

  // Already a full external or local URL, or base64 data-url
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // If it's a backend upload path (e.g. /uploads/filename.png)
  if (trimmed.startsWith('/uploads/')) {
    const backendUrl =
      process.env.NEXT_PUBLIC_CLIENT_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      'http://localhost:8080';
    // Strip trailing slash if present
    const cleanBackend = backendUrl.replace(/\/+$/, '');
    return `${cleanBackend}${trimmed}`;
  }

  return trimmed;
}
