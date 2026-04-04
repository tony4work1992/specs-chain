<!-- Knowledge Metadata
Feature-Code: AIPD-000002
Feature-Name: Sales Dashboard
Source-File: 002.Technical Requirement Workflow/System Context Information.md
Source-Version: 2026.04.03 16.24.10
Sections: System Architecture & Design Patterns
-->

# **System Context: Design Patterns (AIPD-000002)**

## **System Architecture & Design Patterns**

* **Architecture Style:** Monolithic API with decoupled React Client (Client-Server Architecture).
* **Core Design Patterns:** CQRS (Separating complex dashboard read queries from transaction write operations), Repository Pattern.
* **Communication Protocols:** REST API (JSON payloads).
* **Authentication & Authorization:** JWT validation via JWKS endpoint connected to the Internal Auth Microservice.
