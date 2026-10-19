import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi, type ProductAdmin } from '@/api/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { getApiErrorMessage } from '@/lib/api-error';

const schema = z.object({
  name: z.string().min(2, 'Tên sản phẩm phải có ít nhất 2 ký tự'),
  brand: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  isFragile: z.boolean(),
  isBulky: z.boolean(),
  petType: z.string().optional(),
  categoryId: z.coerce.number().min(1, 'Danh mục không được để trống'),
});

type ProductFormValues = z.infer<typeof schema>;

const emptyValues: ProductFormValues = {
  name: '',
  brand: '',
  description: '',
  imageUrl: '',
  isFragile: false,
  isBulky: false,
  petType: '',
  categoryId: 0,
};

function normalizeOptionalText(value?: string) {
  const trimmed = value?.trim() ?? '';
  return trimmed ? trimmed : null;
}

export function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const productsQuery = useQuery({
    queryKey: ['admin-products'],
    queryFn: adminApi.getProducts,
  });

  const categoriesQuery = useQuery({
    queryKey: ['admin-categories'],
    queryFn: adminApi.getCategories,
  });

  const selectedProduct = useMemo(
    () => productsQuery.data?.find((product) => product.id === selectedId) ?? null,
    [productsQuery.data, selectedId],
  );

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (selectedProduct) {
      reset({
        name: selectedProduct.name,
        brand: selectedProduct.brand ?? '',
        description: selectedProduct.description ?? '',
        imageUrl: selectedProduct.imageUrl ?? '',
        isFragile: selectedProduct.isFragile,
        isBulky: selectedProduct.isBulky,
        petType: selectedProduct.petType ?? '',
        categoryId: selectedProduct.categoryId,
      });
      return;
    }

    reset(emptyValues);
  }, [selectedProduct, reset]);

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['admin-products'] });
  };

  const upsertMutation = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      const payload = {
        name: values.name.trim(),
        brand: normalizeOptionalText(values.brand),
        description: normalizeOptionalText(values.description),
        imageUrl: normalizeOptionalText(values.imageUrl),
        isFragile: values.isFragile,
        isBulky: values.isBulky,
        petType: normalizeOptionalText(values.petType),
        categoryId: values.categoryId,
      };

      if (selectedId) {
        return adminApi.updateProduct(selectedId, payload);
      }

      return adminApi.createProduct(payload);
    },
    onSuccess: async () => {
      setServerError(null);
      setSelectedId(null);
      reset(emptyValues);
      await refresh();
    },
    onError: (error) => {
      setServerError(getApiErrorMessage(error, 'Không lưu được sản phẩm.'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: number) => adminApi.deleteProduct(productId),
    onSuccess: async () => {
      await refresh();
    },
  });

  const onSubmit = async (values: ProductFormValues) => {
    setServerError(null);
    await upsertMutation.mutateAsync(values);
  };

  const handleEdit = (product: ProductAdmin) => {
    setSelectedId(product.id);
  };

  const handleDelete = async (productId: number) => {
    if (!window.confirm('Bạn có chắc muốn xoá sản phẩm này không?')) {
      return;
    }

    await deleteMutation.mutateAsync(productId);
    if (selectedId === productId) {
      setSelectedId(null);
    }
  };

  const isEditing = selectedId !== null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Quản lý sản phẩm</h1>
        <p className="mt-2 text-slate-300">CRUD sản phẩm nối trực tiếp với /products.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Card className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">{isEditing ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'}</h2>
              <p className="mt-1 text-sm text-slate-400">
                {isEditing ? `Đang chỉnh sửa #${selectedId}` : 'Tạo mới sản phẩm từ form này'}
              </p>
            </div>
            {isEditing ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setSelectedId(null);
                  reset(emptyValues);
                }}
              >
                Hủy
              </Button>
            ) : null}
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Tên sản phẩm</label>
              <Input placeholder="MacBook Air M3" {...register('name')} />
              {errors.name ? <p className="text-sm text-red-300">{errors.name.message}</p> : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm text-slate-200">Brand</label>
                <Input placeholder="Apple" {...register('brand')} />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-200">Loại thú cưng</label>
                <Input placeholder="Laptop" {...register('petType')} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-200">Mô tả</label>
              <Textarea rows={4} placeholder="Mô tả chi tiết..." {...register('description')} />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-200">Image URL</label>
              <Input placeholder="https://..." {...register('imageUrl')} />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-200">Danh mục</label>
              <select
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-50 outline-none transition focus:border-orange-400/60 focus:ring-2 focus:ring-orange-400/20"
                {...register('categoryId')}
              >
                <option value={0}>Chọn danh mục</option>
                {categoriesQuery.data?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId ? <p className="text-sm text-red-300">{errors.categoryId.message}</p> : null}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
                <input type="checkbox" {...register('isFragile')} />
                <span className="text-sm text-slate-200">Dễ vỡ</span>
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
                <input type="checkbox" {...register('isBulky')} />
                <span className="text-sm text-slate-200">Cồng kềnh</span>
              </label>
            </div>

            {serverError ? <p className="text-sm text-red-300">{serverError}</p> : null}

            <Button className="w-full" type="submit" disabled={isSubmitting || upsertMutation.isPending}>
              {isSubmitting || upsertMutation.isPending
                ? 'Đang lưu...'
                : isEditing
                  ? 'Cập nhật sản phẩm'
                  : 'Tạo sản phẩm'}
            </Button>
          </form>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Danh sách sản phẩm</h2>
              <p className="mt-1 text-sm text-slate-400">Bấm Sửa để load dữ liệu vào form.</p>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="border-b border-white/10 px-3 py-3">#</th>
                  <th className="border-b border-white/10 px-3 py-3">Tên</th>
                  <th className="border-b border-white/10 px-3 py-3">Brand</th>
                  <th className="border-b border-white/10 px-3 py-3">Danh mục</th>
                  <th className="border-b border-white/10 px-3 py-3">Trạng thái</th>
                  <th className="border-b border-white/10 px-3 py-3">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {productsQuery.data?.map((product) => (
                  <tr key={product.id} className="align-top text-slate-200">
                    <td className="border-b border-white/5 px-3 py-3">{product.id}</td>
                    <td className="border-b border-white/5 px-3 py-3 font-medium">{product.name}</td>
                    <td className="border-b border-white/5 px-3 py-3">{product.brand ?? 'N/A'}</td>
                    <td className="border-b border-white/5 px-3 py-3">
                      {categoriesQuery.data?.find((category) => category.id === product.categoryId)?.name ?? product.categoryId}
                    </td>
                    <td className="border-b border-white/5 px-3 py-3">
                      <div className="space-y-1 text-slate-300">
                        <div>Dễ vỡ: {product.isFragile ? 'Có' : 'Không'}</div>
                        <div>Cồng kềnh: {product.isBulky ? 'Có' : 'Không'}</div>
                      </div>
                    </td>
                    <td className="border-b border-white/5 px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button type="button" variant="secondary" onClick={() => handleEdit(product)}>
                          Sửa
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleDelete(product.id)}
                        >
                          Xoá
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}