import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { authApi } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage } from "@/lib/api-error";
import { setSession, useAuth } from "@/stores/auth-store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Đăng nhập — LK Bird" },
      { name: "description", content: "Đăng nhập tài khoản LK Bird để theo dõi đơn và hồ sơ." },
      { property: "og:title", content: "Đăng nhập — LK Bird" },
      { property: "og:description", content: "Đăng nhập tài khoản LK Bird." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { ready, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ready && isAuthenticated) {
      void navigate({ to: "/", replace: true });
    }
  }, [ready, isAuthenticated, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const data = await authApi.login({ username, password });
      setSession({
        username: data.username,
        role: data.role,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken ?? null,
      });
      toast.success(`Chào ${data.username}, bạn đã đăng nhập.`);
      void navigate({ to: data.role === "ADMIN" ? "/admin" : "/", replace: true });
    } catch (caught) {
      setError(getApiErrorMessage(caught, "Đăng nhập không thành công. Bạn kiểm tra lại nhé."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
      <div className="space-y-2 text-center">
        <h1 className="font-display text-3xl font-semibold">Đăng nhập</h1>
        <p className="text-sm text-muted-foreground">
          Nhập tài khoản LK Bird của bạn để tiếp tục mua sắm.
        </p>
      </div>

      <Card className="rounded-3xl border-border/70 p-6 shadow-card">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="username">Tên đăng nhập</Label>
            <Input
              id="username"
              value={username}
              autoComplete="username"
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error ? (
            <p className="rounded-2xl bg-destructive/10 px-4 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="w-full rounded-full" disabled={submitting}>
            {submitting ? "Đang đăng nhập…" : "Đăng nhập"}
          </Button>
        </form>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        Chưa có tài khoản?{" "}
        <Link to="/register" className="font-semibold text-primary hover:underline">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
