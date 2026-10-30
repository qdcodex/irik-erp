# ERP Plan — Irik International Institute of Aviation

**Prepared:** August 4, 2026
**Status:** Draft for review
**Data:** All fresh/new — no legacy migration required
**Tech stack:** Next.js + MongoDB

## 1. Purpose

A single ERP system, built on Next.js and MongoDB, to run the institute's core operations: admissions, student records, attendance, timetabling, fees/payments, HR/payroll, finance, and asset/compliance tracking — all starting from a clean database.

## 2. Goals

- Centralize student, staff, and parent data across all departments.
- Give parents visibility into fees and real-time notifications on pending balances.
- Support fast, QR-code-based online fee payment.
- Automate attendance, timetabling, and payroll.
- Track aircraft, simulators, and equipment maintenance against regulatory requirements.
- Give management real-time dashboards and reports.

## 3. User Roles & Access Levels

Roles follow a tiered hierarchy so access can be assigned precisely rather than all-or-nothing. See Section 4.18 for the Roles & Permissions module that manages this dynamically (custom roles, granular permissions) rather than hardcoding it.

| Tier | Role                                      | Access                                                                            |
| ---- | ----------------------------------------- | --------------------------------------------------------------------------------- |
| 1    | Super Admin                               | Full system access — all modules, settings, role/user management, billing config  |
| 2    | Manager (Academic / Operations / Finance) | Full access within their department's modules; cannot change system-wide settings |
| 3    | Registrar/Admissions staff                | Admission applications, enrollment, student records                               |
| 3    | Instructors                               | Attendance, grading, timetable, flight/sim hour logging, LMS content, evaluations |
| 3    | Finance/Accounts staff                    | Billing, invoicing, payroll, budgets                                              |
| 3    | HR staff                                  | Staff records, leave, recruitment                                                 |
| 3    | Maintenance/Compliance officer            | Asset logs, maintenance schedules, regulatory filings                             |
| 3    | Security/Gate staff                       | Visitor log, entry/exit tracking                                                  |
| 4    | Students                                  | Self-service portal (fees, grades, timetable, e-learning, feedback)               |
| 4    | Parents/Guardians                         | Fee balance, QR payment, notifications for their child                            |
| 4    | Alumni                                    | Placement profile, job/referral updates                                           |

## 4. Core Modules

### 4.1 Admission Module

- Online inquiry/application form
- Document upload (ID, prior certificates, medical clearance)
- Entrance test/interview scheduling and results
- Seat allocation and admission confirmation
- Conversion from applicant to enrolled student record

### 4.2 Student Data Module (full profile)

- Personal details, contact info, photo
- Parent/guardian details and linked parent-portal account
- Academic history and current enrollment (course, batch, intake year)
- Emergency contact and medical information
- Documents repository (ID proof, certificates, medical, license progress)
- Flight/ground school hours and certification/license milestones
- Status tracking (active, on leave, graduated, dropped)

### 4.3 Attendance Module

- Daily/session-wise attendance (ground classes, flight training, simulator sessions)
- Biometric (fingerprint) or QR-code check-in/check-out for students and staff
- Instructor can also mark attendance manually per class/session
- Auto-calculated attendance percentage per student
- Low-attendance alerts to student, parent, and admin
- Attendance history and exportable reports

### 4.4 Timetable Module

- Class, flight, and simulator slot scheduling
- Instructor and resource (aircraft/simulator/classroom) allocation, conflict checks
- "Next/Upcoming timetable" view per student and instructor (today/this week)
- Schedule change notifications
- Calendar view (daily/weekly/monthly)

### 4.5 Fee & Payment Module

- Fee structure setup (course-wise, installment-wise)
- Invoice generation and pending balance tracking per student
- Online payment via QR code (UPI/payment gateway-generated dynamic QR per invoice)
- Payment history and auto-generated receipts
- Partial payment and due-date tracking
- Real-time balance sync visible to student and parent portals

### 4.6 Notification Module

- Parent notifications for: pending fee balance, payment due reminders, payment confirmation, low attendance, exam results, timetable changes, admission status
- Channels: in-app, SMS, WhatsApp, and/or email (configurable)
- Student and staff notifications for schedule changes, exam results, compliance alerts
- Notification log/history per user

