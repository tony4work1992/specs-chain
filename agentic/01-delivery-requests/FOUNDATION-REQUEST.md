# Request: Hệ thống Giám sát Chấm công (Time & Attendance Monitor)

## 1. Context & Goal
Thiết lập hệ thống chấm công trực tuyến qua Web/Mobile nhằm chống gian lận, theo dõi hiện trạng vắng mặt hoặc đi trễ theo thời gian thực (Real-time). Giải quyết triệt để vấn đề quá tải vào các thời gian check-in cao điểm định kỳ (đạt quy mô 5000 CCU lúc 8:00 AM sáng).

## 2. Actors
- **Nhân viên (Internal Staff):** Chủ thể thực hiện check-in/check-out qua thiết bị cá nhân (trang bị xác thực GPS/IP gốc).
- **Bộ phận Nhân sự (HR Admin):** Truy cập màn hình live dashboard để theo dõi sức khoẻ điểm danh và duyệt các đơn từ liên quan (Xin nghỉ, Làm thêm).
- **Trưởng phòng ban (Line Managers):** Quan sát và xử lý các điểm bất thường của thành viên trong phòng ban.

## 3. Expected Outcome
- Trực quan hóa dữ liệu quản trị sự vụ nhân sự theo dạng Real-time Dashboard.
- Triển khai thành công trên nền tảng On-Premise hoàn toàn độc lập với Cloud, bảo vệ tối đa dữ liệu Nhân sự (Compliance & Privacy Rule).
- Hệ thống chịu tải độc lập theo module (Microservices architecture), có tính năng cách ly hỏng hóc cục bộ.
