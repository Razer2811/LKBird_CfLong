import { http } from './http';

export type Category = {
  id: number;
  name: string;
};

export type Product = {
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

export type ProductVariant = {
  id: number;
  sku: string;
  variantName: string;
  price: number;
  stock: number;
  weightGram: number;
  expiryDate: string | null;
  imageUrl: string | null;
  productId: number;
};

export const catalogApi = {
  getCategories: async () => {
    const { data } = await http.get<Category[]>('/categories');
    return data;
  },
  getProducts: async () => {
    const { data } = await http.get<Product[]>('/products');
    return data;
  },
  getProductById: async (id: number) => {
    const { data } = await http.get<Product>(`/products/${id}`);
    return data;
  },
  getVariantsByProductId: async (productId: number) => {
    const { data } = await http.get<ProductVariant[]>(`/product-variants/product/${productId}`);
    return data;
  },
  searchProductsByName: async (name: string) => {
    const { data } = await http.get<Product[]>('/products/search/name', { params: { name } });
    return data;
  },
  searchProductsByBrand: async (brand: string) => {
    const { data } = await http.get<Product[]>('/products/search/brand', { params: { brand } });
    return data;
  },
  searchCategories: async (search: string) => {
    const { data } = await http.get<Category[]>('/categories/search', { params: { search } });
    return data;
  },
};