import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth-store';

const schema = z.object({
  username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

type LoginFormValues = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);

    try {
      const response = await authApi.login(values);
      setSession({
        username: response.username,
        role: response.role,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
      navigate('/');
    } catch {
      setServerError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    }
  };

  return (
    <Card className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold">Đăng nhập</h1>
      <p className="mt-2 text-sm text-slate-300">Nối với endpoint /auth/login.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label className="text-sm text-slate-200">Tên đăng nhập</label>
          <Input placeholder="yourname" {...register('username')} />
          {errors.username ? <p className="text-sm text-red-300">{errors.username.message}</p> : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm text-slate-200">Mật khẩu</label>
          <Input type="password" placeholder="••••••••" {...register('password')} />
          {errors.password ? <p className="text-sm text-red-300">{errors.password.message}</p> : null}
        </div>

        {serverError ? <p className="text-sm text-red-300">{serverError}</p> : null}

        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>
      </form>

      <p className="mt-4 text-sm text-slate-300">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="text-orange-300 underline underline-offset-4">
          Đăng ký ngay
        </Link>
      </p>
    </Card>
  );
}