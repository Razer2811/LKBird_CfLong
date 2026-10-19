import { http } from './http';

export type ProductAdmin = {
  id: number;
  name: string;
  brand: string | null;
  description: string | null;
  imageUrl: string | null;
  isFragile: boolean;
  isBulky: boolean;
  petType: string | null;
  categoryId: number;
};

export type ProductAdminPayload = {
  name: string;
  brand: string | null;
  description: string | null;
  imageUrl: string | null;
  isFragile: boolean;
  isBulky: boolean;
  petType: string | null;
  categoryId: number;
};

export type CategoryAdmin = {
  id: number;
  name: string;
};

export type CategoryPayload = {
  name: string;
};

export type RoleAdmin = {
  id: number;
  name: string;
};

export type RolePayload = {
  name: string;
};

export type UserAdmin = {
  id: number;
  username: string;
  email: string;
  roleId: number;
};

export type UserPayload = {
  username: string;
  password?: string | null;
  email: string;
  roleId: number;
};

export const adminApi = {
  getProducts: async () => {
    const { data } = await http.get<ProductAdmin[]>('/products');
    return data;
  },
  createProduct: async (payload: ProductAdminPayload) => {
    const { data } = await http.post<ProductAdmin>('/products', payload);
    return data;
  },
  updateProduct: async (id: number, payload: ProductAdminPayload) => {
    const { data } = await http.put<ProductAdmin>(`/products/${id}`, payload);
    return data;
  },
  deleteProduct: async (id: number) => {
    await http.delete(`/products/${id}`);
  },
  getCategories: async () => {
    const { data } = await http.get<CategoryAdmin[]>('/categories');
    return data;
  },
  createCategory: async (payload: CategoryPayload) => {
    const { data } = await http.post<CategoryAdmin>('/categories', payload);
    return data;
  },
  updateCategory: async (id: number, payload: CategoryPayload) => {
    const { data } = await http.put<CategoryAdmin>(`/categories/${id}`, payload);
    return data;
  },
  deleteCategory: async (id: number) => {
    await http.delete(`/categories/${id}`);
  },
  getRoles: async () => {
    const { data } = await http.get<RoleAdmin[]>('/roles');
    return data;
  },
  createRole: async (payload: RolePayload) => {
    const { data } = await http.post<RoleAdmin>('/roles', payload);
    return data;
  },
  updateRole: async (id: number, payload: RolePayload) => {
    const { data } = await http.put<RoleAdmin>(`/roles/${id}`, payload);
    return data;
  },
  deleteRole: async (id: number) => {
    await http.delete(`/roles/${id}`);
  },
  getUsers: async () => {
    const { data } = await http.get<UserAdmin[]>('/users');
    return data;
  },
  createUser: async (payload: UserPayload) => {
    const { data } = await http.post<UserAdmin>('/users', payload);
    return data;
  },
  updateUser: async (id: number, payload: UserPayload) => {
    const { data } = await http.put<UserAdmin>(`/users/${id}`, payload);
    return data;
  },
  deleteUser: async (id: number) => {
    await http.delete(`/users/${id}`);
  },
};