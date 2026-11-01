import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, PackageOpen } from "lucide-react";

import { catalogApi } from "@/api/catalog";
import type { Product } from "@/api/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getProductImageUrl, handleProductImageError } from "@/lib/product-image";

const formatPrice = (price: number) =>
  `${new Intl.NumberFormat("vi-VN").format(price)} ₫`;

export function ProductCard({
  product,
  categoryName,
}: {
  product: Product;
  categoryName?: string | undefined;
}) {
  const variantsQuery = useQuery({
    queryKey: ["product-variants", product.id],
    queryFn: () => catalogApi.getVariantsByProductId(product.id),
    staleTime: 5 * 60 * 1000,
  });
  const variants = variantsQuery.data ?? [];
  const prices = variants.map((variant) => variant.price).filter((price) => price > 0);
  const lowestPrice = prices.length ? Math.min(...prices) : null;
  const isOutOfStock = variantsQuery.isSuccess && variants.length > 0 && variants.every((variant) => variant.stock <= 0);

  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-[1.4rem] border-border/70 bg-card p-0 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="relative aspect-square overflow-hidden bg-secondary/60">
        <Link
          to="/products/$id"
          params={{ id: String(product.id) }}
          aria-label={`Xem chi tiết ${product.name}`}
          className="block h-full"
        >
          <img
            src={getProductImageUrl(product.imageUrl)}
            alt={product.name}
            loading="lazy"
            onError={handleProductImageError}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </Link>
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {isOutOfStock ? (
            <Badge className="border-0 bg-foreground/80 text-background">Hết hàng</Badge>
          ) : null}
          {categoryName ? (
            <Badge className="border-0 bg-background/90 text-foreground shadow-sm">{categoryName}</Badge>
          ) : null}
        </div>
        <Link
          to="/products/$id"
          params={{ id: String(product.id) }}
          aria-label={`Xem nhanh ${product.name}`}
          className="absolute bottom-3 right-3 flex size-11 translate-y-2 items-center justify-center rounded-full bg-background/95 text-foreground opacity-0 shadow-lg transition-all group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ArrowUpRight className="size-5" />
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          {product.brand ? (
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              {product.brand}
            </p>
          ) : (
            <span />
          )}
          {product.petType ? <span className="text-xs font-medium text-primary">{product.petType}</span> : null}
        </div>

        <Link
          to="/products/$id"
          params={{ id: String(product.id) }}
          className="line-clamp-2 text-base font-semibold leading-6 text-foreground transition-colors hover:text-primary"
        >
          {product.name}
        </Link>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div className="flex items-center gap-1.5">
            <PackageOpen className="size-4 text-primary" />
            <span className="text-sm font-bold text-clay">
              {variantsQuery.isPending
                ? "Đang cập nhật"
                : lowestPrice !== null
                  ? `${prices.length > 1 ? "Từ " : ""}${formatPrice(lowestPrice)}`
                  : "Liên hệ"}
            </span>
          </div>
          <span className="text-xs font-medium text-muted-foreground">Xem chi tiết</span>
        </div>
      </div>
    </Card>
  );
}
