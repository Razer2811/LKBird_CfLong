import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { authApi } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage } from "@/lib/api-error";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Đăng ký — Cà phê Long, thức ăn chim, cá cảnh" },
      { name: "description", content: "Tạo tài khoản Cà phê Long, thức ăn chim, cá cảnh để mua thức ăn và phụ kiện thú cảnh." },
      { property: "og:title", content: "Đăng ký — Cà phê Long, thức ăn chim, cá cảnh" },
      { property: "og:description", content: "Tạo tài khoản Cà phê Long, thức ăn chim, cá cảnh chỉ trong một phút." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (form.password.length < 6) {
      setError("Mật khẩu cần ít nhất 6 ký tự.");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }

    setSubmitting(true);

    try {
      await authApi.register({
        username: form.username,
        email: form.email,
        password: form.password,
      });
      toast.success("Tạo tài khoản thành công. Bạn đăng nhập nhé!");
      void navigate({ to: "/login", replace: true });
    } catch (caught) {
      setError(getApiErrorMessage(caught, "Không tạo được tài khoản. Bạn thử lại nhé."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
      <div className="space-y-2 text-center">
        <h1 className="font-display text-3xl font-semibold">Đăng ký</h1>
        <p className="text-sm text-muted-foreground">
          Tạo tài khoản để lưu thông tin và mua hàng nhanh hơn.
        </p>
      </div>

      <Card className="rounded-3xl border-border/70 p-6 shadow-card">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="username">Tên đăng nhập</Label>
            <Input id="username" value={form.username} onChange={update("username")} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={update("email")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={update("password")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Nhập lại mật khẩu</Label>
            <Input
              id="confirm"
              type="password"
              value={form.confirm}
              onChange={update("confirm")}
              required
            />
          </div>

          {error ? (
            <p className="rounded-2xl bg-destructive/10 px-4 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="w-full rounded-full" disabled={submitting}>
            {submitting ? "Đang tạo tài khoản…" : "Tạo tài khoản"}
          </Button>
        </form>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        Đã có tài khoản?{" "}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