### 4.7 HR & Payroll

- Staff and instructor records (qualifications, certifications, contracts)
- Payroll processing and payslips
- Leave and attendance management for staff
- Instructor scheduling and workload tracking
- Recruitment and onboarding tracking

### 4.8 Finance & Accounting

- General ledger, expenses, budgeting (institute-level, beyond student fees)
- Financial reporting (income, dues, department-wise budgets)
- Payroll integration with accounting

### 4.9 Assets & Compliance

- Aircraft and simulator inventory and utilization tracking
- Maintenance scheduling and logs (linked to flight hours)
- Regulatory compliance records (DGCA/FAA-equivalent documentation, audits, renewals)
- Equipment and facility asset register
- Alerts for upcoming maintenance, inspections, and license renewals

### 4.10 E-Learning / LMS

- Upload and organize study material (notes, manuals, videos) by course/module
- Online quizzes and practice tests with auto-grading
- Assignment submission and review
- Progress tracking per student, linked to Student Data module

### 4.11 ID Card Generation

- Auto-generate student and staff ID cards from profile data
- QR code on card linking to profile/attendance check-in
- Print-ready templates and reissue tracking

### 4.12 Feedback & Complaint System

- Students/parents submit feedback or complaints (facility, instructor, course, etc.)
- Ticket-style tracking with status (open, in progress, resolved)
- Routing to relevant department (admin/HR/maintenance)
- Resolution history and satisfaction rating

### 4.13 Alumni & Placement

- Alumni profile creation on graduation (auto-migrated from student record)
- Job placement and airline tie-up tracking
- Alumni directory and referral/networking updates
- Placement statistics feeding into analytics dashboard

### 4.14 Analytics / BI Dashboard

- Admissions trend charts (applications, conversions, intake over time)
- Revenue and fee-collection dashboards (collected vs. pending)
- Attendance trends by course/batch
- Fleet/simulator utilization and maintenance-cost charts
- Configurable, role-based views (management sees all; department heads see their area)

### 4.15 Instructor Performance Evaluation

- Student ratings/reviews of instructors per course
- Aggregated performance reports for HR/management
- Feeds into instructor scheduling and appraisal decisions

### 4.16 Document E-Signature

- Digital signing of admission forms, contracts, consent/medical forms
- Signature audit trail (who signed, when, IP/device)
- Signed-document storage linked to student/staff profile

### 4.17 Visitor & Gate Management

- Visitor entry/exit logging at campus and restricted areas (hangar, apron)
- Host/purpose tracking, ID capture
- Optional QR-based visitor pass tied to notification alerts for host

### 4.18 Roles & Permissions Module

- Predefined roles (Super Admin, Manager, Registrar, Instructor, Finance, HR, Maintenance, Security, Student, Parent, Alumni) out of the box
- Ability to create custom roles (e.g., "Flight Ops Manager") with a granular permission matrix
- Permission matrix per module: View / Create / Edit / Delete / Approve, assignable per role
- User-to-role assignment (single or multiple roles per user)
- Department-scoped managers (e.g., Finance Manager sees only Finance + read-only Reports)
- Full audit log of permission/role changes

### 4.19 Admin Settings Module

A dedicated Settings area for Super Admin/Managers to configure the system without code changes:

- **Institute Profile:** name, logo, address, contact info, branding colors (feeds the premium UI theme)
- **Academic Setup:** academic year/terms, course list, batch defaults, grading scale
- **User & Role Management:** invite/deactivate users, assign roles, reset passwords
- **Fee & Payment Settings:** fee structures, payment gateway keys, QR/UPI configuration, late-fee rules
- **Notification Settings:** enable/disable channels (SMS/WhatsApp/Email/Push), message templates, sender IDs, provider API keys
- **Integrations:** SMS/WhatsApp/email provider config, payment gateway config, cloud storage config
- **Security Settings:** password policy, session timeout, two-factor authentication toggle
- **Backup & Data Export:** manual/scheduled data export, backup status
- **Audit Log Viewer:** searchable log of key actions (who changed what, when)

## 5. Cross-Module Features

