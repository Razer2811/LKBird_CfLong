import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '@/api/catalog';
import { Card } from '@/components/ui/card';

export function CategoriesPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: catalogApi.getCategories,
  });

  if (isLoading) {
    return <p className="text-slate-300">Đang tải danh mục...</p>;
  }

  if (isError) {
    return <p className="text-red-300">Không tải được danh mục.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Danh mục</h1>
        <p className="mt-2 text-slate-300">Dữ liệu lấy từ endpoint /categories.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data?.map((category) => (
          <Card key={category.id} className="p-5">
            <p className="text-sm text-slate-400">Category ID: {category.id}</p>
            <h2 className="mt-2 text-xl font-medium">{category.name}</h2>
          </Card>
        ))}
      </div>
    </div>
  );
}
