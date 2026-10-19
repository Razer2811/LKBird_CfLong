import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi, type RoleAdmin } from '@/api/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { getApiErrorMessage } from '@/lib/api-error';

const schema = z.object({
  name: z.string().min(2, 'Tên vai trò phải có ít nhất 2 ký tự'),
});

type RoleFormValues = z.infer<typeof schema>;

const emptyValues: RoleFormValues = {
  name: '',
};

export function AdminRolesPage() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const rolesQuery = useQuery({
    queryKey: ['admin-roles'],
    queryFn: adminApi.getRoles,
  });

  const selectedRole = useMemo(
    () => rolesQuery.data?.find((role) => role.id === selectedId) ?? null,
    [rolesQuery.data, selectedId],
  );

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<RoleFormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (selectedRole) {
      reset({ name: selectedRole.name });
      return;
    }

    reset(emptyValues);
  }, [selectedRole, reset]);

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
  };

  const upsertMutation = useMutation({
    mutationFn: async (values: RoleFormValues) => {
      const payload = { name: values.name.trim() };

      if (selectedId) {
        return adminApi.updateRole(selectedId, payload);
      }

      return adminApi.createRole(payload);
    },
    onSuccess: async () => {
      setServerError(null);
      setSelectedId(null);
      reset(emptyValues);
      await refresh();
    },
    onError: (error) => {
      setServerError(getApiErrorMessage(error, 'Không lưu được vai trò.'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (roleId: number) => adminApi.deleteRole(roleId),
    onSuccess: async () => {
      await refresh();
    },
  });

  const onSubmit = async (values: RoleFormValues) => {
    setServerError(null);
    await upsertMutation.mutateAsync(values);
  };

  const handleEdit = (role: RoleAdmin) => {
    setSelectedId(role.id);
  };

  const handleDelete = async (roleId: number) => {
    if (!window.confirm('Bạn có chắc muốn xoá vai trò này không?')) {
      return;
    }

    await deleteMutation.mutateAsync(roleId);
    if (selectedId === roleId) {
      setSelectedId(null);
    }
  };

  const isEditing = selectedId !== null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Quản lý vai trò</h1>
        <p className="mt-2 text-slate-300">CRUD vai trò nối trực tiếp với /roles.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">{isEditing ? 'Cập nhật vai trò' : 'Tạo vai trò'}</h2>
              <p className="mt-1 text-sm text-slate-400">
                {isEditing ? `Đang chỉnh sửa #${selectedId}` : 'Tạo mới vai trò từ form này'}
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
              <label className="text-sm text-slate-200">Tên vai trò</label>
              <Input placeholder="ADMIN" {...register('name')} />
              {errors.name ? <p className="text-sm text-red-300">{errors.name.message}</p> : null}
            </div>

            {serverError ? <p className="text-sm text-red-300">{serverError}</p> : null}

            <Button className="w-full" type="submit" disabled={isSubmitting || upsertMutation.isPending}>
              {isSubmitting || upsertMutation.isPending
                ? 'Đang lưu...'
                : isEditing
                  ? 'Cập nhật vai trò'
                  : 'Tạo vai trò'}
            </Button>
          </form>
        </Card>

        <Card className="p-5">
          <h2 className="text-xl font-semibold">Danh sách vai trò</h2>
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
                {rolesQuery.data?.map((role) => (
                  <tr key={role.id} className="text-slate-200">
                    <td className="border-b border-white/5 px-3 py-3">{role.id}</td>
                    <td className="border-b border-white/5 px-3 py-3 font-medium">{role.name}</td>
                    <td className="border-b border-white/5 px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button type="button" variant="secondary" onClick={() => handleEdit(role)}>
                          Sửa
                        </Button>
                        <Button type="button" variant="ghost" onClick={() => handleDelete(role.id)}>
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