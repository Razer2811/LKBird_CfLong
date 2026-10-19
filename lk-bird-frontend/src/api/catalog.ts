import { apiFetch } from "@/lib/api-client";
import type { Category, Product, ProductVariant } from "./types";

export const catalogApi = {
  getProducts: () => apiFetch<Product[]>("/products"),
  getProductById: (productId: number) => apiFetch<Product>(`/products/${productId}`),
  getCategories: () => apiFetch<Category[]>("/categories"),
  getVariantsByProductId: (productId: number) =>
    apiFetch<ProductVariant[]>(`/product-variants/product/${productId}`),
};
