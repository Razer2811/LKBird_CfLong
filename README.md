# 🐦 LK Bird - B2C Bird & Fish Store

Website B2C bán thức ăn, lồng, phụ kiện và sản phẩm chuyên dụng cho chim/cá, được phát triển bằng **Java Spring Boot** và **React**.

Dự án tập trung vào việc cho khách hàng xem sản phẩm, xem giá, xem các biến thể sản phẩm và liên hệ trực tiếp với shop thông qua các kênh mạng xã hội để mua hàng.

> **Scope:** B2C đơn giản
> **Không có:** Cart, Checkout, Payment, Order Management, B2B/Wholesale

## Cấu trúc

```text
LKBird/
├── backend/   # Java Spring Boot API
├── database/  # Schema SQL
├── frontend/  # React app
└── README.md
```

## Tech Stack

- Backend: Java 21 + Spring Boot
- Database: MySQL 8+
- Frontend: React + TypeScript + Vite

## Chạy dự án

1. Tạo database và import schema.
2. Cấu hình `backend/src/main/resources/application.properties`.
3. Chạy backend trong thư mục `backend`.
4. Chạy frontend trong thư mục `frontend` sau khi cài Node.js và `npm install`.
