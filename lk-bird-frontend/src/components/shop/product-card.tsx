import { Link } from "@tanstack/react-router";

import type { Product } from "@/api/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProductImageUrl, handleProductImageError } from "@/lib/product-image";

export function ProductCard({
  product,
  categoryName,
}: {
  product: Product;
  categoryName?: string | undefined;
}) {
  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-3xl border-border/70 p-0 shadow-card transition-shadow hover:shadow-soft">
      <div className="aspect-[4/3] overflow-hidden bg-secondary/60">
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
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          {categoryName ? <Badge variant="secondary">{categoryName}</Badge> : null}
          {product.petType ? <Badge variant="outline">{product.petType}</Badge> : null}
        </div>

        <h3 className="text-lg font-semibold leading-snug">{product.name}</h3>
        {product.brand ? (
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{product.brand}</p>
        ) : null}
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
          {product.description ?? "Chưa có mô tả cho sản phẩm này."}
        </p>

        <div className="mt-auto pt-2">
          <Button asChild className="w-full rounded-full">
            <Link to="/products/$id" params={{ id: String(product.id) }}>
              Xem chi tiết
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
