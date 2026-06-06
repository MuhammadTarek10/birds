# Memory Vault

## 1. Executive Summary

Memory Vault is a private, multi-tenant web application designed for partners and families to securely record, categorize, and recall shared memories. Unlike commercial social media or shared photo albums, this platform optimizes for absolute data ownership, zero-cost scaling (via Cloudflare R2 and Railway), and hyper-customization for the end user.

## 2. Goals & Objectives

- **Data Isolation:** Guarantee strict data separation between different families/couples via a "Pod" architecture.
- **Low Friction:** Ensure adding a memory (text + photos) takes less than 30 seconds.
- **Cost Efficiency:** Maintain near-zero operating costs by utilizing free-tier compute (Railway) and zero-egress object storage (Cloudflare R2).
- **Future-Proofing:** Establish a relational database foundation (PostgreSQL + Drizzle) that supports future advanced filtering, geolocations, and analytics.

## 3. Scope

**In Scope (Phase 1 - MVP):**

- User authentication (Email/Password or basic OAuth).
- Creation of Pods and generating invite links/adding users.
- CRUD operations for Memory Events (Date, Title, Description).
- Direct-to-R2 photo uploads via backend presigned URLs.
- Chronological timeline (Feed View).
- Calendar overview highlighting days with memories.
- Dynamic tagging system (many-to-many relationship).
- Optional text-based location tagging for Memory Events.
- Threaded commenting system on individual Memory Events.

**Out of Scope (Phase 1):**

- Video uploads (cost/complexity mitigation).
- Push notifications.
- Complex Role-Based Access Control (RBAC) beyond Admin/Member.
- Mobile application (web app must be responsive for mobile browsers instead).

## 4. Technical Stack

- **Frontend:** React, TanStack Router, TanStack Query, TailwindCSS (recommended for rapid UI).
- **Backend:** NestJS (REST API format).
- **Database:** PostgreSQL managed via Drizzle ORM.
- **Storage:** Cloudflare R2 (S3-compatible API).
- **Deployment:** Railway.
