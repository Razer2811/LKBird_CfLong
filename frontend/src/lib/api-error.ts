import axios from 'axios';

export function getApiErrorMessage(error: any, fallback = 'Đã xảy ra lỗi không xác định.') {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; error?: string; detail?: string }
      | string
      | undefined;

    if (typeof data === 'string' && data.trim()) {
      return data;
    }

    if (data && typeof data === 'object') {
      return data.message ?? data.error ?? data.detail ?? fallback;
    }
  }

  return fallback;
}