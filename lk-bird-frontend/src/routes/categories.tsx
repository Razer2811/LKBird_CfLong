import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Layers } from "lucide-react";

import { catalogApi } from "@/api/catalog";
import { EmptyState, ErrorState } from "@/components/feedback/states";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getApiErrorMessage } from "@/lib/api-error";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Danh mục sản phẩm — LK Bird" },
      {
        name: "description",
        content:
          "Các nhóm sản phẩm tại LK Bird: thức ăn chim, thức ăn cá, thuốc, phụ kiện lồng và bể.",
      },
      { property: "og:title", content: "Danh mục sản phẩm — LK Bird" },
      {
        property: "og:description",
        content: "Duyệt theo nhóm sản phẩm để tìm nhanh thứ bạn cần.",
      },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const categoriesQuery = useQuery({ queryKey: ["categories"], queryFn: catalogApi.getCategories });
  const productsQuery = useQuery({ queryKey: ["products"], queryFn: catalogApi.getProducts });

  const countByCategory = (id: number) =>
    (productsQuery.data ?? []).filter((product) => product.categoryId === id).length;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 lg:px-8">
      <PageHeader
        eyebrow="Danh mục"
        title="Duyệt theo nhóm sản phẩm"
        description="Chọn nhóm phù hợp để xem nhanh các sản phẩm bên trong."
      />

      {categoriesQuery.isPending ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-3xl" />
          ))}
        </div>
      ) : null}

      {categoriesQuery.isError ? (
        <ErrorState
          message={getApiErrorMessage(categoriesQuery.error, "Không tải được danh mục sản phẩm.")}
        />
      ) : null}

      {categoriesQuery.isSuccess ? (
        categoriesQuery.data.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {categoriesQuery.data.map((category) => (
              <Link key={category.id} to="/products" className="block">
                <Card className="h-full rounded-3xl border-border/70 p-6 shadow-card transition-shadow hover:shadow-soft">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-leaf-soft text-primary">
                    <Layers className="size-5" />
                  </span>
                  <h2 className="mt-4 text-lg font-semibold">{category.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {countByCategory(category.id)} sản phẩm
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState message="Chưa có danh mục nào được tạo." />
        )
      ) : null}
    </div>
  );
}
