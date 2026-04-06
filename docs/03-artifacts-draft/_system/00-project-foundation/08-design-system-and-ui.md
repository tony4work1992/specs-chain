---
document_type: project-foundation
foundation_id: "08"
title: Design System & UI
version: "1.0.0"
status: draft
---

# Foundation 08: Design System & UI

## 1. Core Token Mappings
| Token | Variable | Value |
|-------|----------|-------|
| **Primary Color** | `--primary` | `#2563EB` (Blue 600 — trust, professionalism) |
| **Primary Foreground** | `--primary-foreground` | `#FFFFFF` |
| **Secondary Color** | `--secondary` | `#F1F5F9` (Slate 100) |
| **Accent** | `--accent` | `#0EA5E9` (Sky 500 — highlights, active states) |
| **Success** | `--success` | `#16A34A` (Green 600 — Closed Won, positive KPIs) |
| **Error / Destructive** | `--destructive` | `#DC2626` (Red 600 — Closed Lost, errors) |
| **Warning** | `--warning` | `#D97706` (Amber 600 — follow-up overdue) |
| **Background** | `--background` | `#F8FAFC` (Slate 50) |
| **Card Background** | `--card` | `#FFFFFF` |
| **Border** | `--border` | `#E2E8F0` (Slate 200) |
| **Font - Heading** | `--font-heading` | `Inter` (Google Fonts, loaded via `next/font`) |
| **Font - Body** | `--font-body` | `Inter` (same family, weight 400/500) |
| **Font - Mono** | `--font-mono` | `JetBrains Mono` (code blocks, IDs) |
| **Base Spacing Unit** | `--spacing` | `4px` (Tailwind default scale) |
| **Border Radius** | `--radius` | `0.5rem` (8px — slightly rounded, professional) |

## 2. Global Viewport Constraints
- **Accessibility Minimum:** WCAG 2.1 AA — enforced via `axe-core` in Playwright E2E tests. Color contrast ratio minimum 4.5:1.
- **Minimum Supported Screen:** 1280px wide desktop (internal tool — no mobile MVP requirement)
- **Responsive Breakpoints (Tailwind):**
  - Default (mobile base): `< 640px` — minimal graceful degradation only
  - `sm`: `640px`
  - `md`: `768px`
  - `lg`: `1024px` — primary design target
  - `xl`: `1280px` — default dashboard layout
  - `2xl`: `1536px`
- **Dark Mode:** Supported via Tailwind `darkMode: 'class'` — toggled via user preference saved in localStorage + `next-themes`

## 3. Component & UI Handling
- **Core Component Library:** Shadcn/ui (copy-paste, not a package dependency) built on Radix UI primitives
- **Form Handling Stricture:** ALL forms MUST use React Hook Form v7 wired to Zod v3 schema validation. No uncontrolled inputs. No direct `useState` for form fields.
- **Animation Library:** Framer Motion v11 for page transitions and Kanban drag-and-drop; Tailwind `transition` utilities for simple hover/focus states
- **Drag & Drop (Deal Pipeline Board):** `@dnd-kit/core` + `@dnd-kit/sortable` — accessible drag-and-drop for deal stage transitions
- **Date Handling:** `date-fns` v3 (tree-shakable) — NO `moment.js`, NO `dayjs` mixing
- **Icons:** `lucide-react` v0.378 — consistent icon set matching Shadcn defaults
- **Toast Notifications:** `sonner` v1 (Shadcn recommended)

## 4. Dashboard Layout Standards
- **Sidebar:** Fixed left sidebar (240px width), collapsible to icon-only (64px) — persisted in localStorage
- **Top Bar:** 64px height — breadcrumbs, global search, user avatar, notifications bell
- **Content Area:** `calc(100vh - 64px)` height, scrollable, `max-width: 1440px` centered with `px-6` padding
- **Data Table Pagination:** Maximum 25 rows per page default; user-selectable (10/25/50/100)
- **Loading States:** Skeleton loaders (Shadcn Skeleton) for all async data — NO spinner-only states
