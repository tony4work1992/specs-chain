# Foundation 08: Design System & UI

> **SA Instructions:** Lock UI constraints to maintain visual consistency across all feature slices.

## 1. Core Token Mappings
| Token | Variable / Definition |
|-------|-----------------------|
| **Primary Color** | Tông xanh ngọc `--primary: #0F766E;` |
| **Secondary Color** | `--secondary: #E2E8F0;` |
| **Error / Success** | `--destructive: #EF4444; --success: #10B981;` |
| **Font - Heading** | Font `Inter`, weight `600/700` |
| **Font - Body** | Font `Roboto`, weight `400` |
| **Base Spacing** | `4px` (Tailwind multiplier) |

## 2. Global Viewport Constraints
- **Accessibility Minimum:** WCAG 2.1 AA Compliance. Form phải có Label cho Screen Reader.
- **Responsive Breakpoints:** 
  - Do chấm công, thiết kế ưu tiên **Mobile-First** (Giao diện thẻ Check-in tràn viền trên ĐT).
  - Mobile (Default): `< 640px`
  - Tablet (`sm`): `640px`
  - Desktop (`md`): `768px` (Màn hình Dashboard HR)
  - Widescreen (`lg`): `1024px`

## 3. Component & UI Handling
- **Core Component Library:** Sử dụng **Shadcn/UI** (dựa trên Radix Primitives), hoàn toàn không khóa vendor lock-in.
- **Form Handling Stricture:** 100% Data Entry phải chọc qua **React Hook Form** và Validate bằng Schema **Zod** trước khi cho gọi API HTTP.
- **Animation Lib:** CSS Transitions đơn giản của Tailwind. Frame Motion không cần thiết ở hệ thống hành chính nhân sự.
