import { apiFetch } from "@/lib/api-client";
import type { Category, Product, ProductPage, ProductVariant } from "./types";

export const catalogApi = {
  getProducts: () => apiFetch<Product[]>("/products"),
  getProductsPage: ({
    offset,
    limit,
    keyword,
    categoryId,
  }: {
    offset: number;
    limit: number;
    keyword?: string;
    categoryId?: number | null;
  }) => {
    const params = new URLSearchParams({
      offset: String(offset),
      limit: String(limit),
    });
    if (keyword?.trim()) params.set("keyword", keyword.trim());
    if (categoryId !== null && categoryId !== undefined) {
      params.set("categoryId", String(categoryId));
    }
    return apiFetch<ProductPage>(`/products/paged?${params.toString()}`);
  },
  getProductById: (productId: number) => apiFetch<Product>(`/products/${productId}`),
  getCategories: () => apiFetch<Category[]>("/categories"),
  getVariantsByProductId: (productId: number) =>
    apiFetch<ProductVariant[]>(`/product-variants/product/${productId}`),
};
