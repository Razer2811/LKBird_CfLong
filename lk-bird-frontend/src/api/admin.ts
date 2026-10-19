import { apiFetch } from "@/lib/api-client";
import type { Category, CurrentUser, Product } from "./types";

export type ProductAdmin = Product;
export type CategoryAdmin = Category;
export type RoleAdmin = { id: number; name: string };
export type UserAdmin = CurrentUser;

export type ProductPayload = {
  name: string;
  brand: string | null;
  description: string | null;
  imageUrl: string | null;
  isFragile: boolean;
  isBulky: boolean;
  petType: string | null;
  categoryId: number;
};

export type UserPayload = {
  username: string;
  password?: string | undefined;
  email: string;
  roleId: number;
};

export const adminApi = {
  getProducts: () => apiFetch<ProductAdmin[]>("/products"),
  createProduct: (payload: ProductPayload) =>
    apiFetch<ProductAdmin>("/products", { method: "POST", body: payload }),
  updateProduct: (id: number, payload: ProductPayload) =>
    apiFetch<ProductAdmin>(`/products/${id}`, { method: "PUT", body: payload }),
  deleteProduct: (id: number) => apiFetch<void>(`/products/${id}`, { method: "DELETE" }),

  getCategories: () => apiFetch<CategoryAdmin[]>("/categories"),
  createCategory: (payload: { name: string }) =>
    apiFetch<CategoryAdmin>("/categories", { method: "POST", body: payload }),
  updateCategory: (id: number, payload: { name: string }) =>
    apiFetch<CategoryAdmin>(`/categories/${id}`, { method: "PUT", body: payload }),
  deleteCategory: (id: number) => apiFetch<void>(`/categories/${id}`, { method: "DELETE" }),

  getUsers: () => apiFetch<UserAdmin[]>("/users"),
  createUser: (payload: UserPayload) =>
    apiFetch<UserAdmin>("/users", { method: "POST", body: payload }),
  updateUser: (id: number, payload: UserPayload) =>
    apiFetch<UserAdmin>(`/users/${id}`, { method: "PUT", body: payload }),
  deleteUser: (id: number) => apiFetch<void>(`/users/${id}`, { method: "DELETE" }),

  getRoles: () => apiFetch<RoleAdmin[]>("/roles"),
  createRole: (payload: { name: string }) =>
    apiFetch<RoleAdmin>("/roles", { method: "POST", body: payload }),
  updateRole: (id: number, payload: { name: string }) =>
    apiFetch<RoleAdmin>(`/roles/${id}`, { method: "PUT", body: payload }),
  deleteRole: (id: number) => apiFetch<void>(`/roles/${id}`, { method: "DELETE" }),
};
