# Cà phê Long - Thức ăn chim và cá cảnh

Website bán hàng B2C cho thức ăn, thuốc, lồng, phụ kiện chim và sản phẩm cá
cảnh. Dự án được xây dựng để khách hàng có thể xem sản phẩm, lọc theo danh
mục, tìm kiếm, xem chi tiết và liên hệ trực tiếp với cửa hàng.

Đây là một dự án học tập có kiến trúc tách frontend và backend:

- **Backend:** Java 21, Spring Boot 4.1, Spring Web, Spring Data JPA,
  Spring Security và JWT.
- **Frontend:** React 19, TypeScript, TanStack Start/Router, TanStack Query,
  Vite và Tailwind CSS.
- **Database:** MySQL 8 trở lên.
- **Giao tiếp:** frontend gọi backend thông qua HTTP REST API và JSON.

> **Phạm vi hiện tại:** catalog B2C, tài khoản, phân quyền quản trị, quản lý
> sản phẩm/danh mục và liên hệ cửa hàng.
>
> **Chưa triển khai:** giỏ hàng, checkout, thanh toán trực tuyến, vận chuyển,
> quản lý đơn hàng và bán sỉ B2B.

## Mục lục

1. [Tính năng](#tính-năng)
2. [Kiến trúc tổng thể](#kiến-trúc-tổng-thể)
3. [Cấu trúc thư mục](#cấu-trúc-thư-mục)
4. [Mô hình dữ liệu](#mô-hình-dữ-liệu)
5. [Luồng hoạt động chính](#luồng-hoạt-động-chính)
6. [Phân trang Offset-Based](#phân-trang-offset-based)
7. [REST API](#rest-api)
8. [Yêu cầu cài đặt](#yêu-cầu-cài-đặt)
9. [Cấu hình database và backend](#cấu-hình-database-và-backend)
10. [Chạy local trên Windows](#chạy-local-trên-windows)
11. [Chạy bằng IntelliJ IDEA và VS Code](#chạy-bằng-intellij-idea-và-vs-code)
12. [Tệp hình ảnh upload](#tệp-hình-ảnh-upload)
13. [Tài khoản và bảo mật](#tài-khoản-và-bảo-mật)
14. [Swagger và kiểm tra API](#swagger-và-kiểm-tra-api)
15. [Các lỗi thường gặp](#các-lỗi-thường-gặp)
16. [Định hướng phát triển](#định-hướng-phát-triển)

## Tính năng

### Phía khách hàng

- Xem trang chủ và slider hình ảnh tự động.
- Xem toàn bộ sản phẩm hoặc lọc theo danh mục.
- Tìm kiếm theo tên, thương hiệu hoặc loại vật nuôi.
- Phân trang sản phẩm phía server.
- Click vào cả ảnh hoặc thẻ sản phẩm để xem trang chi tiết.
- Xem mô tả, thương hiệu, giá, tồn kho và thông tin liên hệ.
- Đăng ký, đăng nhập, đăng xuất và xem hồ sơ cá nhân.
- Liên hệ qua Zalo, Facebook và Messenger bằng các nút nổi.

### Phía quản trị

- Quản lý sản phẩm.
- Quản lý danh mục.
- Quản lý biến thể sản phẩm.
- Quản lý người dùng và vai trò.
- Các API ghi dữ liệu được giới hạn cho tài khoản có role `ADMIN`.

## Kiến trúc tổng thể

```text
┌──────────────────────────────┐
│ Trình duyệt                  │
│ React + TypeScript           │
│ TanStack Router + Query      │
└──────────────┬───────────────┘
               │ HTTP/JSON
               │ Authorization: Bearer <JWT>
               ▼
┌──────────────────────────────┐
│ Spring Boot API :8080        │
│ Controller                    │
│   ↓                          │
│ Service                      │
│   ↓                          │
│ Repository / JPA             │
│ Security Filter + JWT        │
└──────────────┬───────────────┘
               │ JDBC
               ▼
┌──────────────────────────────┐
│ MySQL :3306                  │
│ botchim                      │
└──────────────────────────────┘

backend/uploads/ ──► GET /uploads/<tên-file>
```

### Nguyên tắc phân lớp backend

1. **Controller:** nhận request HTTP, kiểm tra tham số và trả response.
2. **DTO:** định nghĩa dữ liệu request/response, tránh để entity đi thẳng
   qua API.
3. **Service:** chứa nghiệp vụ, ví dụ tìm sản phẩm có lọc và phân trang.
4. **Repository:** truy cập MySQL thông qua Spring Data JPA và JPQL.
5. **Entity:** ánh xạ class Java với bảng trong database.
6. **Mapper:** chuyển đổi giữa entity và DTO.
7. **Security:** xác thực JWT và kiểm tra quyền `USER`/`ADMIN`.
8. **Exception handler:** chuyển lỗi nghiệp vụ thành HTTP response phù hợp.

### Nguyên tắc phía frontend

- `src/routes/`: các trang theo file-based routing của TanStack Router.
- `src/api/`: các hàm gọi API và các kiểu dữ liệu trả về.
- `src/lib/api-client.ts`: một nơi thống nhất để thêm base URL, JWT và xử lý
  lỗi HTTP.
- TanStack Query quản lý trạng thái loading, cache và error của API.
- `src/components/`: các component giao diện dùng lại.
- `src/stores/auth-store.ts`: lưu và khôi phục trạng thái đăng nhập.

## Cấu trúc thư mục

```text
LKBird/
├── README.md
├── SETUP_DATABASE.md
├── backend/
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── uploads/                  # ảnh sản phẩm, slider và logo
│   └── src/
│       ├── main/java/com/lkbird/
│       │   ├── config/           # Security, CORS, static uploads
│       │   ├── controller/       # REST endpoints
│       │   ├── dto/              # request/response DTO
│       │   ├── entity/           # Product, Category, User...
│       │   ├── exception/        # exception và global handler
│       │   ├── mapper/           # entity <-> DTO
│       │   ├── repository/       # JPA repositories
│       │   ├── security/         # JWT filter/service
│       │   ├── service/          # interface và implementation
│       │   └── BackendApplication.java
│       └── main/resources/
│           └── application.properties
├── database/                    # thư mục dành cho tài nguyên database
├── docs/
└── lk-bird-frontend/
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── api/
        ├── components/
        ├── hooks/
        ├── lib/
        ├── routes/
        ├── stores/
        └── styles.css
```

`node_modules/`, `target/` và `.output/` là thư mục sinh ra trong quá trình
chạy/build, không cần tự tạo hoặc commit vào Git.

## Mô hình dữ liệu

Các entity chính:

```text
Category 1 ─────────── N Product 1 ─────────── N ProductVariant

User N ─────────────── 1 Role
User 1 ─────────────── N RefreshToken
```

### `categories`

- `id`: khóa chính.
- `name`: tên danh mục.

### `products`

- `id`: khóa chính.
- `name`, `brand`, `description`.
- `image_url`: tên hoặc đường dẫn ảnh.
- `is_fragile`, `is_bulky`: thuộc tính vận chuyển.
- `pet_type`: đối tượng sử dụng, ví dụ chim hoặc cá.
- `category_id`: khóa ngoại tới `categories`.

### `product_variants`

Một sản phẩm có thể có nhiều quy cách bán:

- `sku`: mã biến thể, duy nhất.
- `variant_name`: tên quy cách.
- `price`, `stock`, `weight_gram`, `expiry_date`.
- `product_id`: khóa ngoại tới `products`.

### Khởi tạo bảng

Dự án đang dùng:

```properties
spring.jpa.hibernate.ddl-auto=update
```

Vì vậy Hibernate có thể tạo/cập nhật bảng từ entity khi backend khởi động.
Cách này thuận tiện cho học tập và chạy local; với môi trường thật nên dùng
migration có version như Flyway hoặc Liquibase và không dùng `update` tùy tiện.

## Luồng hoạt động chính

### Xem danh sách sản phẩm

1. Người dùng mở `/products`.
2. Route gọi `catalogApi.getProductsPage(...)`.
3. Frontend gửi `GET /products/paged`.
4. Controller nhận `keyword`, `categoryId`, `offset`, `limit`.
5. Service tạo `OffsetBasedPageRequest`.
6. Repository thực hiện truy vấn JPQL có điều kiện lọc và phân trang.
7. Backend trả các sản phẩm của trang hiện tại cùng metadata tổng số bản ghi.
8. TanStack Query cập nhật giao diện và các nút chuyển trang.

### Chọn danh mục

Khi click một danh mục, frontend tạo URL tương tự:

```text
/products?categoryId=2
```

TanStack Router đọc query parameter, sau đó request gửi `categoryId=2` tới
backend. Nhờ vậy việc tải lại trang hoặc dùng nút Back/Forward vẫn giữ được
danh mục đang chọn.

### Đăng nhập

1. Frontend gửi `POST /auth/login` với username và password.
2. Backend xác thực thông tin người dùng.
3. Backend trả access token và refresh token.
4. Frontend lưu token trong `localStorage`.
5. Những request cần đăng nhập gửi header:

```http
Authorization: Bearer <access-token>
```

6. `JwtAuthenticationFilter` đọc token, xác định người dùng và đặt
   authentication vào Security Context.

## Phân trang Offset-Based

Dự án sử dụng offset-based pagination thay vì tải toàn bộ sản phẩm.

```text
GET /products/paged?offset=0&limit=9
GET /products/paged?offset=9&limit=9
GET /products/paged?offset=18&limit=9
```

Trong đó:

- `offset`: bỏ qua bao nhiêu bản ghi từ đầu, bắt đầu từ `0`.
- `limit`: số bản ghi tối đa trong một lần trả về.
- Với trang số `page` bắt đầu từ `0` và kích thước trang `pageSize`:
  `offset = page * pageSize`.

Ví dụ trang thứ ba với `pageSize = 9` có:

```text
offset = 2 * 9 = 18
limit = 9
```

Repository dùng `Pageable` tùy chỉnh tại
`backend/src/main/java/com/lkbird/repository/OffsetBasedPageRequest.java`.
Kết quả có `items`, `totalElements`, `totalPages`, `offset`, `limit` và
`hasNext`.

### Ưu điểm và giới hạn

- Ưu điểm: dễ hiểu, phù hợp giao diện chuyển trang, chỉ tải lượng dữ liệu
  cần thiết.
- Giới hạn: offset rất lớn có thể chậm vì database phải bỏ qua nhiều dòng;
  dữ liệu thay đổi giữa các lần tải có thể làm bản ghi bị trùng hoặc bỏ sót.
- Với catalog hiện tại, cách này đáp ứng tốt yêu cầu học tập và quy mô vừa.

## REST API

Base URL local:

```text
http://localhost:8080
```

### Catalog công khai

| Method | Endpoint | Mục đích |
|---|---|---|
| `GET` | `/products` | Lấy toàn bộ sản phẩm |
| `GET` | `/products/paged?offset=0&limit=9` | Lấy sản phẩm phân trang |
| `GET` | `/products/{id}` | Lấy chi tiết sản phẩm |
| `GET` | `/products/search/name?name=...` | Tìm theo tên |
| `GET` | `/products/search/brand?brand=...` | Tìm theo thương hiệu |
| `GET` | `/categories` | Lấy danh sách danh mục |
| `GET` | `/categories/{id}` | Lấy một danh mục |
| `GET` | `/product-variants/product/{productId}` | Lấy biến thể sản phẩm |
| `GET` | `/uploads/{filename}` | Đọc ảnh trong thư mục uploads |

Tham số của endpoint phân trang:

| Tham số | Bắt buộc | Mặc định | Ý nghĩa |
|---|---:|---:|---|
| `offset` | Không | `0` | Số dòng bỏ qua, phải >= 0 |
| `limit` | Không | `12` | Số dòng trả về, từ 1 đến 100 |
| `keyword` | Không | rỗng | Tìm trong tên, brand, pet type |
| `categoryId` | Không | rỗng | Lọc theo danh mục |

Ví dụ:

```text
http://localhost:8080/products/paged?offset=0&limit=9&categoryId=2
```

### Xác thực

| Method | Endpoint | Mục đích |
|---|---|---|
| `POST` | `/auth/login` | Đăng nhập |
| `POST` | `/auth/refresh` | Làm mới token |
| `POST` | `/auth/logout` | Đăng xuất |
| `POST` | `/users/register` | Đăng ký |
| `GET` | `/users/me` | Lấy hồ sơ hiện tại |

### API quản trị

Tạo, sửa và xóa sản phẩm, danh mục, biến thể; quản lý user và role đều yêu
cầu JWT có role `ADMIN`. Không nên gọi các API này khi chưa đăng nhập đúng
quyền.

## Yêu cầu cài đặt

Trên Windows cần cài:

1. **JDK 21** và đặt `JAVA_HOME`.
2. **MySQL 8.0+**, đang chạy ở port `3306`.
3. **Node.js LTS** và npm.
4. Git (khuyến nghị).

Kiểm tra:

```powershell
java -version
$env:JAVA_HOME
mysql --version
node --version
npm --version
```

Backend đã có Maven Wrapper (`mvnw.cmd`), nên không bắt buộc phải cài Maven
toàn hệ thống.

## Cấu hình database và backend

### Tạo database

Mở MySQL:

```sql
CREATE DATABASE botchim
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

Nếu MySQL dùng username/password khác, tạo user hoặc dùng tài khoản hiện có
được cấp quyền trên database `botchim`.

### Cấu hình `application.properties`

Mở
`backend/src/main/resources/application.properties` và kiểm tra các giá trị:

```properties
server.port=8080
app.upload-dir=uploads

spring.datasource.url=jdbc:mysql://localhost:3306/botchim?useSSL=false&serverTimezone=Asia/Ho_Chi_Minh&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=<MAT_KHAU_MYSQL>

spring.jpa.hibernate.ddl-auto=update
jwt.secret=<CHUOI_BASE64_DU_DAI>
```

Không đưa mật khẩu MySQL, JWT secret hoặc token thật lên GitHub. Với máy cá
nhân có thể dùng file local; khi triển khai nên chuyển sang biến môi trường
hoặc secret manager.

`jwt.secret` của ứng dụng được giải mã từ Base64 và dùng để ký JWT. Secret
phải đủ dài và không nên thay đổi tùy ý khi đang có token còn hiệu lực.

## Chạy local trên Windows

Mở **hai cửa sổ PowerShell** tại thư mục repository.

### Cửa sổ 1: backend

```powershell
cd D:\LKBird\backend
.\mvnw.cmd clean spring-boot:run
```

Lần đầu Maven sẽ tải dependency, vì vậy có thể mất vài phút. Backend chạy
thành công khi log có thông báo tương tự:

```text
Started BackendApplication
```

Backend lúc này ở:

```text
http://localhost:8080
```

### Cửa sổ 2: frontend

```powershell
cd D:\LKBird\lk-bird-frontend
npm install
npm run dev
```

Frontend chạy ở:

```text
http://localhost:5173
```

Mở địa chỉ này trong trình duyệt. Giữ cửa sổ terminal để xem log; dừng
chương trình bằng `Ctrl + C`.

### Chạy lại sau lần cài đầu tiên

Thông thường chỉ cần:

```powershell
# PowerShell 1
cd D:\LKBird\backend
.\mvnw.cmd spring-boot:run

# PowerShell 2
cd D:\LKBird\lk-bird-frontend
npm run dev
```

### Build kiểm tra frontend

```powershell
cd D:\LKBird\lk-bird-frontend
npm run build
```

Có thể xem bản build bằng:

```powershell
npm run preview
```

## Chạy bằng IntelliJ IDEA và VS Code

### IntelliJ IDEA

1. Mở thư mục `D:\LKBird\backend`.
2. Chọn JDK 21 làm Project SDK.
3. Chạy class `BackendApplication.java`, hoặc dùng Maven goal
   `spring-boot:run`.
4. Kiểm tra `application.properties` trước khi chạy.

### VS Code

1. Mở thư mục `D:\LKBird`.
2. Mở terminal tích hợp và chạy backend/frontend như phần trên.
3. Có thể mở hai terminal bằng nút `+` để chạy đồng thời.

## Tệp hình ảnh upload

Backend phục vụ thư mục `backend/uploads` qua resource handler:

```text
backend/uploads/brand-logo.png
backend/uploads/slider-1.jpg
backend/uploads/slider-2.jpg
backend/uploads/slider-3.jpg
```

URL truy cập:

```text
http://localhost:8080/uploads/brand-logo.png
```

Frontend tự ghép URL ảnh dựa trên `VITE_API_URL`. Khi thêm ảnh mới:

1. Chép ảnh vào `backend/uploads`.
2. Lưu tên file phù hợp vào `image_url` nếu là ảnh sản phẩm.
3. Đảm bảo backend đang chạy.
4. Mở thử `http://localhost:8080/uploads/<ten-file>`.

Ảnh slider nên có cùng tỉ lệ, khuyến nghị 4:3 như `1600x1200` hoặc `1200x900`,
định dạng JPG/WebP và dung lượng tối ưu cho web.

## Tài khoản và bảo mật

- Endpoint đọc catalog và ảnh là công khai.
- Endpoint đăng nhập/đăng ký được phép truy cập không cần JWT.
- Endpoint quản trị yêu cầu role `ADMIN`.
- Backend dùng session stateless, không lưu session đăng nhập trên server.
- CORS local cho phép `http://localhost:5173` và
  `http://127.0.0.1:5173`.
- Access token được frontend gửi trong header `Authorization`.
- Không hard-code password, access token hoặc refresh token vào source code.

Khi tạo tài khoản mới, role mặc định phụ thuộc vào logic service hiện tại.
Muốn cấp quyền quản trị cần kiểm tra dữ liệu bảng role/user trong database và
chỉ cấp `ADMIN` cho tài khoản tin cậy.

## Swagger và kiểm tra API

Backend có dependency Springdoc OpenAPI. Sau khi chạy backend, thử:

```text
http://localhost:8080/swagger-ui.html
http://localhost:8080/swagger-ui/index.html
http://localhost:8080/v3/api-docs
```

Nếu một URL không hoạt động do khác phiên bản Springdoc, dùng
`/v3/api-docs` để kiểm tra backend trước hoặc xem log khi khởi động.

Có thể kiểm tra nhanh endpoint công khai bằng PowerShell:

```powershell
Invoke-RestMethod http://localhost:8080/categories
Invoke-RestMethod "http://localhost:8080/products/paged?offset=0&limit=9"
```

## Các lỗi thường gặp

### 1. `UnsupportedClassVersionError`

Nguyên nhân thường là class cũ được build bằng JDK khác với JDK đang chạy.
Kiểm tra:

```powershell
java -version
cd D:\LKBird\backend
.\mvnw.cmd -version
```

Dự án dùng Java 21. Xóa output cũ và build lại:

```powershell
.\mvnw.cmd clean spring-boot:run
```

### 2. `Communications link failure` hoặc không kết nối được MySQL

- Đảm bảo MySQL service đang chạy.
- Kiểm tra port có phải `3306` không.
- Kiểm tra database `botchim` đã tồn tại.
- Kiểm tra username/password trong `application.properties`.
- Nếu dùng port khác, sửa URL JDBC.

### 3. Frontend báo `Failed to fetch`

- Kiểm tra backend đang chạy ở port `8080`.
- Mở thử endpoint trong trình duyệt.
- Kiểm tra `VITE_API_URL` nếu đã tự cấu hình.
- Kiểm tra frontend đang chạy đúng port `5173` để phù hợp CORS.

Có thể tạo file `.env.local` trong `lk-bird-frontend`:

```env
VITE_API_URL=http://localhost:8080
```

Sau khi đổi biến môi trường, phải khởi động lại Vite.

### 4. Ảnh không hiển thị

- Kiểm tra file thực sự nằm trong `backend/uploads`.
- Kiểm tra đúng chữ hoa/chữ thường và phần mở rộng.
- Mở trực tiếp URL `/uploads/<ten-file>`.
- Đảm bảo `app.upload-dir=uploads` và chạy backend từ thư mục `backend`.

### 5. Port đã được sử dụng

Tìm process trên Windows:

```powershell
netstat -ano | findstr :8080
netstat -ano | findstr :5173
```

Đóng ứng dụng đang chiếm port hoặc đổi `server.port` của backend. Frontend
được cấu hình mặc định với `strictPort=true`, vì vậy cần giải phóng port
`5173` hoặc sửa cấu hình Vite có chủ đích.

### 6. Maven hoặc npm tải dependency quá lâu

Lần chạy đầu cần tải thư viện. Kiểm tra kết nối mạng và thử lại. Không xóa
`pom.xml`, `package-lock.json`, `target` hoặc `node_modules` một cách không
cần thiết.

## Định hướng phát triển

Một số chức năng có thể bổ sung:

1. Dùng Flyway/Liquibase thay cho `ddl-auto=update`.
2. Thêm giỏ hàng, checkout và quản lý đơn hàng.
3. Tích hợp cổng thanh toán.
4. Dùng refresh token rotation và lưu token an toàn hơn.
5. Thêm test unit, integration test và test frontend.
6. Thêm upload ảnh qua API thay vì chép file thủ công.
7. Tối ưu truy vấn offset lớn hoặc chuyển sang cursor/keyset pagination.
8. Thêm logging, monitoring và xử lý lỗi tập trung khi deploy.
9. Đưa cấu hình bí mật vào biến môi trường.
10. Đóng gói backend bằng Docker và dùng CI/CD.

## Ghi chú dành cho sinh viên

Khi thuyết trình hoặc viết báo cáo, có thể trình bày dự án theo thứ tự:

1. Bài toán: xây dựng catalog bán sản phẩm chim/cá cảnh.
2. Kiến trúc: frontend - REST backend - database.
3. Thiết kế dữ liệu: Category, Product, ProductVariant, User, Role.
4. API: controller, DTO, service, repository.
5. Bảo mật: JWT, stateless session và phân quyền ADMIN.
6. Tối ưu trải nghiệm: tìm kiếm, lọc danh mục, pagination và cache query.
7. Cách triển khai local và kiểm thử endpoint.
8. Hạn chế hiện tại và kế hoạch phát triển.
