# LK Bird Frontend

Frontend cho LK Bird - B2C Bird & Fish Store được dựng bằng React + TypeScript + Vite, kết nối với backend Spring Boot hiện tại.

## Chạy dự án

1. Cài Node.js LTS.
2. Cài dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Tạo file `.env` từ `.env.example` nếu muốn đổi API URL.
4. Chạy dev server:
   ```bash
   npm run dev
   ```

## Cấu hình backend

Mặc định frontend gọi API tại `http://localhost:8080`.

Nếu backend chạy ở port khác, sửa `VITE_API_URL` trong `.env`.

## Những phần đã có

- Layout public và admin
- Routing
- API client cho auth và catalog
- Login / register / profile
- Trang product list, product detail, categories
- Route guard cho user và admin

## Scope

- B2C đơn giản
- Cho khách hàng xem sản phẩm, xem giá, xem biến thể sản phẩm
- Liên hệ shop qua các kênh mạng xã hội để mua hàng
- Không có cart, checkout, payment, order management, B2B/wholesale
