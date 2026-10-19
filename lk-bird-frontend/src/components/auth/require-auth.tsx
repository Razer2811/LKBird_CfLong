import { useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { useAuth } from "@/stores/auth-store";

export function RequireAuth({
  children,
  role,
}: {
  children: ReactNode;
  role?: "ADMIN";
}) {
  const navigate = useNavigate();
  const { ready, isAuthenticated, role: currentRole } = useAuth();

  const allowed = isAuthenticated && (!role || currentRole === role);

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      void navigate({ to: "/login", replace: true });
      return;
    }
    if (role && currentRole !== role) {
      void navigate({ to: "/", replace: true });
    }
  }, [ready, isAuthenticated, currentRole, role, navigate]);

  if (!ready || !allowed) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        Đang kiểm tra quyền truy cập…
      </div>
    );
  }

  return <>{children}</>;
}
