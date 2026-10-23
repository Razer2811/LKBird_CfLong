import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Mail, PackageCheck, Phone } from "lucide-react";

import { catalogApi } from "@/api/catalog";
import { ErrorState } from "@/components/feedback/states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatVnd } from "@/lib/format";
import { getProductImageUrl, handleProductImageError } from "@/lib/product-image";

export const Route = createFileRoute("/products/$id")({
  head: () => ({
    meta: [
      { title: "Chi tiết sản phẩm — Cà phê Long" },
      {
        name: "description",
        content: "Thông tin chi tiết, giá và tình trạng kho của sản phẩm tại Cà phê Long, thức ăn chim, cá cảnh.",
      },
      { property: "og:title", content: "Chi tiết sản phẩm — Cà phê Long, thức ăn chim, cá cảnh" },
      {
        property: "og:description",
        content: "Thông tin chi tiết, giá và tình trạng kho của sản phẩm.",
      },
    ],
  }),
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { id } = Route.useParams();
  const productId = Number(id);

  const productQuery = useQuery({
    queryKey: ["product", productId],
    queryFn: () => catalogApi.getProductById(productId),
    enabled: Number.isFinite(productId),
  });

  const variantsQuery = useQuery({
    queryKey: ["product-variants", productId],
    queryFn: () => catalogApi.getVariantsByProductId(productId),
    enabled: Number.isFinite(productId),
  });

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 lg:px-8">
      <Button asChild variant="ghost" size="sm" className="rounded-full">
        <Link to="/products">
          <ArrowLeft className="size-4" />
          Quay lại danh sách
        </Link>
      </Button>

      {productQuery.isPending ? (
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-[4/3] w-full rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      ) : null}

      {productQuery.isError ? (
        <ErrorState
          message={getApiErrorMessage(productQuery.error, "Không tải được thông tin sản phẩm.")}
        />
      ) : null}

      {productQuery.isSuccess ? (
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-border/70 bg-secondary/50 shadow-card">
            <img
              src={getProductImageUrl(productQuery.data.imageUrl)}
              alt={productQuery.data.name}
              onError={handleProductImageError}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>

          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {productQuery.data.petType ? (
                <Badge variant="secondary">{productQuery.data.petType}</Badge>
              ) : null}
              {productQuery.data.isFragile ? <Badge variant="outline">Hàng dễ vỡ</Badge> : null}
              {productQuery.data.isBulky ? <Badge variant="outline">Hàng khổ lớn</Badge> : null}
            </div>

            <h1 className="font-display text-3xl font-semibold lg:text-4xl">
              {productQuery.data.name}
            </h1>
            {productQuery.data.brand ? (
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Thương hiệu: {productQuery.data.brand}
              </p>
            ) : null}
            <p className="text-sm leading-7 text-muted-foreground">
              {productQuery.data.description ?? "Chưa có mô tả cho sản phẩm này."}
            </p>

            <div className="space-y-3">
              <h2 className="text-base font-semibold">Giá sản phẩm</h2>

              {variantsQuery.isPending ? <Skeleton className="h-20 w-full rounded-2xl" /> : null}
              {variantsQuery.isError ? (
                <p className="text-sm text-muted-foreground">
                  Chưa lấy được thông tin giá. Bạn liên hệ shop để được báo giá nhé.
                </p>
              ) : null}

              {variantsQuery.isSuccess ? (
                variantsQuery.data.length ? (
                  <div className="space-y-3">
                    {variantsQuery.data.map((variant) => (
                      <Card
                        key={variant.id}
                        className="flex w-fit min-w-48 flex-row items-center justify-start gap-4 rounded-2xl border-primary/30 bg-primary/5 px-4 py-3 shadow-card"
                      >
                        <div className="text-left">
                          <p className="text-xl font-bold text-primary">{formatVnd(variant.price)}</p>
                          <p className="mt-1 flex items-center justify-start gap-1 text-xs text-muted-foreground">
                            <PackageCheck className="size-3.5" />
                            {variant.stock > 0 ? `Còn ${variant.stock}` : "Tạm hết hàng"}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Sản phẩm chưa có phiên bản nào được đăng bán.
                  </p>
                )
              ) : null}
            </div>

            <Card className="space-y-3 rounded-2xl border-border/70 p-5">
              <h2 className="text-base font-semibold">Liên hệ đặt hàng</h2>
              <a
                href="tel:0378605343"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <Phone className="size-4 text-primary" />
                0378605343 / 0396313407
              </a>
              <a
                href="mailto:tranleminhkhanh5734@gmail.com"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <Mail className="size-4 text-primary" />
                tranleminhkhanh5734@gmail.com
              </a>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}
