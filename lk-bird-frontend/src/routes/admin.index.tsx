import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { FolderTree, PackageSearch, Shield, Users } from "lucide-react";

import { adminApi } from "@/api/admin";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const products = useQuery({ queryKey: ["admin-products"], queryFn: adminApi.getProducts });
  const categories = useQuery({ queryKey: ["admin-categories"], queryFn: adminApi.getCategories });
  const users = useQuery({ queryKey: ["admin-users"], queryFn: adminApi.getUsers });
  const roles = useQuery({ queryKey: ["admin-roles"], queryFn: adminApi.getRoles });

  const stats = [
    { label: "Sản phẩm", value: products.data?.length, loading: products.isLoading, icon: PackageSearch, to: "/admin/products" as const },
    { label: "Danh mục", value: categories.data?.length, loading: categories.isLoading, icon: FolderTree, to: "/admin/categories" as const },
    { label: "Người dùng", value: users.data?.length, loading: users.isLoading, icon: Users, to: "/admin/users" as const },
    { label: "Vai trò", value: roles.data?.length, loading: roles.isLoading, icon: Shield, to: "/admin/roles" as const },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Quản trị"
        title="Tổng quan cửa hàng"
        description="Theo dõi nhanh số lượng sản phẩm, danh mục, người dùng và vai trò trong hệ thống LK Bird."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.to} className="group">
            <Card className="h-full transition-shadow group-hover:shadow-card">
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <span className="flex size-9 items-center justify-center rounded-2xl bg-leaf-soft text-primary">
                  <stat.icon className="size-4" />
                </span>
              </CardHeader>
              <CardContent>
                {stat.loading ? (
                  <Skeleton className="h-9 w-16" />
                ) : (
                  <p className="font-display text-3xl font-semibold">{stat.value ?? "—"}</p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sản phẩm mới nhất</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {products.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-6 w-full" />
              ))}
            </div>
          ) : products.data && products.data.length > 0 ? (
            <ul className="divide-y divide-border/70 text-sm">
              {products.data.slice(-6).reverse().map((product) => (
                <li key={product.id} className="flex items-center justify-between gap-3 py-2">
                  <span className="font-medium">{product.name}</span>
                  <span className="text-muted-foreground">{product.brand ?? "Không rõ thương hiệu"}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Chưa có sản phẩm nào.</p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
