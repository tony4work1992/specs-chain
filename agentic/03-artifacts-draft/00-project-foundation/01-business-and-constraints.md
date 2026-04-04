# Foundation 01: Business & Constraints

> **SA Instructions:** Define measurable business boundaries. AI agents will use these constraints to make tradeoff decisions (e.g., favoring performance over feature richness if latency is prioritized).

## 1. Product Vision & Target Audience
| Attribute | Definition |
|-----------|------------|
| **Product Name** | AIPD Time & Attendance Monitor |
| **Primary Goal** | Cung cấp công cụ chấm công trực tuyến qua Web chống gian lận, realtime theo dõi vắng/trễ. |
| **Target Audience** | Internal (Nhân viên, Quản trị viên HR, Trưởng phòng) |
| **Scale Expectation** | 5,000 CCU (Concurrent Users) tại thời điểm check-in đầu giờ sáng |

## 2. Hard Non-Functional Requirements (SLAs)
_Provide exact numbers. Do not use "fast" or "secure"._
- **Uptime / Availability:** 99.9% (Dưới 8.7 giờ downtime/năm, ưu tiên up giờ hành chính)
- **Latency (P99):** < 300ms cho hành động Check-in/Check-out.
- **Throughput:** 2,000 Requests Per Second (RPS) lúc 8:00 AM đợt cao điểm.
- **Data Freshness:** Real-time (< 2s) đối với màn hình live dashboard của HR.

## 3. Compliance & Legal Framework
_Check all that apply and define the strict enforcement mechanism._
- [ ] **GDPR / CCPA:** [e.g., Requires 'Right to be Forgotten' hard deletes]
- [ ] **PCI-DSS:** [e.g., System must NEVER touch credit card PANs]
- [x] **Privacy Laws (Local):** Toạ độ GPS và IP cá nhân dùng cho chấm công phải được mã hóa và không chia sẻ cho bên thứ ba. Lịch sử vị trí chỉ lưu trong 3 tháng.
- **Data Residency:** Máy chủ lưu trữ CSDL phải đặt trong nước (On-premise hoặc Local Cloud Provider).

## 4. Rollout Strategy
- **Day 1 (MVP) Scope:** Web Check-in (IP/GPS validation), Giao diện duyệt đơn (Nghỉ phép/Làm thêm), Dashboard realtime cơ bản cho HR.
- **Day 100 (Post-MVP) Scope:** Cảnh báo gian lận bằng AI, Tích hợp thẳng vào Cổng thanh toán lương (Payroll System).
