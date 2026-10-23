import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

import { authApi } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BRAND_LOGO_URL } from "@/lib/product-image";
import { clearSession, getRefreshToken, useAuth } from "@/stores/auth-store";

const publicLinks = [
  { to: "/products", label: "Sản phẩm" },
  { to: "/categories", label: "Danh mục" },
] as const;

const linkClass =
  "rounded-full px-4 py-2 text-sm font-semibold text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground";
const activeLinkClass = "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground";

export function SiteHeader() {
  const navigate = useNavigate();
  const { username, role, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    const refreshToken = getRefreshToken();

    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch {
        // bỏ qua lỗi, vẫn xoá phiên cục bộ
      }
    }

    clearSession();
    setOpen(false);
    void navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-card">
            <img
              src={BRAND_LOGO_URL}
              alt="Logo Cà phê Long"
              className="size-full rounded-2xl object-cover"
            />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-lg font-semibold">Coffe Long - Thức ăn chim, cá cảnh</span>
            <span className="text-xs text-muted-foreground">Chim &amp; Cá cảnh</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {publicLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={linkClass}
              activeProps={{ className: cn(linkClass, activeLinkClass) }}
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className={linkClass}
                activeProps={{ className: cn(linkClass, activeLinkClass) }}
              >
                {username ?? "Tài khoản"}
              </Link>
              {role === "ADMIN" ? (
                <Link
                  to="/admin"
                  className={linkClass}
                  activeProps={{ className: cn(linkClass, activeLinkClass) }}
                >
                  Quản trị
                </Link>
              ) : null}
              <Button variant="outline" size="sm" className="ml-2 rounded-full" onClick={handleLogout}>
                <LogOut className="size-4" />
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={linkClass}
                activeProps={{ className: cn(linkClass, activeLinkClass) }}
              >
                Đăng nhập
              </Link>
              <Button asChild size="sm" className="ml-2 rounded-full">
                <Link to="/register">Đăng ký</Link>
              </Button>
            </>
          )}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Mở menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {open ? (
        <div className="border-t border-border/70 bg-background px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {publicLinks.map((link) => (
              <Link key={link.to} to={link.to} className={linkClass} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link to="/profile" className={linkClass} onClick={() => setOpen(false)}>
                  {username ?? "Tài khoản"}
                </Link>
                {role === "ADMIN" ? (
                  <Link to="/admin" className={linkClass} onClick={() => setOpen(false)}>
                    Quản trị
                  </Link>
                ) : null}
                <Button variant="outline" className="mt-2 rounded-full" onClick={handleLogout}>
                  Đăng xuất
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className={linkClass} onClick={() => setOpen(false)}>
                  Đăng nhập
                </Link>
                <Link to="/register" className={linkClass} onClick={() => setOpen(false)}>
                  Đăng ký
                </Link>
              </>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
