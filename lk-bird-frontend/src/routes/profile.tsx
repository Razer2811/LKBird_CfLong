import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, ShieldCheck, User } from "lucide-react";

import { authApi } from "@/api/auth";
import { ErrorState } from "@/components/feedback/states";
import { RequireAuth } from "@/components/auth/require-auth";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getApiErrorMessage } from "@/lib/api-error";
import { useAuth } from "@/stores/auth-store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Hồ sơ của tôi — LK Bird" },
      { name: "description", content: "Xem thông tin tài khoản LK Bird của bạn." },
      { property: "og:title", content: "Hồ sơ của tôi — LK Bird" },
      { property: "og:description", content: "Thông tin tài khoản LK Bird." },
    ],
  }),
  component: () => (
    <RequireAuth>
      <ProfilePage />
    </RequireAuth>
  ),
});

function ProfilePage() {
  const { username, role } = useAuth();
  const meQuery = useQuery({ queryKey: ["current-user"], queryFn: authApi.me });

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-12 lg:px-8">
      <PageHeader
        eyebrow="Tài khoản"
        title="Hồ sơ của tôi"
        description="Thông tin tài khoản bạn đang dùng tại LK Bird."
      />

      {meQuery.isPending ? <Skeleton className="h-40 w-full rounded-3xl" /> : null}

      {meQuery.isError ? (
        <div className="space-y-4">
          <ErrorState
            message={getApiErrorMessage(meQuery.error, "Không tải được thông tin tài khoản.")}
          />
          <Card className="rounded-3xl border-border/70 p-6 shadow-card">
            <p className="text-sm text-muted-foreground">Thông tin lưu trên máy bạn:</p>
            <p className="mt-2 font-semibold">{username ?? "—"}</p>
            <p className="text-sm text-muted-foreground">Quyền: {role ?? "—"}</p>
          </Card>
        </div>
      ) : null}

      {meQuery.isSuccess ? (
        <Card className="space-y-4 rounded-3xl border-border/70 p-6 shadow-card">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-leaf-soft text-primary">
              <User className="size-5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Tên đăng nhập</p>
              <p className="font-semibold">{meQuery.data.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-clay">
              <Mail className="size-5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
              <p className="font-semibold">{meQuery.data.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Quyền</p>
              <p className="font-semibold">{role ?? `Nhóm #${meQuery.data.roleId}`}</p>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
