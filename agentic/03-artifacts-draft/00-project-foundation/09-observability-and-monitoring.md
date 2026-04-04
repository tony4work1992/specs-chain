# Foundation 09: Observability & Monitoring

> **SA Instructions:** Systematize how to detect failures.

## 1. Log Formatting Standard
- **Format:** JSON structure bắt buộc cho tất cả mọi logger (`pino`), để Datadog dễ query.
- **Required Metadata Injection:**
  - `traceId`: Bắn vào Header xuyên qua Microservices.
  - `userId`: Đính kèm ID Nhân sự bấm Check-in (Nếu có).
  - `context`: Tên Service / Tên Method in đậm (Ví dụ: `[AttendanceController]`).

## 2. Telemetry & Metrics (APM)
- **Tracing Library Tooling:** Cài đặt `dd-trace` (Datadog Agent) thu thập Metric của Node/NestJS.
- **Aggregation Target:** Đẩy tập trung về Dashboard **Datadog** (Quản lý CPU, RAM, Response Time, Tỉ lệ Request Fail).
- **Endpoints to Monitor:** Viết 1 route `/health` trên mỗi Node Server chứa trạng thái kết nối DB và Redis. Datadog agent ping route này mỗi 5 giây.

## 3. Strict Rules for Data Sanitization (Masking)
- **PII Scrubbing in Logs:** Cơ chế Masking cắt bỏ và ẩn chữ trong Password hoặc Thông tin Lương thưởng (nếu có sau này).
- **URL Sanatization:** Dọn dẹp JWT lủng lẳng trong URI.

## 4. Alert Routing Matrix
| Severity | Trigger Condition | Notification Channel | Cường độ |
|----------|-------------------|----------------------|------------|
| **P1 (Fatal)** | Node Service bị Crash, Uptime Checker báo 5xx hoặc Server On-Prem sập. | **Email Khẩn cấp** cho Ban Giám đốc IT + PagerDuty gọi điện trực tiếp Dev. | YES |
| **P2 (Error)** | Hàng đợi RabbitMQ tắc nghẽn, Database CPU vượt 90%. | Email cảnh báo cho Team DevOps | NO |
| **P3 (Warn)** | 400 Bad Request tăng đột biến (Có thể do thiết bị chấm công lỗi thời gian). | Log Dashboard Datadog (Ghi nhận) | NO |
