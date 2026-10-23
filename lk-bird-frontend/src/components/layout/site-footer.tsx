import { Link } from "@tanstack/react-router";
import { Facebook, Github, Instagram, Mail, Phone } from "lucide-react";

import { BRAND_LOGO_URL } from "@/lib/product-image";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/70 bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3 lg:px-8">
        <div className="space-y-3">
          <img
            src={BRAND_LOGO_URL}
            alt="Logo Cà phê Long"
            className="size-16 rounded-2xl object-cover"
          />
          <p className="font-display text-xl font-semibold">Cà phê Long, thức ăn chim, cá cảnh</p>
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
              <Phone className="size-4 text-primary shrink-0" /> 0378605343 / 0396313407
            </span>
            <span className="flex items-center gap-2">
              <Mail className="size-4 text-primary shrink-0" /> tranleminhkhanh5734@gmail.com
            </span>
            
            {/* Phần mạng xã hội đã thu gọn thành icon có thể click */}
            <div className="flex items-center gap-3 pt-1">
              <a 
                href="https://www.facebook.com/long.tran.493610" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="size-4" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Phần Copyright */}
      <div className="border-t border-border/70 py-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
        <span>© {new Date().getFullYear()} Built with Minh Khánh by</span>
        <a 
          href="https://github.com/Razer2811" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          aria-label="GitHub Profile"
        >
          <Github className="size-4" />
        </a>
      </div>
    </footer>
  );
}