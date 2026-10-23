export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  brand?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  isFragile: boolean;
  isBulky: boolean;
  petType?: string | null;
  categoryId: number;
};

export type ProductPage = {
  items: Product[];
  totalElements: number;
  totalPages: number;
  offset: number;
  limit: number;
  hasNext: boolean;
};

export type ProductVariant = {
  id: number;
  sku: string;
  variantName: string;
  price: number;
  stock: number;
  weightGram?: number | null;
  expiryDate?: string | null;
  imageUrl?: string | null;
  productId: number;
};

export type CurrentUser = {
  id: number;
  username: string;
  email: string;
  roleId: number;
};

export type LoginResponse = {
  message: string;
  username: string;
  role: string;
  accessToken: string;
  refreshToken: string;
};
