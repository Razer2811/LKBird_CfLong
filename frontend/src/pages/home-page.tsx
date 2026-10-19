import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
      <div className="space-y-6">
        <span className="inline-flex rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-2 text-sm text-orange-200">
          LK Bird B2C Bird & Fish Store
        </span>
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight lg:text-6xl">
          Website bán thức ăn, lồng, phụ kiện và sản phẩm chuyên dụng cho chim/cá.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-slate-300 lg:text-lg">
          Đây là frontend cho dự án B2C đơn giản, tập trung vào việc cho khách hàng xem sản phẩm,
          xem giá, xem biến thể sản phẩm và liên hệ trực tiếp với shop thông qua các kênh mạng xã hội.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/products"
            className="rounded-full bg-orange-500 px-6 py-3 font-medium text-white transition hover:bg-orange-400"
          >
            Xem sản phẩm
          </Link>
          <Link
            to="/login"
            className="rounded-full border border-white/15 px-6 py-3 font-medium text-slate-100 transition hover:bg-white/10"
          >
            Đăng nhập
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft">
        <div className="grid gap-4">
          <div className="rounded-2xl bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Giai đoạn 1</p>
            <p className="mt-2 text-lg font-medium">Catalog public + auth</p>
          </div>
          <div className="rounded-2xl bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Giai đoạn 2</p>
            <p className="mt-2 text-lg font-medium">Admin CRUD cho sản phẩm, danh mục, user, role</p>
          </div>
          <div className="rounded-2xl bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Giai đoạn 3</p>
            <p className="mt-2 text-lg font-medium">Không có cart, checkout, payment, order management</p>
          </div>
        </div>
      </div>
    </section>
  );
}