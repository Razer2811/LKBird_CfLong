import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/api/auth';
import { Card } from '@/components/ui/card';

export function ProfilePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['current-user'],
    queryFn: authApi.me,
  });

  return (
    <Card className="p-6">
      <h1 className="text-2xl font-semibold">Hồ sơ của tôi</h1>
      <p className="mt-2 text-sm text-slate-300">Dữ liệu lấy từ endpoint /users/me.</p>

      {isLoading ? <p className="mt-4 text-slate-300">Đang tải thông tin người dùng...</p> : null}
      {isError ? <p className="mt-4 text-red-300">Không tải được hồ sơ người dùng.</p> : null}

      {data ? (
        <dl className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-950/50 p-4">
            <dt className="text-sm text-slate-400">Username</dt>
            <dd className="mt-1 text-lg font-medium">{data.username}</dd>
          </div>
          <div className="rounded-2xl bg-slate-950/50 p-4">
            <dt className="text-sm text-slate-400">Email</dt>
            <dd className="mt-1 text-lg font-medium">{data.email}</dd>
          </div>
          <div className="rounded-2xl bg-slate-950/50 p-4">
            <dt className="text-sm text-slate-400">Role ID</dt>
            <dd className="mt-1 text-lg font-medium">{data.roleId}</dd>
          </div>
          <div className="rounded-2xl bg-slate-950/50 p-4">
            <dt className="text-sm text-slate-400">User ID</dt>
            <dd className="mt-1 text-lg font-medium">{data.id}</dd>
          </div>
        </dl>
      ) : null}
    </Card>
  );
}