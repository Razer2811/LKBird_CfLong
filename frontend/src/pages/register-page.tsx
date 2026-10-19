import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const schema = z.object({
  username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

type RegisterFormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      await authApi.register(values);
      setSuccessMessage('Đăng ký thành công. Bạn có thể đăng nhập ngay bây giờ.');
      navigate('/login');
    } catch {
      setServerError('Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
    }
  };

  return (
    <Card className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold">Đăng ký</h1>
      <p className="mt-2 text-sm text-slate-300">Nối với endpoint /users/register.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label className="text-sm text-slate-200">Tên đăng nhập</label>
          <Input placeholder="yourname" {...register('username')} />
          {errors.username ? <p className="text-sm text-red-300">{errors.username.message}</p> : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm text-slate-200">Email</label>
          <Input type="email" placeholder="you@example.com" {...register('email')} />
          {errors.email ? <p className="text-sm text-red-300">{errors.email.message}</p> : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm text-slate-200">Mật khẩu</label>
          <Input type="password" placeholder="••••••••" {...register('password')} />
          {errors.password ? <p className="text-sm text-red-300">{errors.password.message}</p> : null}
        </div>

        {serverError ? <p className="text-sm text-red-300">{serverError}</p> : null}
        {successMessage ? <p className="text-sm text-green-300">{successMessage}</p> : null}

        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Đang tạo tài khoản...' : 'Đăng ký'}
        </Button>
      </form>

      <p className="mt-4 text-sm text-slate-300">
        Đã có tài khoản?{' '}
        <Link to="/login" className="text-orange-300 underline underline-offset-4">
          Đăng nhập
        </Link>
      </p>
    </Card>
  );
}