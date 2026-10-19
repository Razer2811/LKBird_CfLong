# 🗄️ HƯỚNG DẪN CHUẨN BỊ DATABASE

## ✅ Bước 1: Cài Đặt MySQL

### Windows:
1. Download MySQL từ: https://dev.mysql.com/downloads/mysql/
2. Chọn "Windows (x86, 64-bit) MSI Installer"
3. Cài đặt theo hướng dẫn
4. Nhớ port (mặc định: 3306) và root password

### Linux (Ubuntu):
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

### macOS (Homebrew):
```bash
brew install mysql
mysql.server start
```

---

## ✅ Bước 2: Tạo Database

Mở Terminal/Command Prompt và chạy:

```bash
# Kết nối vào MySQL
mysql -u root -p

# Nhập password khi được yêu cầu

# Chạy các lệnh SQL sau:
```

Sau đó copy-paste file [schema.sql](/d:/LaptopStore/database/schema.sql) để tạo database và tables.

---

## ✅ Bước 3: Cập Nhật application.properties

Nếu MySQL password khác, hãy cập nhật file:
[application.properties](/d:/LaptopStore/backend/src/main/resources/application.properties)

```properties
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD_HERE
```

---

## ✅ Bước 4: Chạy Application

```bash
cd d:\LaptopStore\backend
mvn spring-boot:run
```

Nếu thành công, bạn sẽ thấy:
```
2026-07-25 16:35:00 INFO 12345 --- [main] com.laptopstore.BackendApplication : 
Starting BackendApplication v0.0.1-SNAPSHOT using Java 21 on...
...
2026-07-25 16:35:05 INFO 12345 --- [main] com.laptopstore.BackendApplication : 
Started BackendApplication in 4.892 seconds
```

---

## 📝 Verify:

✅ Application chạy trên: `http://localhost:8080`
✅ Swagger API Docs: `http://localhost:8080/api/swagger-ui.html`
✅ Database connections: Check logs trong terminal

---

## ⚠️ Troubleshooting:

**Lỗi 1: "Connection refused"**
- Kiểm tra MySQL server có chạy không
- Kiểm tra port (mặc định 3306)
- Kiểm tra username/password

**Lỗi 2: "Database not found"**
- Chạy schema.sql để tạo database

**Lỗi 3: "Cannot find Java 21"**
- Cài đặt JDK 21: https://www.oracle.com/java/technologies/downloads/

---

Sau khi hoàn thành, báo cho tôi để tiếp tục! 🚀
