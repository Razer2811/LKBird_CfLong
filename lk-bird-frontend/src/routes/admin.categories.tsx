import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { adminApi, type CategoryAdmin } from "@/api/admin";
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

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategoriesPage,
});

function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<CategoryAdmin | null>(null);
  const [name, setName] = useState("");

  const categories = useQuery({ queryKey: ["admin-categories"], queryFn: adminApi.getCategories });

  const reset = () => {
    setEditing(null);
    setName("");
  };

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    void queryClient.invalidateQueries({ queryKey: ["categories"] });
  };

  const save = useMutation({
    mutationFn: (payload: { name: string }) =>
      editing ? adminApi.updateCategory(editing.id, payload) : adminApi.createCategory(payload),
    onSuccess: () => {
      toast.success(editing ? "Đã cập nhật danh mục" : "Đã thêm danh mục");
      reset();
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Không lưu được danh mục")),
  });

  const remove = useMutation({
    mutationFn: (id: number) => adminApi.deleteCategory(id),
    onSuccess: () => {
      toast.success("Đã xoá danh mục");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Không xoá được danh mục")),
  });

  return (
    <>
      <PageHeader
        eyebrow="Quản trị"
        title="Danh mục sản phẩm"
        description="Thêm, sửa hoặc xoá các danh mục dùng để phân loại sản phẩm."
      />

      <Card>
        <CardHeader>
          <CardTitle>{editing ? `Sửa danh mục #${editing.id}` : "Thêm danh mục mới"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              if (!name.trim()) {
                toast.error("Vui lòng nhập tên danh mục");
                return;
              }
              save.mutate({ name: name.trim() });
            }}
          >
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ví dụ: Thức ăn cho chim"
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

      {categories.isLoading ? (
        <Skeleton className="h-48 w-full rounded-3xl" />
      ) : categories.isError ? (
        <ErrorState message={getApiErrorMessage(categories.error, "Không tải được danh mục")} />
      ) : (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">ID</TableHead>
                  <TableHead>Tên danh mục</TableHead>
                  <TableHead className="w-40 text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.data && categories.data.length > 0 ? (
                  categories.data.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.id}</TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            aria-label="Sửa"
                            onClick={() => {
                              setEditing(category);
                              setName(category.name);
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
                              if (window.confirm(`Xoá danh mục "${category.name}"?`)) {
                                remove.mutate(category.id);
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
                      Chưa có danh mục nào.
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
