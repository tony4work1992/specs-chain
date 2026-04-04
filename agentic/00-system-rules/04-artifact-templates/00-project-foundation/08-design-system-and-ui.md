# Foundation 08: Design System & UI

> **SA Instructions:** Lock UI constraints to maintain visual consistency across all feature slices.

## 1. Core Token Mappings
| Token | Variable / Definition |
|-------|-----------------------|
| **Primary Color** | `[#Hex]` (e.g., `--primary-color`) |
| **Secondary Color** | `[#Hex]` |
| **Error / Success** | `[#Hex]` |
| **Font - Heading** | `[e.g., Inter]` |
| **Font - Body** | `[e.g., Roboto]` |
| **Base Spacing** | `[e.g., 4px]` |

## 2. Global Viewport Constraints
- **Accessibility Minimum:** [e.g., WCAG 2.1 AA Compliance enforced on build]
- **Responsive Breakpoints:** 
  - Mobile (Default): `< 640px`
  - Tablet (`sm`): `640px`
  - Desktop (`md`): `768px`
  - Widescreen (`lg`): `1024px`

## 3. Component & UI Handling
- **Core Component Library:** [e.g., Shadcn/ui utilizing Radix Primitives]
- **Form Handling Stricture:** [e.g., ALL forms must use React Hook Form wired to Zod validation]
- **Animation Lib:** [e.g., Framer Motion for complex mounts, Tailwind arbitrary animations for primitives]
