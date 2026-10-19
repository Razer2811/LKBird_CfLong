import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Save, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { adminApi, type UserAdmin, type UserPayload } from "@/api/admin";
import { ErrorState } from "@/components/feedback/states";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getApiErrorMessage } from "@/lib/api-error";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});

type FormState = { username: string; email: string; password: string; roleId: string };

const emptyForm: FormState = { username: "", email: "", password: "", roleId: "" };

function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<UserAdmin | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const users = useQuery({ queryKey: ["admin-users"], queryFn: adminApi.getUsers });
  const roles = useQuery({ queryKey: ["admin-roles"], queryFn: adminApi.getRoles });

  const roleName = (roleId: number) =>
    roles.data?.find((role) => role.id === roleId)?.name ?? `#${roleId}`;

  const reset = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  };

  const save = useMutation({
    mutationFn: (payload: UserPayload) =>
      editing ? adminApi.updateUser(editing.id, payload) : adminApi.createUser(payload),
    onSuccess: () => {
      toast.success(editing ? "Đã cập nhật người dùng" : "Đã thêm người dùng");
      reset();
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Không lưu được người dùng")),
  });

  const remove = useMutation({
    mutationFn: (id: number) => adminApi.deleteUser(id),
    onSuccess: () => {
      toast.success("Đã xoá người dùng");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Không xoá được người dùng")),
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.username.trim() || !form.email.trim() || !form.roleId.trim()) {
      toast.error("Vui lòng nhập tên đăng nhập, email và vai trò");
      return;
    }

    if (!editing && !form.password) {
      toast.error("Vui lòng nhập mật khẩu cho tài khoản mới");
      return;
    }

    save.mutate({
      username: form.username.trim(),
      email: form.email.trim(),
      roleId: Number(form.roleId),
      ...(form.password ? { password: form.password } : {}),
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="Quản trị"
        title="Người dùng"
        description="Tạo tài khoản mới, đổi email, gán vai trò hoặc xoá tài khoản khỏi hệ thống."
      />

      <Card>
        <CardHeader>
          <CardTitle>
            {editing ? `Sửa tài khoản ${editing.username}` : "Thêm người dùng mới"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input
                id="username"
                value={form.username}
                onChange={(event) => setForm({ ...form, username: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                Mật khẩu {editing ? "(để trống nếu không đổi)" : ""}
              </Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roleId">Vai trò</Label>
              <select
                id="roleId"
                value={form.roleId}
                onChange={(event) => setForm({ ...form, roleId: event.target.value })}
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Chọn vai trò</option>
                {roles.data?.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 md:col-span-2">
              <Button type="submit" className="rounded-full" disabled={save.isPending}>
                <Save className="size-4" />
                {editing ? "Lưu thay đổi" : "Thêm người dùng"}
              </Button>
              {editing ? (
                <Button type="button" variant="outline" className="rounded-full" onClick={reset}>
                  <X className="size-4" />
                  Huỷ
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      {users.isLoading ? (
        <Skeleton className="h-48 w-full rounded-3xl" />
      ) : users.isError ? (
        <ErrorState message={getApiErrorMessage(users.error, "Không tải được người dùng")} />
      ) : (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead>Tên đăng nhập</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead className="w-32 text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.data && users.data.length > 0 ? (
                  users.data.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>{roleName(user.roleId)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            aria-label="Sửa"
                            onClick={() => {
                              setEditing(user);
                              setForm({
                                username: user.username,
                                email: user.email,
                                password: "",
                                roleId: String(user.roleId),
                              });
                            }}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            aria-label="Xoá"
                            disabled={remove.isPending}
                            onClick={() => {
                              if (window.confirm(`Xoá tài khoản "${user.username}"?`)) {
                                remove.mutate(user.id);
                              }
                            }}
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Chưa có người dùng nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
}
