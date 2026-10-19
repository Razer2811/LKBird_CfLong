import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Fish, Bird, Leaf, ShieldCheck, Truck } from "lucide-react";

import { catalogApi } from "@/api/catalog";
import { ErrorState, LoadingGrid } from "@/components/feedback/states";
import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getApiErrorMessage } from "@/lib/api-error";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LK Bird — Thức ăn & phụ kiện chim, cá cảnh" },
      {
        name: "description",
        content:
          "Mua thức ăn, thuốc và phụ kiện chăm sóc chim, cá cảnh chính hãng tại LK Bird. Tư vấn tận tình, giao nhanh toàn quốc.",
      },
      { property: "og:title", content: "LK Bird — Thức ăn & phụ kiện chim, cá cảnh" },
      {
        property: "og:description",
        content: "Thức ăn, thuốc và phụ kiện cho chim và cá cảnh, tư vấn tận tình.",
      },
    ],
  }),
  component: HomePage,
});

const benefits = [
  {
    icon: Leaf,
    title: "Nguyên liệu sạch",
    description: "Thức ăn chọn lọc, không chất bảo quản gây hại cho vật nuôi.",
  },
  {
    icon: ShieldCheck,
    title: "Chính hãng 100%",
    description: "Sản phẩm có nguồn gốc rõ ràng, đổi trả nếu không đúng mô tả.",
  },
  {
    icon: Truck,
    title: "Giao nhanh",
    description: "Đóng gói kỹ cho hàng dễ vỡ, giao toàn quốc trong 1–3 ngày.",
  },
];

function HomePage() {
  const productsQuery = useQuery({ queryKey: ["products"], queryFn: catalogApi.getProducts });
  const categoriesQuery = useQuery({ queryKey: ["categories"], queryFn: catalogApi.getCategories });

  const categoryName = (id: number) =>
    categoriesQuery.data?.find((category) => category.id === id)?.name;

  const featured = (productsQuery.data ?? []).slice(0, 6);

  return (
    <div className="flex flex-col gap-16 pb-20">
      <section className="bg-gradient-hero">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-background/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
              <Bird className="size-4" /> LK Bird Shop
            </span>
            <h1 className="font-display text-4xl font-semibold leading-tight lg:text-5xl">
              Chăm chim, nuôi cá khoẻ mạnh mỗi ngày
            </h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground">
              Thức ăn, thuốc bổ và phụ kiện chọn lọc cho chim cảnh và cá cảnh. Đội ngũ LK Bird tư
              vấn đúng nhu cầu của từng loài, từng giai đoạn.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/products">Xem sản phẩm</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/categories">Khám phá danh mục</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="rounded-3xl border-border/60 bg-background/80 p-6 shadow-card">
              <Bird className="size-8 text-primary" />
              <h2 className="mt-4 text-lg font-semibold">Dành cho chim cảnh</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Hạt kê, cám trứng, khoáng và lồng phụ kiện cho yến, chào mào, vành khuyên.
              </p>
            </Card>
            <Card className="rounded-3xl border-border/60 bg-background/80 p-6 shadow-card sm:mt-8">
              <Fish className="size-8 text-clay" />
              <h2 className="mt-4 text-lg font-semibold">Dành cho cá cảnh</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Thức ăn viên, men vi sinh, thuốc xử lý nước và thiết bị lọc bể.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 md:grid-cols-3 lg:px-8">
        {benefits.map((benefit) => (
          <Card key={benefit.title} className="rounded-3xl border-border/70 p-6 shadow-card">
            <benefit.icon className="size-7 text-primary" />
            <h3 className="mt-4 text-base font-semibold">{benefit.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{benefit.description}</p>
          </Card>
        ))}
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold">Sản phẩm nổi bật</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Những sản phẩm được người nuôi chọn mua nhiều nhất tại LK Bird.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/products">Tất cả sản phẩm</Link>
          </Button>
        </div>

        <div className="mt-8">
          {productsQuery.isPending ? <LoadingGrid /> : null}
          {productsQuery.isError ? (
            <ErrorState
              message={getApiErrorMessage(productsQuery.error, "Không tải được danh sách sản phẩm.")}
            />
          ) : null}
          {productsQuery.isSuccess ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featured.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  {...(categoryName(product.categoryId)
                    ? { categoryName: categoryName(product.categoryId) }
                    : {})}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