- Role-based dashboards and reporting
- Centralized notification engine (used by fees, attendance, timetable, compliance)
- Document storage (licenses, contracts, compliance certificates, student documents)
- Audit trail for critical records
- Student and parent self-service portals

## 6. Technical Architecture

**Frontend & Backend:** Next.js (App Router) — server-rendered pages for dashboards/portals, API routes/Route Handlers for backend logic. Configured as a PWA (installable, offline-capable shell) so students/parents/staff get an app-like mobile experience without a separate native codebase.

**Database:** MongoDB (Atlas recommended for managed hosting), with Mongoose (or a similar ODM) for schema modeling. Core collections:

- `students` (linked to `parents`, `admissions`)
- `parents`
- `staff`
- `admissions`
- `courses` / `batches`
- `timetable`
- `attendance`
- `fees` / `invoices`
- `payments`
- `notifications`
- `assets` / `maintenanceLogs`
- `payroll`
- `lmsContent` / `quizzes` / `submissions`
- `idCards`
- `feedback` / `tickets`
- `alumni` / `placements`
- `evaluations` (instructor ratings)
- `signedDocuments`
- `visitorLogs`

**Authentication & Access:** Role-based auth (e.g., NextAuth.js or custom JWT), separate login flows for staff, students, and parents.

**Payments:** Integration with a payment gateway that supports dynamic QR code generation (e.g., Razorpay, PayU, or UPI-based providers) tied to each invoice.

**Notifications:** Integration with SMS/WhatsApp gateway (e.g., Twilio, MSG91) and email service (e.g., SendGrid), triggered by backend events (invoice created, payment received, attendance marked, timetable updated).

**File Storage:** Cloud object storage (e.g., S3-compatible) for student documents, certificates, and receipts.

**Hosting:** Next.js app on Vercel (or Node-compatible host), MongoDB Atlas for the database.

## 7. Phased Roadmap

**Phase 1 — Foundation (Weeks 1–3)**

- Finalize data model (MongoDB collections/schemas) for students, parents, staff, courses
- Set up Next.js project structure, auth, and role-based access
- Roles & Permissions module (predefined + custom roles, permission matrix)
- Admin Settings page (institute profile, academic setup, user/role management)
- Admin panel skeleton

**Phase 2 — Admissions & Student Data (Weeks 4–6)**

- Admission module (application, document upload, seat allocation)
- Student full-profile module
- Parent account linking

**Phase 3 — Attendance & Timetable (Weeks 7–9)**

- Timetable module with scheduling and conflict checks
- Attendance marking and reporting
- "Next timetable" views for students/instructors

**Phase 4 — Fees, Payments & Notifications (Weeks 10–13)**

- Fee structure and invoicing
- QR-code online payment integration
- Pending balance tracking
- Notification engine (parent alerts for balance/payment/attendance/timetable)

**Phase 5 — HR, Finance & Compliance (Weeks 14–17)**

- HR/payroll module
- Institute-level accounting
- Assets & compliance tracking with maintenance alerts

**Phase 6 — Biometric Attendance, LMS & ID Cards (Weeks 18–20)**

- Biometric/QR check-in integration for attendance
- E-learning/LMS (content upload, quizzes, submissions)
- ID card generation with QR linking

**Phase 7 — Feedback, Alumni & Analytics (Weeks 21–23)**

- Feedback/complaint ticketing system
- Alumni & placement tracking
- Analytics/BI dashboard across all modules

**Phase 8 — Mobile, Evaluation, E-Signature & Gate (Weeks 24–26)**

- PWA/mobile app packaging
- Instructor performance evaluation
- Document e-signature
- Visitor & gate management

**Phase 9 — Integration, Testing & Rollout (Weeks 27–29)**

- Cross-module dashboards
- End-to-end testing (fee-to-notification flow, attendance-to-alert flow)
- User training and go-live

## 8. UI Wireframes (Key Screens)

Layouts below are structural (not visual design) — for early review of information hierarchy per role.

### 8.1 Admin Dashboard

