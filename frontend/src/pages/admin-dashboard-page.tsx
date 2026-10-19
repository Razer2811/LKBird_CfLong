export function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <p className="mt-2 text-slate-300">
          Đây là điểm bắt đầu cho CRUD sản phẩm, danh mục, biến thể, user và role.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">Products CRUD</div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">Categories CRUD</div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">Users & Roles CRUD</div>
      </div>
    </div>
  );
}