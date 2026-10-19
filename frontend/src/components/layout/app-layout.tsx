import { Outlet, Link, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';
import { authApi } from '@/api/auth';
import { useNavigate } from 'react-router-dom';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-white text-slate-900' : 'text-slate-200 hover:bg-white/10',
  ].join(' ');

export function AppLayout() {
  const navigate = useNavigate();
  const { username, role, isAuthenticated, clearSession } = useAuthStore();

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch {
        // ignore logout errors and clear local session
      }
    }

    clearSession();
    navigate('/');
  };

  return (
    <div className="min-h-screen text-slate-50">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
          <Link to="/" className="text-lg font-semibold tracking-wide">
            LK Bird
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/products" className={navLinkClass}>
              Sản phẩm
            </NavLink>
            <NavLink to="/categories" className={navLinkClass}>
              Danh mục
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/profile" className={navLinkClass}>
                  {username ?? 'Tài khoản'}
                </NavLink>
                {role === 'ADMIN' ? (
                  <NavLink to="/admin" className={navLinkClass}>
                    Admin
                  </NavLink>
                ) : null}
                <Button variant="secondary" onClick={handleLogout}>
                  Đăng xuất
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  Đăng nhập
                </NavLink>
                <NavLink to="/register" className={navLinkClass}>
                  Đăng ký
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}