```
--------------------------------------------------------
| Logo   Irik ERP        [Search]      [Notif] [Profile]|
--------------------------------------------------------
| Sidebar        |  Overview Cards                       |
| - Dashboard    |  [Students: 320] [Pending Fees: ₹4.2L]|
| - Admissions   |  [Attendance Today: 91%] [Assets: 12] |
| - Students     |----------------------------------------|
| - Timetable    |  Charts: Admissions trend | Revenue    |
| - Attendance   |  Fleet utilization | Fee collection    |
| - Fees         |----------------------------------------|
| - HR/Payroll   |  Recent Activity Feed                  |
| - Assets       |  - New admission: J. Rao               |
| - Analytics    |  - Payment received: ₹15,000           |
| - Settings     |  - Maintenance due: Sim-02              |
--------------------------------------------------------
```

### 8.2 Student Portal (Home)

```
--------------------------------------------------------
| Irik ERP   Hi, Student Name        [Notif] [Profile]  |
--------------------------------------------------------
| [Today's Timetable]     | [Attendance: 88%]           |
| 09:00 Ground School     | [Pending Fee: ₹12,000]      |
| 13:00 Simulator Slot B  |  -> View & Pay               |
--------------------------------------------------------
| Tabs: My Profile | Timetable | Attendance | Fees |     |
|       E-Learning | Exams/Grades | Feedback | ID Card   |
--------------------------------------------------------
```

### 8.3 Parent Portal — Fee Balance & QR Payment

```
--------------------------------------------------------
| Irik ERP   Parent of: Student Name      [Notif]       |
--------------------------------------------------------
|  Pending Balance:  ₹ 12,000   (Due: 15 Aug 2026)       |
|                                                          |
|   [ QR CODE IMAGE ]     Scan to pay via UPI             |
|                          or  [ Pay Online Button ]      |
|                                                          |
|  Payment History:                                       |
|   - 01 Jul 2026   ₹20,000   Paid   [Receipt]            |
|   - 01 Jun 2026   ₹20,000   Paid   [Receipt]            |
--------------------------------------------------------
| Notifications: Fee reminder, attendance alert, exam     |
| result, timetable change                                |
--------------------------------------------------------
```

### 8.4 Instructor Portal

```
--------------------------------------------------------
| Irik ERP   Hi, Instructor Name           [Notif]      |
--------------------------------------------------------
| Today's Classes/Sessions                                |
|  09:00 Batch A - Ground School   [Mark Attendance]      |
|  13:00 Batch C - Simulator       [Mark Attendance]      |
--------------------------------------------------------
| Tabs: Timetable | Attendance | Gradebook | Students |   |
|       My Evaluations | Upload LMS Content               |
--------------------------------------------------------
```

### 8.5 Admission Application Form

```
--------------------------------------------------------
| Step 1: Personal Details                                |
|  Name, DOB, Contact, Photo Upload                        |
--------------------------------------------------------
| Step 2: Guardian/Parent Details                          |
|  Name, Relationship, Contact, Linked Portal Account       |
--------------------------------------------------------
| Step 3: Course & Document Upload                         |
|  Course selection, ID proof, medical clearance, prior     |
|  certificates                                             |
--------------------------------------------------------
| Step 4: Entrance Test/Interview Slot Booking              |
--------------------------------------------------------
| Step 5: Review & Submit -> Status: Under Review            |
--------------------------------------------------------
```

### 8.6 Timetable View (Calendar)

```
--------------------------------------------------------
| [Day] [Week] [Month]        Filter: Batch / Instructor  |
--------------------------------------------------------
|        Mon        Tue        Wed        Thu             |
| 09:00  Ground Sch  Sim-A      Ground Sch  Sim-B          |
| 11:00  Flight Trg  --         Flight Trg  Ground Sch     |
| 13:00  --          Ground Sch  Sim-A       --             |
--------------------------------------------------------
| "Next Up" widget: Simulator Slot B — Today, 13:00        |
--------------------------------------------------------
```

### 8.7 Admin Settings Page

