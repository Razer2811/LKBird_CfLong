import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Save, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { adminApi, type ProductAdmin, type ProductPayload } from "@/api/admin";
import { ErrorState } from "@/components/feedback/states";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import { getApiErrorMessage } from "@/lib/api-error";

export const Route = createFileRoute("/admin/products")({
  component: AdminProductsPage,
});

type FormState = {
  name: string;
  brand: string;
  description: string;
  imageUrl: string;
  petType: string;
  categoryId: string;
  isFragile: boolean;
  isBulky: boolean;
};

const emptyForm: FormState = {
  name: "",
  brand: "",
  description: "",
  imageUrl: "",
  petType: "",
  categoryId: "",
  isFragile: false,
  isBulky: false,
};

function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<ProductAdmin | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const products = useQuery({ queryKey: ["admin-products"], queryFn: adminApi.getProducts });
  const categories = useQuery({ queryKey: ["admin-categories"], queryFn: adminApi.getCategories });

  const categoryName = (categoryId: number) =>
    categories.data?.find((category) => category.id === categoryId)?.name ?? `#${categoryId}`;

  const reset = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    void queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const save = useMutation({
    mutationFn: (payload: ProductPayload) =>
      editing ? adminApi.updateProduct(editing.id, payload) : adminApi.createProduct(payload),
    onSuccess: () => {
      toast.success(editing ? "Đã cập nhật sản phẩm" : "Đã thêm sản phẩm");
      reset();
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Không lưu được sản phẩm")),
  });

  const remove = useMutation({
    mutationFn: (id: number) => adminApi.deleteProduct(id),
    onSuccess: () => {
      toast.success("Đã xoá sản phẩm");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Không xoá được sản phẩm")),
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name.trim() || !form.categoryId.trim()) {
      toast.error("Vui lòng nhập tên sản phẩm và chọn danh mục");
      return;
    }

    save.mutate({
      name: form.name.trim(),
      brand: form.brand.trim() || null,
      description: form.description.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      petType: form.petType.trim() || null,
      categoryId: Number(form.categoryId),
      isFragile: form.isFragile,
      isBulky: form.isBulky,
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="Quản trị"
        title="Sản phẩm"
        description="Thêm sản phẩm mới, cập nhật thông tin mô tả, ảnh và danh mục cho từng sản phẩm."
      />

      <Card>
        <CardHeader>
          <CardTitle>{editing ? `Sửa sản phẩm #${editing.id}` : "Thêm sản phẩm mới"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Tên sản phẩm</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Thương hiệu</Label>
              <Input
                id="brand"
                value={form.brand}
                onChange={(event) => setForm({ ...form, brand: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryId">Danh mục</Label>
              <select
                id="categoryId"
                value={form.categoryId}
                onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Chọn danh mục</option>
                {categories.data?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="petType">Dành cho</Label>
              <Input
                id="petType"
                value={form.petType}
                onChange={(event) => setForm({ ...form, petType: event.target.value })}
                placeholder="Chim, Cá…"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="imageUrl">Đường dẫn ảnh</Label>
              <Input
                id="imageUrl"
                value={form.imageUrl}
                onChange={(event) => setForm({ ...form, imageUrl: event.target.value })}
                placeholder="/images/thuc-an-chim.jpg"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                rows={4}
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              />
            </div>
            <div className="flex flex-wrap gap-6 md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Checkbox
                  checked={form.isFragile}
                  onCheckedChange={(checked) => setForm({ ...form, isFragile: checked === true })}
                />
                Hàng dễ vỡ
              </label>
              <label className="flex items-center gap-2 text-sm font-medium">
                <Checkbox
                  checked={form.isBulky}
                  onCheckedChange={(checked) => setForm({ ...form, isBulky: checked === true })}
                />
                Hàng kích thước lớn
              </label>
            </div>
            <div className="flex gap-2 md:col-span-2">
              <Button type="submit" className="rounded-full" disabled={save.isPending}>
                <Save className="size-4" />
                {editing ? "Lưu thay đổi" : "Thêm sản phẩm"}
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

      {products.isLoading ? (
        <Skeleton className="h-48 w-full rounded-3xl" />
      ) : products.isError ? (
        <ErrorState message={getApiErrorMessage(products.error, "Không tải được sản phẩm")} />
      ) : (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead>Thương hiệu</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead className="w-32 text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.data && products.data.length > 0 ? (
                  products.data.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {product.brand ?? "—"}
                      </TableCell>
                      <TableCell>{categoryName(product.categoryId)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            aria-label="Sửa"
                            onClick={() => {
                              setEditing(product);
                              setForm({
                                name: product.name,
                                brand: product.brand ?? "",
                                description: product.description ?? "",
                                imageUrl: product.imageUrl ?? "",
                                petType: product.petType ?? "",
                                categoryId: String(product.categoryId),
                                isFragile: product.isFragile,
                                isBulky: product.isBulky,
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
                              if (window.confirm(`Xoá sản phẩm "${product.name}"?`)) {
                                remove.mutate(product.id);
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
                      Chưa có sản phẩm nào.
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
