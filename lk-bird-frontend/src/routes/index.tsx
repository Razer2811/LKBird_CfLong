import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bird } from "lucide-react";
import { useEffect, useState } from "react";

import { catalogApi } from "@/api/catalog";
import { ErrorState, LoadingGrid } from "@/components/feedback/states";
import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getApiErrorMessage } from "@/lib/api-error";
import { getProductImageUrl, handleProductImageError } from "@/lib/product-image";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cà phê Long, thức ăn chim, cá cảnh — Thức ăn & phụ kiện chim, cá cảnh" },
      {
        name: "description",
        content:
          "Mua thức ăn, thuốc và phụ kiện chăm sóc chim, cá cảnh chính hãng tại Cà phê Long, thức ăn chim, cá cảnh. Tư vấn tận tình, giao nhanh toàn quốc.",
      },
      { property: "og:title", content: "Cà phê Long, thức ăn chim, cá cảnh — Thức ăn & phụ kiện chim, cá cảnh" },
      {
        property: "og:description",
        content: "Thức ăn, thuốc và phụ kiện cho chim và cá cảnh, tư vấn tận tình.",
      },
    ],
  }),
  component: HomePage,
});

const heroSlides = [
  { image: "slider-1.jpg", alt: "Sản phẩm chăm sóc chim cảnh" },
  { image: "slider-2.jpg", alt: "Sản phẩm chăm sóc cá cảnh" },
  { image: "slider-3.jpg", alt: "Thức ăn và phụ kiện thú cảnh" },
];

function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const productsQuery = useQuery({ queryKey: ["products"], queryFn: catalogApi.getProducts });
  const categoriesQuery = useQuery({ queryKey: ["categories"], queryFn: catalogApi.getCategories });

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, []);

  const categoryName = (id: number) =>
    categoriesQuery.data?.find((category) => category.id === id)?.name;

  const featured = (productsQuery.data ?? []).slice(0, 6);

  return (
    <div className="flex flex-col gap-16 pb-20">
      <section className="bg-gradient-hero">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-background/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
              <Bird className="size-4" /> Cà phê Long, thức ăn chim, cá cảnh Shop
            </span>
            <h1 className="font-display text-4xl font-semibold leading-tight lg:text-5xl">
              Chăm chim, nuôi cá khoẻ mạnh mỗi ngày
            </h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground">
              Thức ăn, thuốc bổ và phụ kiện chọn lọc cho chim cảnh và cá cảnh. Đội ngũ Cà phê Long, thức ăn chim, cá cảnh tư
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

          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/80 shadow-card">
            <div className="relative aspect-[4/3]">
              {heroSlides.map((slide, index) => (
                <img
                  key={slide.image}
                  src={`${getProductImageUrl(`uploads/${slide.image}`)}?v=1`}
                  alt={slide.alt}
                  onError={handleProductImageError}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                    index === activeSlide ? "opacity-100" : "opacity-0"
                  }`}
                  {...(index === activeSlide ? {} : { "aria-hidden": true })}
                />
              ))}
              <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 bg-gradient-to-t from-black/45 to-transparent px-4 pb-5 pt-12">
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.image}
                    type="button"
                    aria-label={`Hiển thị ảnh ${index + 1}`}
                    aria-current={index === activeSlide}
                    onClick={() => setActiveSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === activeSlide ? "w-8 bg-white" : "w-2 bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold">Sản phẩm nổi bật</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Những sản phẩm được người nuôi chọn mua nhiều nhất tại Cà phê Long, thức ăn chim, cá cảnh.
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