```
--------------------------------------------------------
| Settings                                                |
--------------------------------------------------------
| Tabs: Institute Profile | Academic Setup | Users &      |
|       Roles | Fees & Payments | Notifications |         |
|       Integrations | Security | Backup | Audit Log      |
--------------------------------------------------------
| [Users & Roles Tab]                                     |
|  + Invite User        Role Permission Matrix             |
|  ------------------------------------------------------  |
|  Name       Role            Status    Actions            |
|  A. Sharma  Manager(Finance) Active   [Edit] [Deactivate]|
|  R. Iyer    Instructor       Active   [Edit] [Deactivate]|
|  ------------------------------------------------------  |
|  [+ Create Custom Role]                                  |
|  Module        View  Create  Edit  Delete  Approve       |
|  Admissions     [x]   [x]    [x]    [ ]      [x]         |
|  Fees            [x]   [ ]    [ ]    [ ]      [ ]         |
--------------------------------------------------------
```

### 8.8 Mobile Responsiveness

All screens are built mobile-first and responsive (Next.js + CSS breakpoints), plus configured as a PWA so it can be installed like an app on phones — no separate native codebase needed.

- **Admin dashboard:** Sidebar collapses to a bottom/hamburger nav; cards and charts stack vertically.
- **Student/Parent/Instructor portals:** Single-column layout; today's timetable, pending fee balance, and QR payment button appear at the top for one-thumb access.
- **QR fee payment:** On mobile, tapping "Pay Online" can also deep-link directly into UPI apps (GPay/PhonePe/Paytm), not just show a scannable code.
- **Timetable:** Switches from week-grid to a scrollable day-by-day agenda list on small screens.
- **Notifications:** Push notifications supported via the PWA (in addition to SMS/WhatsApp/email) once installed on a phone.

### 8.9 Mobile Wireframes (Key Screens)

All app roles share the same shell on mobile: a compact top bar (logo + notification bell) and a fixed bottom tab bar (replacing the desktop sidebar), single-column stacked content in between.

**Student / Parent home (mobile)**

```
------------------------
| Irik ERP      [Bell] |
------------------------
| Hi, Student Name      |
------------------------
| Today                 |
| 09:00 Ground School   |
| 13:00 Simulator B     |
------------------------
| Attendance: 88%       |
------------------------
| Pending Fee: ₹12,000  |
| [ Pay Now ]           |
------------------------
| [Home][Timetable]     |
| [Fees][Learn][More]   |
------------------------
```

**Parent — Fee & QR payment (mobile)**

```
------------------------
| < Back   Fee Payment |
------------------------
| Pending Balance        |
|   ₹ 12,000             |
|   Due: 15 Aug 2026      |
------------------------
|   [ QR CODE IMAGE ]     |
|   Scan with any UPI app |
------------------------
| [ Pay with GPay ]       |
| [ Pay with PhonePe ]    |
| [ Pay with Paytm ]      |
------------------------
| Payment History         |
|  01 Jul  ₹20,000  Paid  |
|  01 Jun  ₹20,000  Paid  |
------------------------
```

**Admin dashboard (mobile)**

```
------------------------
| ☰  Irik ERP    [Bell] |
------------------------
| Students: 320          |
| Pending Fees: ₹4.2L     |
| Attendance Today: 91%   |
| Assets: 12              |
------------------------
| Revenue chart (swipe    |
| for more charts)        |
------------------------
| Recent Activity         |
|  New admission: J. Rao  |
|  Payment: ₹15,000       |
------------------------
| [Home][Students][Fees]  |
| [Assets][More]          |
------------------------
```

**Admission form (mobile — one step per screen)**

```
------------------------
| Step 2 of 5            |
| Guardian Details        |
------------------------
| Name        [_______]   |
| Relationship[_______]   |
| Phone       [_______]   |
------------------------
|            [ Next > ]   |
------------------------
```

**Settings (mobile — Manager/Admin)**

```
------------------------
| < Back    Settings     |
------------------------
| Institute Profile   >  |
| Academic Setup      >  |
| Users & Roles       >  |
| Fees & Payments     >  |
| Notifications       >  |
| Integrations        >  |
| Security             >  |
| Backup & Audit Log   >  |
------------------------
```

## 9. Premium UI Design Direction

The wireframes in Section 8 show layout only. Visual execution will target a premium, aviation-branded look and feel:

