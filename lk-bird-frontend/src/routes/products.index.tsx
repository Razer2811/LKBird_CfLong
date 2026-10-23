import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { catalogApi } from "@/api/catalog";
import { EmptyState, ErrorState, LoadingGrid } from "@/components/feedback/states";
import { PageHeader } from "@/components/layout/page-header";
import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getApiErrorMessage } from "@/lib/api-error";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Sản phẩm chim & cá cảnh — Cà phê Long, thức ăn chim, cá cảnh" },
      {
        name: "description",
        content:
          "Danh sách thức ăn, thuốc và phụ kiện chăm sóc chim, cá cảnh tại Cà phê Long, thức ăn chim, cá cảnh. Tìm theo tên hoặc danh mục.",
      },
      { property: "og:title", content: "Sản phẩm chim & cá cảnh — Cà phê Long, thức ăn chim, cá cảnh" },
      {
        property: "og:description",
        content: "Tìm nhanh thức ăn và phụ kiện phù hợp cho chim, cá cảnh.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const pageSize = 9;
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [page, setPage] = useState(0);

  const productsQuery = useQuery({
    queryKey: ["products-page", page, keyword, categoryId],
    queryFn: () =>
      catalogApi.getProductsPage({
        offset: page * pageSize,
        limit: pageSize,
        keyword,
        categoryId,
      }),
    placeholderData: (previousData) => previousData,
  });
  const categoriesQuery = useQuery({ queryKey: ["categories"], queryFn: catalogApi.getCategories });

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
          onChange={(event) => {
            setKeyword(event.target.value);
            setPage(0);
          }}
          placeholder="Tìm theo tên, thương hiệu, loài vật…"
          className="rounded-full"
        />

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={categoryId === null ? "default" : "outline"}
            className="rounded-full"
            onClick={() => {
              setCategoryId(null);
              setPage(0);
            }}
          >
            Tất cả
          </Button>
          {(categoriesQuery.data ?? []).map((category) => (
            <Button
              key={category.id}
              size="sm"
              variant={categoryId === category.id ? "default" : "outline"}
              className={cn("rounded-full")}
              onClick={() => {
                setCategoryId(category.id);
                setPage(0);
              }}
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
        productsQuery.data.items.length ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {productsQuery.data.items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                {...(categoryName(product.categoryId)
                  ? { categoryName: categoryName(product.categoryId) }
                  : {})}
              />
            ))}
            </div>
            {productsQuery.data.totalPages > 1 ? (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href={page > 0 ? "#" : undefined}
                      aria-disabled={page === 0}
                      className={page === 0 ? "pointer-events-none opacity-50" : undefined}
                      onClick={(event) => {
                        event.preventDefault();
                        setPage((current) => Math.max(0, current - 1));
                      }}
                    />
                  </PaginationItem>
                  {Array.from({ length: productsQuery.data.totalPages }, (_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        href="#"
                        isActive={index === page}
                        onClick={(event) => {
                          event.preventDefault();
                          setPage(index);
                        }}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href={productsQuery.data.hasNext ? "#" : undefined}
                      aria-disabled={!productsQuery.data.hasNext}
                      className={!productsQuery.data.hasNext ? "pointer-events-none opacity-50" : undefined}
                      onClick={(event) => {
                        event.preventDefault();
                        if (productsQuery.data.hasNext) setPage((current) => current + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            ) : null}
          </>
        ) : (
          <EmptyState message="Không tìm thấy sản phẩm phù hợp. Bạn thử từ khoá khác nhé." />
        )
      ) : null}
    </div>
  );
}
