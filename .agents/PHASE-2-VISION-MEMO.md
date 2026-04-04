# 🚀 PHASE 2 VISION: THE CODE-GEN CHASM

**Gửi AI Agent tiếp theo,**
Nếu bạn đang đọc file này, tức là bạn đang nhận nhiệm vụ tiếp quản Agentic OS do tôi (Agent tiền nhiệm) và Human Architect đã thiết kế.

**🛑 TÌNH TRẠNG HIỆN TẠI (SYSTEM STATE):**
- Foundation Base (00-21) đã hoàn chỉnh.
- Hệ thống Mẫu (04-os-templates) đã hoạt động.

**🎯 NHIỆM VỤ CỦA BẠN: CODE-GEN (SKILL 23+) VÀ QUY TẮC "FRAMEWORK-AGNOSTIC BOUNDARY"**
Khác với quy trình Knowledge Engine nằm hoàn toàn trong `.agents/`, quá trình Code-Gen đòi hỏi tính Phân Quyền (Decoupling) tuyệt đối giữa **Lõi Hệ Điều Hành** và **Dự Án**. Kỷ luật thép bạn phải tuân thủ:

### 1. Sự chia tách Trách Nhiệm (OS vs Project)
- **Agentic OS (`.agents/`) chỉ đóng vai trò Orchestrator (Điều phối).** Nó không được phép lưu trữ bất kỳ Template Code hay Script Parser nào của Typescript/NestJS/React bên trong lõi. Lõi hệ thống phải luôn "Mù chữ" về Framework.
- **Dự Án (`docs/05-support-assets/`) là Chủ thể của Technical Framework.** Tất cả logic về Mã vạch (Tracing), Đường dẫn Code (Routing Mapping), và Linter Script (Reflection) BẮT BUỘC phải lưu trữ và truy xuất từ thư mục của Dự Án (`docs/...`).

### 2. Thiết kế Cơ sở Vật chất (The 3 Components)
Để Coder Agent (Skill 23+) có thể sinh Code, bạn phải ép Hệ thống vận hành thông qua 3 tài sản được lắp đặt bằng **Skill 22 (Install Framework Plugin)** tại Dự án:
- **Bộ Vi Kiểm Soát (Code Mappings):** Đọc file cấu hình `framework-routing.yaml` trong `docs/` để biết đường dẫn đẻ Node/React Components thay vì bắt AI tự đoán `src/`.
- **Khuôn Đúc Mã Vạch (Tracing Templates):** Code Agent phải nhồi Logic đẻ Code vào các Template.tsx/Template.ts. Đảm bảo mọi file sinh ra ĐỀU CÓ mã JSDoc Docstring `@trace {feature-slug}` trên đầu.
- **Gương Phản Chiếu (Code Reflection Auditor):** Trước khi báo "Done", Coder Agent phải chạy file Script quét AST Parser gốc của Dự án (ví dụ `scripts/trace-scanner.js`) để xác minh Source Code đã chuẩn 100% so với Knowledge Base.

*Bạn không cần thiết kế lại cái này. Human Architect và Tôi đã chắt lọc sẵn 1 bộ "Băng Đạn" (Plugin) của React-NestJS lưu sẵn trong kho `.agents/04-os-templates/framework-plugins/`. Nếu Human chưa chạy **Skill 22**, hãy yêu cầu Human gọi `@[/22. Install Framework Plugin]` để đổ băng đạn này xuống `docs/05-...` trước khi bạn bắt đầu ngâm cứu tạo Code Coder!*

Hãy tóm tắt lại Memo này để chứng minh bạn đã sẵn sàng nối bước Phase 2!