- **Design system:** Tailwind CSS + a polished component library (e.g., shadcn/ui) for consistent, high-quality components (buttons, cards, modals, tables) rather than default/generic styling.
- **Brand palette:** Aviation-inspired tones — deep navy/midnight blue, sky blue, and a gold/metallic accent for a premium, "airline-grade" feel; clean white/light-gray backgrounds for dashboards.
- **Typography:** A refined sans-serif pairing (e.g., a geometric display font for headings, a clean readable font for body/data-dense screens).
- **Motion & micro-interactions:** Subtle animations (Framer Motion) on page transitions, card hovers, notification pop-ins, and the QR payment confirmation — smooth, not flashy.
- **Iconography & imagery:** Custom/aviation-themed icon set (aircraft, radar, wings, control-tower motifs) instead of generic stock icons.
- **Dark mode:** Optional dark theme, useful for dashboards and instructor/ops views.
- **Data visualization:** Polished charts (Recharts/Chart.js styled to match the brand palette) for the analytics dashboard.
- **Consistency:** A shared design-token system (colors, spacing, radius, shadows) so every module — from the admission form to the parent QR-payment screen — feels like one cohesive premium product, not stitched-together modules.

This can be backed by an actual style guide/mockup pass (Figma) before development starts, so engineering builds against approved visuals rather than improvising.

## 10. Detailed Database Schema (MongoDB)

Field-level design for each collection. `ObjectId` fields marked `ref` are references to another collection (populated via Mongoose `.populate()`). All collections include standard `createdAt`/`updatedAt` timestamps (omitted below for brevity).

### 10.1 Access Control & Settings

**`roles`**

```
_id, name, tier: enum[super_admin, manager, staff, self_service],
department: enum[academic, operations, finance, hr, security, null],
isCustom: Boolean
```

**`permissions`**

```
_id, roleId (ref: roles), module: enum[admissions, students, timetable,
  attendance, fees, hr, assets, lms, feedback, alumni, analytics, settings, ...],
actions: { view: Boolean, create: Boolean, edit: Boolean, delete: Boolean, approve: Boolean }
```

**`users`**

```
_id, name, email, passwordHash, roleIds: [ref: roles],
linkedProfile: { type: enum[staff, student, parent, alumni], id },
status: enum[active, inactive], lastLogin, twoFactorEnabled
```

**`settings`**

```
_id, key: enum[institute_profile, academic_year, fee_defaults,
  notification_config, integrations, security_policy, branding],
value: Mixed, updatedBy (ref: users)
```

**`auditLogs`**

```
_id, userId (ref: users), action, targetModule, targetId,
before: Mixed, after: Mixed, timestamp
```

### 10.2 Core Identity

**`admissions`**

```
_id, applicantName, dob, contactPhone, contactEmail, photoUrl,
guardianName, guardianPhone, courseAppliedFor (ref: courses),
documents: [{ type, url }],
entranceTestDate, entranceTestScore, interviewNotes,
status: enum[submitted, under_review, test_scheduled, selected, rejected, admitted],
convertedStudentId (ref: students, nullable)
```

**`students`**

```
_id, name, dob, gender, photoUrl, contactPhone, contactEmail, address,
admissionId (ref: admissions),
parentIds: [ref: parents],
courseId (ref: courses), batchId (ref: batches), intakeYear,
enrollmentStatus: enum[active, on_leave, graduated, dropped],
emergencyContact: { name, phone, relation },
medicalInfo: { bloodGroup, conditions, notes },
flightHours: { ground: Number, simulator: Number, actual: Number },
certifications: [{ name, issuedDate, expiryDate, documentUrl }],
documents: [{ type, url, uploadedAt }],
idCardId (ref: idCards)
```

**`parents`**

```
_id, name, phone, email, passwordHash,
studentIds: [ref: students],
notificationPrefs: { sms: Boolean, whatsapp: Boolean, email: Boolean, push: Boolean }
```

**`staff`**

```
_id, name, role: enum[instructor, admin, hr, finance, maintenance, security],
qualifications: [{ title, institution, year }],
certifications: [{ name, issuedDate, expiryDate }],
contactPhone, contactEmail, dateOfJoining, employmentStatus,
idCardId (ref: idCards)
```

### 10.3 Academic

**`courses`**

```
_id, name, code, description, durationWeeks, feeStructureId (ref: fees)
```

**`batches`**

