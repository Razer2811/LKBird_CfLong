import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { adminApi, type RoleAdmin } from "@/api/admin";
import { ErrorState } from "@/components/feedback/states";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

export const Route = createFileRoute("/admin/roles")({
  component: AdminRolesPage,
});

function AdminRolesPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<RoleAdmin | null>(null);
  const [name, setName] = useState("");

  const roles = useQuery({ queryKey: ["admin-roles"], queryFn: adminApi.getRoles });

  const reset = () => {
    setEditing(null);
    setName("");
  };

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
  };

  const save = useMutation({
    mutationFn: (payload: { name: string }) =>
      editing ? adminApi.updateRole(editing.id, payload) : adminApi.createRole(payload),
    onSuccess: () => {
      toast.success(editing ? "Đã cập nhật vai trò" : "Đã thêm vai trò");
      reset();
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Không lưu được vai trò")),
  });

  const remove = useMutation({
    mutationFn: (id: number) => adminApi.deleteRole(id),
    onSuccess: () => {
      toast.success("Đã xoá vai trò");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Không xoá được vai trò")),
  });

  return (
    <>
      <PageHeader
        eyebrow="Quản trị"
        title="Vai trò người dùng"
        description="Quản lý các vai trò được gán cho tài khoản, ví dụ ADMIN hoặc USER."
      />

      <Card>
        <CardHeader>
          <CardTitle>{editing ? `Sửa vai trò #${editing.id}` : "Thêm vai trò mới"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              if (!name.trim()) {
                toast.error("Vui lòng nhập tên vai trò");
                return;
              }
              save.mutate({ name: name.trim() });
            }}
          >
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ví dụ: ADMIN"
            />
            <div className="flex gap-2">
              <Button type="submit" className="rounded-full" disabled={save.isPending}>
                <Plus className="size-4" />
                {editing ? "Lưu" : "Thêm"}
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

      {roles.isLoading ? (
        <Skeleton className="h-48 w-full rounded-3xl" />
      ) : roles.isError ? (
        <ErrorState message={getApiErrorMessage(roles.error, "Không tải được vai trò")} />
      ) : (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">ID</TableHead>
                  <TableHead>Tên vai trò</TableHead>
                  <TableHead className="w-40 text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.data && roles.data.length > 0 ? (
                  roles.data.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>{role.id}</TableCell>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            aria-label="Sửa"
                            onClick={() => {
                              setEditing(role);
                              setName(role.name);
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
                              if (window.confirm(`Xoá vai trò "${role.name}"?`)) {
                                remove.mutate(role.id);
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
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      Chưa có vai trò nào.
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
