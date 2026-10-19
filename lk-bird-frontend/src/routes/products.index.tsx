import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { catalogApi } from "@/api/catalog";
import { EmptyState, ErrorState, LoadingGrid } from "@/components/feedback/states";
import { PageHeader } from "@/components/layout/page-header";
import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/lib/api-error";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Sản phẩm chim & cá cảnh — LK Bird" },
      {
        name: "description",
        content:
          "Danh sách thức ăn, thuốc và phụ kiện chăm sóc chim, cá cảnh tại LK Bird. Tìm theo tên hoặc danh mục.",
      },
      { property: "og:title", content: "Sản phẩm chim & cá cảnh — LK Bird" },
      {
        property: "og:description",
        content: "Tìm nhanh thức ăn và phụ kiện phù hợp cho chim, cá cảnh.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const productsQuery = useQuery({ queryKey: ["products"], queryFn: catalogApi.getProducts });
  const categoriesQuery = useQuery({ queryKey: ["categories"], queryFn: catalogApi.getCategories });

  const filtered = useMemo(() => {
    const list = productsQuery.data ?? [];
    const term = keyword.trim().toLowerCase();

    return list.filter((product) => {
      const matchCategory = categoryId === null || product.categoryId === categoryId;
      const matchTerm =
        !term ||
        product.name.toLowerCase().includes(term) ||
        (product.brand ?? "").toLowerCase().includes(term) ||
        (product.petType ?? "").toLowerCase().includes(term);
      return matchCategory && matchTerm;
    });
  }, [productsQuery.data, keyword, categoryId]);

  const categoryName = (id: number) =>
    categoriesQuery.data?.find((category) => category.id === id)?.name;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 lg:px-8">
      <PageHeader
        eyebrow="Cửa hàng"
        title="Tất cả sản phẩm"
        description="Chọn đúng thức ăn và phụ kiện cho từng loài chim, cá cảnh của bạn."
      />

      <div className="space-y-4 rounded-3xl border border-border/70 bg-card p-5 shadow-card">
        <Input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Tìm theo tên, thương hiệu, loài vật…"
          className="rounded-full"
        />

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={categoryId === null ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setCategoryId(null)}
          >
            Tất cả
          </Button>
          {(categoriesQuery.data ?? []).map((category) => (
            <Button
              key={category.id}
              size="sm"
              variant={categoryId === category.id ? "default" : "outline"}
              className={cn("rounded-full")}
              onClick={() => setCategoryId(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {productsQuery.isPending ? <LoadingGrid /> : null}
      {productsQuery.isError ? (
        <ErrorState
          message={getApiErrorMessage(productsQuery.error, "Không tải được danh sách sản phẩm.")}
        />
      ) : null}
      {productsQuery.isSuccess ? (
        filtered.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                {...(categoryName(product.categoryId)
                  ? { categoryName: categoryName(product.categoryId) }
                  : {})}
              />
            ))}
          </div>
        ) : (
          <EmptyState message="Không tìm thấy sản phẩm phù hợp. Bạn thử từ khoá khác nhé." />
        )
      ) : null}
    </div>
  );
}
