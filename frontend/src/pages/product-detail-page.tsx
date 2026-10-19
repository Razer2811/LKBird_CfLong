import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { catalogApi } from '@/api/catalog';
import { Card } from '@/components/ui/card';
import { getProductImageUrl, useProductImageFallback } from '@/lib/product-image';

export function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params.id);

  const productQuery = useQuery({
    queryKey: ['product', productId],
    queryFn: () => catalogApi.getProductById(productId),
    enabled: Number.isFinite(productId),
  });

  const variantQuery = useQuery({
    queryKey: ['product-variants', productId],
    queryFn: () => catalogApi.getVariantsByProductId(productId),
    enabled: Number.isFinite(productId),
  });

  if (productQuery.isLoading) {
    return <p className="text-slate-300">Đang tải chi tiết sản phẩm...</p>;
  }

  if (productQuery.isError || !productQuery.data) {
    return <p className="text-red-300">Không tìm thấy sản phẩm.</p>;
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card className="p-6">
          <div className="h-80 overflow-hidden rounded-2xl bg-slate-900/80">
            <img
              src={getProductImageUrl(productQuery.data.imageUrl)}
              alt={productQuery.data.name}
              className="h-full w-full object-cover"
              onError={useProductImageFallback}
            />
          </div>
        </Card>
        <Card className="space-y-4 p-6">
          <p className="text-sm text-slate-400">Category ID: {productQuery.data.categoryId}</p>
          <h1 className="text-3xl font-semibold">{productQuery.data.name}</h1>
          <p className="text-slate-300">{productQuery.data.description ?? 'Chưa có mô tả'}</p>
          <dl className="grid grid-cols-2 gap-4 text-sm text-slate-200">
            <div>
              <dt className="text-slate-400">Brand</dt>
              <dd>{productQuery.data.brand ?? 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Pet type</dt>
              <dd>{productQuery.data.petType ?? 'N/A'}</dd>
            </div>
          </dl>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Biến thể</h2>
        {variantQuery.isLoading ? (
          <p className="text-slate-300">Đang tải biến thể...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {variantQuery.data?.map((variant) => (
              <article key={variant.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">SKU: {variant.sku}</p>
                <h3 className="mt-2 text-lg font-medium">{variant.variantName}</h3>
                <p className="mt-2 text-sm text-slate-300">Giá: {variant.price}</p>
                <p className="text-sm text-slate-300">Tồn kho: {variant.stock}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}