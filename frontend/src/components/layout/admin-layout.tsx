import { Outlet, Link, NavLink } from 'react-router-dom';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'block rounded-xl px-4 py-3 text-sm font-medium transition-colors',
    isActive ? 'bg-orange-500 text-white' : 'text-slate-300 hover:bg-white/10',
  ].join(' ');

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-soft">
          <Link to="/admin" className="mb-6 block text-xl font-semibold">
            Admin Panel
          </Link>
          <nav className="space-y-2">
            <NavLink to="/admin" end className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/products" className={navLinkClass}>
              Sản phẩm
            </NavLink>
            <NavLink to="/admin/categories" className={navLinkClass}>
              Danh mục
            </NavLink>
            <NavLink to="/admin/users" className={navLinkClass}>
              Người dùng
            </NavLink>
            <NavLink to="/admin/roles" className={navLinkClass}>
              Vai trò
            </NavLink>
          </nav>
        </aside>
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft">
          <Outlet />
        </section>
      </div>
    </div>
  );
}