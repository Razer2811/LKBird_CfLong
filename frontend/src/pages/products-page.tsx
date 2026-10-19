import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { catalogApi } from '@/api/catalog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { getProductImageUrl, useProductImageFallback } from '@/lib/product-image';


export function ProductsPage() {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<number | 'all'>('all');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: catalogApi.getProducts,
  });

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: catalogApi.getCategories,
  });

  const filteredProducts = useMemo(() => {
    if (!data) {
      return [];
    }

    const keyword = search.trim().toLowerCase();

    return data.filter((product) => {
      const name = product.name.toLowerCase();
      const brand = product.brand?.toLowerCase() ?? '';
      const matchesCategory = categoryId === 'all' ? true : product.categoryId === categoryId;
      const matchesSearch = !keyword || name.includes(keyword) || brand.includes(keyword);

      return matchesCategory && matchesSearch;
    });
  }, [data, search, categoryId]);

  if (isLoading) {
    return <p className="text-slate-300">Đang tải sản phẩm...</p>;
  }

  if (isError) {
    return <p className="text-red-300">Không tải được danh sách sản phẩm.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold">Danh sách sản phẩm</h2>
          <p className="mt-2 text-slate-300">Dữ liệu đang lấy từ endpoint /products.</p>
        </div>
        <div className="w-full md:max-w-sm">
          <label className="mb-2 block text-sm text-slate-300">Tìm theo tên hoặc brand</label>
          <Input 
            value={search} 
            onChange={(event) => setSearch(event.target.value)} 
            placeholder="Tìm sản phẩm..." 
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={categoryId === 'all' ? 'primary' : 'secondary'}
          onClick={() => setCategoryId('all')}
        >
          Tất cả
        </Button>
        {categoriesQuery.data?.map((category) => (
          <Button
            key={category.id}
            type="button"
            variant={categoryId === category.id ? 'primary' : 'secondary'}
            onClick={() => setCategoryId(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="p-5 flex flex-col justify-between">
            <div>
              {/* Thẻ hiển thị hình ảnh từ Backend Spring Boot */}
              <div className="mb-4 h-48 overflow-hidden rounded-2xl bg-slate-900/80">
                <img
                  src={getProductImageUrl(product.imageUrl)}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={useProductImageFallback}
                />
              </div>

              <p className="text-sm text-slate-400">#{product.id}</p>
              <h3 className="mt-2 text-xl font-medium">{product.name}</h3>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-300">
                {product.description ?? 'Chưa có mô tả'}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 pt-2">
              <span className="text-sm text-slate-400">Category: {product.categoryId}</span>
              <Link
                to={`/products/${product.id}`}
                className="inline-flex rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-400"
              >
                Xem chi tiết
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
