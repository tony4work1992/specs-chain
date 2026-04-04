# Foundation 06: Networking & Security

> **SA Instructions:** Security is non-negotiable. Define cryptographic standards and network isolation perimeters.

## 1. Network Topology
- **VPC Subnets:** 
  - DMZ (Public): Chỉ duy nhất Nginx Reserve Proxy / API Gateway nhận traffic public.
  - Private Subnets: Toàn bộ Docker containers (Frontend SSR, Backend API) nằm mạng nội bộ, cấm kết nối trực tiếp.
  - Isolated Subnets: CSDL PostgreSQL và Redis hoàn toàn cách ly, chỉ backend mới gọi được vào.
- **Outer Perimeter:** Web Application Firewall (WAF) - Lọc traffic đầu vào, chặn DDoS/SQL Injection trước khi request chạm mốc mạng On-premise.

## 2. Authentication & JWT Strategy
- **Identity Provider (IdP):** Auth0 (Sử dụng 3rd Party chuẩn Enterprise để quản lý Danh tính thay vì tự code).
- **Protocol:** OAuth 2.0 Authorization Code Flow.
- **Token Security:**
  - Access Token: Ngắn hạn (15 phút), JWT lưu trong bộ nhớ máy khách.
  - Refresh Token: Chế độ cuốn chiếu (Rotation), lưu an toàn trong HTTP-Only Secure Cookie.

## 3. Data Protection (Cryptography)
- **Encryption At-Rest:** Mã hóa toàn bộ Disk lưu trữ của VPS (LUKS). Database Volume mount vào Host cũng được mã hóa.
- **Encryption In-Transit:** Bắt buộc giao tiếp HTTPS (TLS 1.3) ở vòng ngoài. Đi thông giữa các container có thể xài TCP trần hoặc HTTPS mTLS.
- **Secret Management:** Mật khẩu Database tuy Docker chạy On-Prem nhưng không lưu `.env` trần mà xài Hashicorp Vault hoặc Docker Secrets tiêm vào Runtime.

## 4. Request Throttling & CORS
- **Rate Limit Policy:** Redis chặn tối đa 60 requests / 1 IP / 1 phút bằng thuật toán Sliding Window.
- **CORS Allowed Origins:** Chỉ cho phép 2 DOMAIN production chính thức của CTY (e.g., `attendance.company.com`).
