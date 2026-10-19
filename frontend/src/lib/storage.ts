export function getStoredAuth() {
  return {
    username: localStorage.getItem('username'),
    role: localStorage.getItem('role'),
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
  };
}