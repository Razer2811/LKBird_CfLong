import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi, type UserAdmin } from '@/api/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { getApiErrorMessage } from '@/lib/api-error';

const schema = z.object({
  username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
  password: z.string().trim().optional(),
  email: z.string().email('Email không hợp lệ'),
  roleId: z.coerce.number().min(1, 'Vai trò không được để trống'),
});

type UserFormValues = z.infer<typeof schema>;

const emptyValues: UserFormValues = {
  username: '',
  password: '',
  email: '',
  roleId: 0,
};

export function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const usersQuery = useQuery({
    queryKey: ['admin-users'],
    queryFn: adminApi.getUsers,
  });

  const rolesQuery = useQuery({
    queryKey: ['admin-roles'],
    queryFn: adminApi.getRoles,
  });

  const selectedUser = useMemo(
    () => usersQuery.data?.find((user) => user.id === selectedId) ?? null,
    [selectedId, usersQuery.data],
  );

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (selectedUser) {
      setIsEditing(true);
      reset({
        username: selectedUser.username,
        password: '',
        email: selectedUser.email,
        roleId: selectedUser.roleId,
      });
      return;
    }

    setIsEditing(false);
    reset(emptyValues);
  }, [reset, selectedUser]);

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['admin-users'] });
  };

  const upsertMutation = useMutation({
    mutationFn: async (values: UserFormValues) => {
      const payload = {
        username: values.username.trim(),
        password: values.password?.trim() ? values.password.trim() : undefined,
        email: values.email.trim(),
        roleId: values.roleId,
      };

      if (selectedId) {
        return adminApi.updateUser(selectedId, payload);
      }

      return adminApi.createUser(payload);
    },
    onSuccess: async () => {
      setServerError(null);
      setSelectedId(null);
      reset(emptyValues);
      await refresh();
    },
    onError: (error) => {
      setServerError(getApiErrorMessage(error, 'Không lưu được người dùng.'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId: number) => adminApi.deleteUser(userId),
    onSuccess: async () => {
      await refresh();
    },
  });

  const onSubmit = async (values: UserFormValues) => {
    setServerError(null);

    if (!isEditing && !values.password?.trim()) {
      setServerError('Mật khẩu là bắt buộc khi tạo mới người dùng.');
      return;
    }

    if (values.password && values.password.trim().length > 0 && values.password.trim().length < 6) {
      setServerError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    await upsertMutation.mutateAsync(values);
  };

  const handleEdit = (user: UserAdmin) => {
    setSelectedId(user.id);
  };

  const handleDelete = async (userId: number) => {
    if (!window.confirm('Bạn có chắc muốn xoá người dùng này không?')) {
      return;
    }

    await deleteMutation.mutateAsync(userId);
    if (selectedId === userId) {
      setSelectedId(null);
    }
  };

  const hasSelectedUser = selectedId !== null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Quản lý người dùng</h1>
        <p className="mt-2 text-slate-300">CRUD người dùng nối trực tiếp với /users và /roles.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Card className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">{hasSelectedUser ? 'Cập nhật người dùng' : 'Tạo người dùng'}</h2>
              <p className="mt-1 text-sm text-slate-400">
                {hasSelectedUser
                  ? 'Mật khẩu có thể để trống; hệ thống sẽ giữ mật khẩu hiện tại.'
                  : 'Tạo mới người dùng từ form này'}
              </p>
            </div>
            {hasSelectedUser ? (
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
              <label className="text-sm text-slate-200">Tên đăng nhập</label>
              <Input placeholder="admin" {...register('username')} />
              {errors.username ? <p className="text-sm text-red-300">{errors.username.message}</p> : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-200">Email</label>
              <Input type="email" placeholder="admin@example.com" {...register('email')} />
              {errors.email ? <p className="text-sm text-red-300">{errors.email.message}</p> : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-200">Mật khẩu</label>
              <Input type="password" placeholder="••••••••" {...register('password')} />
              {errors.password ? <p className="text-sm text-red-300">{errors.password.message}</p> : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-200">Vai trò</label>
              <select
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-50 outline-none transition focus:border-orange-400/60 focus:ring-2 focus:ring-orange-400/20"
                {...register('roleId')}
              >
                <option value={0}>Chọn vai trò</option>
                {rolesQuery.data?.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
              {errors.roleId ? <p className="text-sm text-red-300">{errors.roleId.message}</p> : null}
            </div>

            {serverError ? <p className="text-sm text-red-300">{serverError}</p> : null}

            <Button className="w-full" type="submit" disabled={isSubmitting || upsertMutation.isPending}>
              {isSubmitting || upsertMutation.isPending
                ? 'Đang lưu...'
                : hasSelectedUser
                  ? 'Cập nhật người dùng'
                  : 'Tạo người dùng'}
            </Button>
          </form>
        </Card>

        <Card className="p-5">
          <h2 className="text-xl font-semibold">Danh sách người dùng</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="border-b border-white/10 px-3 py-3">#</th>
                  <th className="border-b border-white/10 px-3 py-3">Username</th>
                  <th className="border-b border-white/10 px-3 py-3">Email</th>
                  <th className="border-b border-white/10 px-3 py-3">Vai trò</th>
                  <th className="border-b border-white/10 px-3 py-3">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {usersQuery.data?.map((user) => (
                  <tr key={user.id} className="text-slate-200">
                    <td className="border-b border-white/5 px-3 py-3">{user.id}</td>
                    <td className="border-b border-white/5 px-3 py-3 font-medium">{user.username}</td>
                    <td className="border-b border-white/5 px-3 py-3">{user.email}</td>
                    <td className="border-b border-white/5 px-3 py-3">
                      {rolesQuery.data?.find((role) => role.id === user.roleId)?.name ?? user.roleId}
                    </td>
                    <td className="border-b border-white/5 px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button type="button" variant="secondary" onClick={() => handleEdit(user)}>
                          Sửa
                        </Button>
                        <Button type="button" variant="ghost" onClick={() => handleDelete(user.id)}>
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