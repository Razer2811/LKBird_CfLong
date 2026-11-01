import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

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
  validateSearch: z.object({
    categoryId: z.coerce.number().int().positive().optional(),
  }),
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
  const search = Route.useSearch();
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(search.categoryId ?? null);
  const [page, setPage] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

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
  const selectedCategory = categoryId ? categoryName(categoryId) : null;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:py-12 lg:px-8">
      <PageHeader
        eyebrow="Cửa hàng Cà phê Long"
        title="Đồ tốt cho những người bạn nhỏ"
        description="Thức ăn, thuốc và phụ kiện được chọn kỹ cho chim cảnh, cá cảnh khỏe mạnh mỗi ngày."
      />

      <div className="flex items-center justify-between gap-3 lg:hidden">
        <Button variant="outline" className="rounded-full" onClick={() => setFiltersOpen((open) => !open)}>
          {filtersOpen ? <X /> : <SlidersHorizontal />}
          Bộ lọc
        </Button>
        <span className="text-sm text-muted-foreground">
          {productsQuery.data ? `${productsQuery.data.totalElements} sản phẩm` : "Đang tải…"}
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[230px_1fr]">
        <aside className={cn("h-fit rounded-3xl border border-border/70 bg-card p-5 shadow-card lg:block", filtersOpen ? "block" : "hidden")}>
          <div className="flex items-center gap-2 text-sm font-bold">
            <Filter className="size-4 text-primary" />
            Lọc sản phẩm
          </div>
          <div className="mt-5 space-y-2">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Danh mục</p>
            <Button
              variant={categoryId === null ? "secondary" : "ghost"}
              className="w-full justify-start rounded-xl"
              onClick={() => { setCategoryId(null); setPage(0); setFiltersOpen(false); }}
            >
              Tất cả sản phẩm
            </Button>
            {(categoriesQuery.data ?? []).map((category) => (
              <Button
                key={category.id}
                variant={categoryId === category.id ? "secondary" : "ghost"}
                className="w-full justify-start rounded-xl"
                onClick={() => { setCategoryId(category.id); setPage(0); setFiltersOpen(false); }}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </aside>

        <section className="min-w-0 space-y-5">
          <div className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-card p-4 shadow-card sm:p-5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={keyword}
                onChange={(event) => { setKeyword(event.target.value); setPage(0); }}
                placeholder="Tìm theo tên, thương hiệu, loài vật…"
                className="h-12 rounded-2xl border-0 bg-muted pl-11 shadow-none focus-visible:ring-2"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-sm font-semibold">Danh mục:</span>
              {["Tất cả", ...(categoriesQuery.data ?? []).map((category) => category.name)].map((label) => {
                const active = label === "Tất cả" ? categoryId === null : label === selectedCategory;
                return (
                  <Button
                    key={label}
                    size="sm"
                    variant={active ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() => {
                      const category = categoriesQuery.data?.find((item) => item.name === label);
                      setCategoryId(category?.id ?? null);
                      setPage(0);
                    }}
                  >
                    {label}
                  </Button>
                );
              })}
            </div>
          </div>

          {selectedCategory || keyword ? (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted-foreground">Đang lọc:</span>
              {selectedCategory ? <span className="rounded-full bg-leaf-soft px-3 py-1 font-medium text-primary">{selectedCategory}</span> : null}
              {keyword ? <span className="rounded-full bg-leaf-soft px-3 py-1 font-medium text-primary">“{keyword}”</span> : null}
              <button type="button" className="font-semibold text-clay underline underline-offset-4" onClick={() => { setKeyword(""); setCategoryId(null); setPage(0); }}>
                Xóa lọc
              </button>
            </div>
          ) : null}

          {productsQuery.isPending ? <LoadingGrid /> : null}
          {productsQuery.isError ? (
            <ErrorState message={getApiErrorMessage(productsQuery.error, "Không tải được danh sách sản phẩm.")} />
          ) : null}
          {productsQuery.isSuccess ? (
            productsQuery.data.items.length ? (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground"><strong className="text-foreground">{productsQuery.data.totalElements}</strong> sản phẩm phù hợp</p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
                  {productsQuery.data.items.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      {...(categoryName(product.categoryId) ? { categoryName: categoryName(product.categoryId) } : {})}
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
        </section>
      </div>
    </div>
  );
}