```
_id, courseId (ref: courses), name, startDate, endDate, instructorIds: [ref: staff]
```

**`timetable`**

```
_id, batchId (ref: batches), type: enum[ground_class, flight, simulator],
instructorId (ref: staff), resourceId (ref: assets, nullable — aircraft/sim/room),
startTime, endTime, status: enum[scheduled, completed, cancelled, rescheduled]
```

**`attendance`**

```
_id, studentId (ref: students), timetableId (ref: timetable),
date, status: enum[present, absent, late, excused],
method: enum[biometric, qr, manual], markedBy (ref: staff)
```

**`lmsContent`**

```
_id, courseId (ref: courses), title, type: enum[document, video, notes],
fileUrl, uploadedBy (ref: staff)
```

**`quizzes`**

```
_id, courseId (ref: courses), title, questions: [{ text, options, correctIndex }],
totalMarks, dueDate
```

**`submissions`**

```
_id, quizId (ref: quizzes), studentId (ref: students),
answers: [Number], score, submittedAt
```

**`evaluations`**

```
_id, instructorId (ref: staff), studentId (ref: students),
courseId (ref: courses), ratings: { teaching: Number, communication: Number, punctuality: Number },
comments, submittedAt
```

### 10.4 Finance

**`fees`** (fee structure)

```
_id, courseId (ref: courses), totalAmount,
installments: [{ label, amount, dueDate }]
```

**`invoices`**

```
_id, studentId (ref: students), feeId (ref: fees),
installmentLabel, amountDue, amountPaid, balance, dueDate,
status: enum[pending, partial, paid, overdue],
qrCodeUrl
```

**`payments`**

```
_id, invoiceId (ref: invoices), studentId (ref: students),
amount, method: enum[upi_qr, card, netbanking, cash],
gatewayTransactionId, paidAt, receiptUrl, paidBy (ref: parents, nullable)
```

**`payroll`**

```
_id, staffId (ref: staff), month, basicPay, deductions, netPay,
status: enum[pending, paid], paidAt
```

### 10.5 Operations

**`assets`**

```
_id, name, type: enum[aircraft, simulator, equipment],
registrationNumber, status: enum[active, maintenance, retired],
utilizationHours
```

**`maintenanceLogs`**

```
_id, assetId (ref: assets), description, performedBy,
scheduledDate, completedDate, nextDueDate, cost,
complianceDocUrl
```

**`idCards`**

```
_id, ownerType: enum[student, staff], ownerId,
cardNumber, qrPayload, issuedDate, status: enum[active, reissued, expired]
```

**`visitorLogs`**

```
_id, visitorName, phone, purpose, hostStaffId (ref: staff),
entryTime, exitTime, areaAccessed, idCaptureUrl
```

**`signedDocuments`**

```
_id, ownerType: enum[student, staff, parent], ownerId,
documentType: enum[admission_form, contract, consent, medical],
fileUrl, signedAt, signerIp, signerDevice
```

### 10.6 Engagement

**`notifications`**

```
_id, recipientType: enum[student, parent, staff],
recipientId, channel: enum[sms, whatsapp, email, push, in_app],
category: enum[fee_due, payment_confirmation, attendance, timetable, exam, admission],
message, status: enum[queued, sent, failed], sentAt
```

**`feedback`** (tickets)

```
_id, raisedBy (ref: students/parents), category: enum[facility, instructor, course, other],
description, department: enum[admin, hr, maintenance],
status: enum[open, in_progress, resolved], resolutionNotes, rating
```

**`alumni`**

```
_id, studentId (ref: students), graduationYear,
placement: { company, role, joinedDate }, referralOptIn: Boolean
```

## 11. Open Questions for Next Steps

- Expected number of students, staff, and aircraft/simulators (for sizing).
- Preferred payment gateway/QR provider (region-dependent — e.g., UPI-based for India).
- Preferred SMS/WhatsApp/email provider for notifications.
- Biometric hardware availability (fingerprint scanners) vs. QR-only check-in.
- Specific regulatory body and reporting formats to comply with.
- Budget and timeline constraints.
- Deployment preference: cloud-hosted (Vercel + MongoDB Atlas) vs. self-hosted.
