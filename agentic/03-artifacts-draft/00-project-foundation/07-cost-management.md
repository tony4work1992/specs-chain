# Foundation 07: Cost Management & Resource Ceilings

> **SA Instructions:** Often forgotten by juniors, explicit limits prevent infinite-scaling loops and unexpected cloud bills.

## 1. Financial Guardrails
Do hệ thống đặt tại On-Premise, các chi phí biến đổi chủ yếu nằm ở dịch vụ 3rd Party (Auth0, Datadog):
- **Datadog Limit:** Chặn ngưỡng truyền Logs quá đà (VD: Giới hạn 50GB log/tháng). Bỏ log Info/Debug trên Prod, chỉ đẩy Error log vào Datadog.
- **Auth0 MAU:** Giám sát Daily Active User để không vượt quá SLA gói cước.

## 2. Scalability Limits (Do NOT scale infinitely)
Để tránh Docker Compose ăn cạn tài nguyên CPU/RAM của Server vật lý gây sập máy.
| Resource | Minimum | Maximum Cap | Giới hạn Cứng Container |
|----------|---------|-------------|------------------|
| **Nginx Web** | 1 | 2 | Limit: 1CPU, 1GB RAM |
| **Attendance API** | 2 | 4 | Limit: 2CPU, 2GB RAM |
| **Reporting API** | 1 | 2 | Limit: 1CPU, 2GB RAM (Tính công nặng) |
| **PostgreSQL** | 1 | 1 | Max_conn: 300, Limit: 4CPU, 8GB RAM |

## 3. Lifecycle Policies
- **Log Retention:** Log trượt trên Datadog lưu 15 ngày để truy vết. Log thô ghi ra file nén ở Server On-premise lưu 3 tháng rối xoá thẳng.
- **Database Backup:** Tạo bản chụp Dump hàng đêm lúc 2:00 AM, đồng bộ ra thiết bị lưu trữ NAS nội bộ khác để chống mất mát do hỏng Server vật lý.
