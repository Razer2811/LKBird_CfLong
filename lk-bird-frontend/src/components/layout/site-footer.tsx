import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/70 bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3 lg:px-8">
        <div className="space-y-3">
          <p className="font-display text-xl font-semibold">LK Bird</p>
          <p className="text-sm leading-6 text-muted-foreground">
            Thức ăn, lồng, phụ kiện và sản phẩm chăm sóc chuyên dụng cho chim và cá cảnh.
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-semibold">Khám phá</p>
          <div className="flex flex-col gap-2 text-muted-foreground">
            <Link to="/products" className="transition-colors hover:text-primary">
              Sản phẩm
            </Link>
            <Link to="/categories" className="transition-colors hover:text-primary">
              Danh mục
            </Link>
            <Link to="/login" className="transition-colors hover:text-primary">
              Đăng nhập
            </Link>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-semibold">Liên hệ shop</p>
          <div className="flex flex-col gap-2 text-muted-foreground">
            <span className="flex items-center gap-2">
              <Phone className="size-4 text-primary" /> Cập nhật số điện thoại của shop
            </span>
            <span className="flex items-center gap-2">
              <Mail className="size-4 text-primary" /> Cập nhật email của shop
            </span>
            <span className="flex items-center gap-2">
              <Facebook className="size-4 text-primary" />
              <Instagram className="size-4 text-primary" /> Cập nhật link mạng xã hội
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-border/70 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} LK Bird. Mọi quyền được bảo lưu.
      </div>
    </footer>
  );
}
