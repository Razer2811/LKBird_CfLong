import type { SyntheticEvent } from "react";

import { API_BASE_URL } from "./api-client";

export const PRODUCT_IMAGE_PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="#eef3e7"/><text x="50%" y="50%" text-anchor="middle" font-family="sans-serif" font-size="26" fill="#7a8b6a">LK Bird</text></svg>`,
  );

/** Ảnh có thể là URL tuyệt đối hoặc đường dẫn tương đối do backend trả về. */
export function getProductImageUrl(imageUrl?: string | null): string {
  const value = imageUrl?.trim();

  if (!value) {
    return PRODUCT_IMAGE_PLACEHOLDER;
  }

  if (/^(https?:)?\/\//i.test(value) || value.startsWith("data:")) {
    return value;
  }

  return `${API_BASE_URL}/${value.replace(/^\//, "")}`;
}

export function handleProductImageError(event: SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;

  if (image.dataset["fallbackApplied"] === "true") {
    return;
  }

  image.dataset["fallbackApplied"] = "true";
  image.src = PRODUCT_IMAGE_PLACEHOLDER;
}
