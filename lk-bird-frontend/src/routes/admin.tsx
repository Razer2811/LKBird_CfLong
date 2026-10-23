import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { FolderTree, LayoutDashboard, PackageSearch, Shield, Users } from "lucide-react";

import { RequireAuth } from "@/components/auth/require-auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Khu quản trị — Cà phê Long, thức ăn chim, cá cảnh" },
      { name: "description", content: "Quản lý sản phẩm, danh mục, người dùng và vai trò của Cà phê Long, thức ăn chim, cá cảnh." },
      { property: "og:title", content: "Khu quản trị — Cà phê Long, thức ăn chim, cá cảnh" },
      { property: "og:description", content: "Trang quản trị nội bộ của Cà phê Long, thức ăn chim, cá cảnh." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const navItems = [
  { to: "/admin", label: "Tổng quan", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Sản phẩm", icon: PackageSearch },
  { to: "/admin/categories", label: "Danh mục", icon: FolderTree },
  { to: "/admin/users", label: "Người dùng", icon: Users },
  { to: "/admin/roles", label: "Vai trò", icon: Shield },
] as const;

const itemClass =
  "flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground";
const itemActiveClass = "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground";

function AdminLayout() {
  return (
    <RequireAuth role="ADMIN">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 lg:flex-row lg:px-8">
        <aside className="lg:w-60 lg:shrink-0">
          <nav className="flex flex-wrap gap-1 rounded-3xl border border-border/70 bg-card p-2 shadow-card lg:flex-col">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: "exact" in item ? item.exact : false }}
                className={itemClass}
                activeProps={{ className: cn(itemClass, itemActiveClass) }}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1 space-y-8">
          <Outlet />
        </div>
      </div>
    </RequireAuth>
  );
}
