import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="space-y-4 text-center">
      <h1 className="text-4xl font-semibold">404</h1>
      <p className="text-slate-300">Trang bạn tìm không tồn tại.</p>
      <Link to="/" className="inline-flex rounded-full bg-orange-500 px-5 py-3 font-medium text-white">
        Về trang chủ
      </Link>
    </div>
  );
}