import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi, type CategoryAdmin } from '@/api/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { getApiErrorMessage } from '@/lib/api-error';

const schema = z.object({
  name: z.string().min(2, 'Tên danh mục phải có ít nhất 2 ký tự'),
});

type CategoryFormValues = z.infer<typeof schema>;

const emptyValues: CategoryFormValues = {
  name: '',
};

export function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const categoriesQuery = useQuery({
    queryKey: ['admin-categories'],
    queryFn: adminApi.getCategories,
  });

  const selectedCategory = useMemo(
    () => categoriesQuery.data?.find((category) => category.id === selectedId) ?? null,
    [categoriesQuery.data, selectedId],
  );

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CategoryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (selectedCategory) {
      reset({ name: selectedCategory.name });
      return;
    }

    reset(emptyValues);
  }, [selectedCategory, reset]);

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
  };

  const upsertMutation = useMutation({
    mutationFn: async (values: CategoryFormValues) => {
      const payload = { name: values.name.trim() };

      if (selectedId) {
        return adminApi.updateCategory(selectedId, payload);
      }

      return adminApi.createCategory(payload);
    },
    onSuccess: async () => {
      setServerError(null);
      setSelectedId(null);
      reset(emptyValues);
      await refresh();
    },
    onError: (error) => {
      setServerError(getApiErrorMessage(error, 'Không lưu được danh mục.'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (categoryId: number) => adminApi.deleteCategory(categoryId),
    onSuccess: async () => {
      await refresh();
    },
  });

  const onSubmit = async (values: CategoryFormValues) => {
    setServerError(null);
    await upsertMutation.mutateAsync(values);
  };

  const handleEdit = (category: CategoryAdmin) => {
    setSelectedId(category.id);
  };

  const handleDelete = async (categoryId: number) => {
    if (!window.confirm('Bạn có chắc muốn xoá danh mục này không?')) {
      return;
    }

    await deleteMutation.mutateAsync(categoryId);
    if (selectedId === categoryId) {
      setSelectedId(null);
    }
  };

  const isEditing = selectedId !== null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Quản lý danh mục</h1>
        <p className="mt-2 text-slate-300">CRUD danh mục nối trực tiếp với /categories.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">{isEditing ? 'Cập nhật danh mục' : 'Tạo danh mục'}</h2>
              <p className="mt-1 text-sm text-slate-400">
                {isEditing ? `Đang chỉnh sửa #${selectedId}` : 'Tạo mới danh mục từ form này'}
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
              <label className="text-sm text-slate-200">Tên danh mục</label>
              <Input placeholder="Laptop Gaming" {...register('name')} />
              {errors.name ? <p className="text-sm text-red-300">{errors.name.message}</p> : null}
            </div>

            {serverError ? <p className="text-sm text-red-300">{serverError}</p> : null}

            <Button className="w-full" type="submit" disabled={isSubmitting || upsertMutation.isPending}>
              {isSubmitting || upsertMutation.isPending
                ? 'Đang lưu...'
                : isEditing
                  ? 'Cập nhật danh mục'
                  : 'Tạo danh mục'}
            </Button>
          </form>
        </Card>

        <Card className="p-5">
          <h2 className="text-xl font-semibold">Danh sách danh mục</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="border-b border-white/10 px-3 py-3">#</th>
                  <th className="border-b border-white/10 px-3 py-3">Tên</th>
                  <th className="border-b border-white/10 px-3 py-3">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {categoriesQuery.data?.map((category) => (
                  <tr key={category.id} className="text-slate-200">
                    <td className="border-b border-white/5 px-3 py-3">{category.id}</td>
                    <td className="border-b border-white/5 px-3 py-3 font-medium">{category.name}</td>
                    <td className="border-b border-white/5 px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button type="button" variant="secondary" onClick={() => handleEdit(category)}>
                          Sửa
                        </Button>
                        <Button type="button" variant="ghost" onClick={() => handleDelete(category.id)}>
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