# Foundation 02: Architecture Patterns

> **SA Instructions:** Lock the macro and micro architecture boundaries. This prevents AI from generating spaghetti inter-module dependencies.

## 1. Macro-Architecture (System Layout)
| System Type | Chosen Strategy | Justification |
|-------------|-----------------|---------------|
| **Deployment** | Microservices | Do lưu lượng chọc vào hệ thống cực lớn vào Cùng 1 Thời điểm (8:00 AM), cần tách module Điểm danh ra để Auto-Scale độc lập với phần Report/HR. |
| **Communication** | REST / RabbitMQ | REST cho Open APIs (Client-facing); Message Broker (RabbitMQ) cho luồng xử lý bất đồng bộ (VD: Check-in xong bắn sự kiện sang service Report). |

## 2. Bounded Contexts (DDD)
_List the core domains of the system._
1. **[Identity Context]:** Quản lý User (Nhân sự), Phân quyền (RBAC), Phiên đăng nhập, Phòng ban.
2. **[Attendance Engine Context]:** Nhận và xử lý Check-in/Check-out, validate IP/GPS/Timezone. (Scale mạnh nhất).
3. **[Leave Management Context]:** Quy trình duyệt đơn từ (Nghỉ phép, CT, OT).
4. **[Reporting Context]:** Tính công, tổng hợp dữ liệu, xuất file Excel, realtime Dashboard.

## 3. Micro-Architecture (Internal Pattern)
_Define the internal layout of a single microservice or monolith module._
- **Chosen Pattern:** Clean Architecture
- **Layering Stricture:** 
  - `Domain`: Enterprise business rules (Chứa các Object Model của Ca làm, Giờ công, không phụ thuộc Framework).
  - `Application`: Use cases (CheckInCommand, GetReportQuery).
  - `Infrastructure`: Kết nối CSDL Postgres, Redis cache, gRPC stub.
  - `Presentation`: HTTP REST Controllers.

## 4. Hard Anti-Patterns (Enforced by default)
> [!WARNING]
> The following actions are STRICTLY forbidden in this codebase:
- **Dependency Rule Violation:** Inner layers (Domain) importing Outer layers (Infrastructure). Không được nhúng thư viện `pg` hay `mongoose` vào Domain.
- **Leaking Domain Models:** Trả thẳng Database Entity ra JSON Response (Phải dùng DTO + ViewMapper).
- **Cross-Domain Database Access:** Service `Reporting` không được kết nối trực tiếp vào DB của `Identity`. Bắt buộc lấy data qua REST internal hoặc qua Event Bus.
