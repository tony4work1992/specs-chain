<!-- Knowledge Metadata
Feature-Code: AIPD-000002
Feature-Name: Sales Dashboard
Source-File: 002.Technical Requirement Workflow/System Context Information.md
Source-Version: 2026.04.03 16.24.10
Sections: Core Technology Stack, Specific Feature Configurations
-->

# **System Context: Technology Stack (AIPD-000002)**

## **Core Technology Stack**

* **Frontend Framework:** React
* **Backend Framework:** NestJS (Node.js) to support modular API slices
* **Programming Languages:** TypeScript (Strict end-to-end type safety)
* **Mobile Environment:** Responsive Web (Mobile-first browser support, no native app for Phase 1)
* **UI/UX Core Libraries:** Material UI (MUI) for standardized components, Recharts for Temporal Time-Series graphing.

---

## **Specific Feature Configurations**

* **Date Management:** `date-fns` or `dayjs` on both Backend and Frontend for robust timezone manipulation and boundary calculation without excessive bundle size.
* **Charting Engine:** `recharts` for handling temporal distribution mapping natively in React.
