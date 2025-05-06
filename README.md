# CASE STUDY 1 — Phiên bản cải tiến

Đây là phiên bản cải tiến của chương trình rút gọn link sử dụng Express.js, được tối ưu hóa để hiệu năng cao hơn, ổn định hơn và sẵn sàng triển khai thực tế.

Chương trình hỗ trợ 3 endpoint chính:
- `GET /short/:id`: tự động chuyển hướng đến URL gốc từ mã rút gọn.
- `POST /create`: tạo mã rút gọn mới từ URL đầu vào (truyền qua query hoặc body).
- `GET /health`: kiểm tra tình trạng kết nối đến cơ sở dữ liệu và Redis.

Về mặt kiến trúc, chương trình được thiết kế lại theo mô hình MVC kết hợp Repository pattern. Một số cải tiến nổi bật gồm:
- Sử dụng Cluster để tận dụng đa nhân CPU, giúp server xử lý song song hiệu quả hơn.
- Tích hợp Redis làm bộ nhớ đệm giúp giảm tải cho database và tăng tốc độ phản hồi.
- Sử dụng ORM Sequelize để quản lý dữ liệu theo mô hình đối tượng, dễ mở rộng và bảo trì.
- Triển khai các middleware bảo mật như `helmet`, `rate-limit` và kiểm tra URL đầu vào bằng validator.
- Giao diện người dùng đơn giản phục vụ frontend tĩnh nằm trong thư mục `public/index.html`.
- Áp dụng cơ chế sinh mã rút gọn ngắn gọn, duy nhất bằng cách kết hợp timestamp và Redis counter, mã hóa bằng Base62.
- Xử lý lỗi tập trung giúp phản hồi rõ ràng và dễ debug.


### Hướng dẫn chạy chương trình:

1. Cài đặt thư viện:
```bash
npm install
```

2. Tạo thư mục database nếu chưa có:
```bash
mkdir db
```

3. Khởi động Redis (cài Redis local hoặc dùng Docker).

4. Khởi chạy chương trình:
```bash
npm start
```
Mặc định server sẽ chạy tại `http://localhost:3000`.

Chương trình đã được kiểm thử hiệu năng bằng autocannon với 100 kết nối song song và pipelining 10. Nhờ sử dụng middleware warmupCache(), hệ thống đạt tỷ lệ cache hit cao với các URL được truy cập thường xuyên. ID được sinh ra nhanh chóng (< 1ms) và TTL của Redis được tự động điều chỉnh theo tần suất truy cập để tối ưu bộ nhớ.

### Danh sách các yêu cầu từ đề bài đã được hoàn thành:

| Mức độ | Mô tả yêu cầu                                               | Trạng thái |
|--------|-------------------------------------------------------------|------------|
| Easy   | Cài middleware bảo mật + URL validator                      | ✅ Đã xong |
| Easy   | Triển khai thành web hoàn chỉnh có frontend                 | ✅ Đã xong |
| Medium | Dùng ORM Sequelize thay cho SQLite raw query                | ✅ Đã xong |
| Medium | Đánh giá và cải tiến theo mẫu kiến trúc hiệu năng cao      | ✅ Đã xong |
| Hard   | Sử dụng Redis cache với warming + auto-ttl                  | ✅ Đã xong |
