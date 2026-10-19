import { http } from './http';

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  username: string;
  role: string | null;
  accessToken: string;
  refreshToken: string;
};

export type RegisterRequest = {
  username: string;
  password: string;
  email: string;
};

export type RefreshResponse = {
  accessToken: string;
};

export type CurrentUser = {
  id: number;
  username: string;
  email: string;
  roleId: number;
};

export const authApi = {
  login: async (payload: LoginRequest) => {
    const { data } = await http.post<LoginResponse>('/auth/login', payload);
    return data;
  },
  register: async (payload: RegisterRequest) => {
    const { data } = await http.post('/users/register', payload);
    return data;
  },
  refresh: async (refreshToken: string) => {
    const { data } = await http.post<RefreshResponse>('/auth/refresh', { refreshToken });
    return data;
  },
  logout: async (refreshToken: string) => {
    await http.post('/auth/logout', { refreshToken });
  },
  me: async () => {
    const { data } = await http.get<CurrentUser>('/users/me');
    return data;
  },
};