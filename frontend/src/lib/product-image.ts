import type { SyntheticEvent } from 'react';

const apiUrl = (import.meta as ImportMeta & { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL ?? 'http://localhost:8080';

export const productImageFallback = 'https://placehold.co/600x400/0f172a/f8fafc?text=LK+Bird';

/** Builds a browser-safe URL for an image in backend/uploads. */
export function getProductImageUrl(imageUrl?: string | null) {
  const value = imageUrl?.trim();

  if (!value) {
    return productImageFallback;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const encodedPath = value
    .replace(/^\/?uploads\//i, '')
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return `${apiUrl.replace(/\/$/, '')}/uploads/${encodedPath}`;
}

export function useProductImageFallback(event: SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.onerror = null;
  event.currentTarget.src = productImageFallback;
}
