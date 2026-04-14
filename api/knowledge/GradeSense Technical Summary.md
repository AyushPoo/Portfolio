
This document provides a unified overview of the GradeSense technical platform, synthesizing the core architecture, data models, AI pipelines, and integration strategies defined in the system documentation.

---

## 1. Platform Mission & Vision

GradeSense is an **AI-driven exam grading and analytics platform** designed to automate the evaluation of handwritten and printed answer sheets. Its primary goal is to eliminate manual grading bottlenecks for teachers while providing students with instant, high-quality feedback and performance insights.

---

## 2. Core Technology Stack

GradeSense uses a modern, high-performance stack optimized for heavy AI processing and real-time user interaction.

|Layer|Technology|
|---|---|
|**Backend**|**Python 3.11+ / FastAPI** (Async-first), Uvicorn|
|**Frontend**|**React 18**, Radix UI, Tailwind CSS, Framer Motion|
|**Primary Database**|**MongoDB** (via Motor async driver)|
|**File Storage**|**AWS S3** (Answer sheets/Question papers), **GridFS** (Binary blobs)|
|**AI Evaluation**|**Google Gemini** (Primary), OpenAI (via Instructor framework)|
|**OCR Engines**|**PaddleOCR** (Local), **Google Cloud Vision** & **AWS Textract** (Fallback)|
|**Auth & Security**|**Google OAuth 2.0**, JWT (HTTP-only cookies), bcrypt|

---

## 3. High-Level Architecture

The system follows a **decoupled, modular architecture** that ensures scalability and vendor-independence for AI services.

### Backend: Layered Design

The FastAPI backend uses a strict layered pattern where dependencies flow downward:

1. **Routes Layer (`app/routes/`)**: Handles HTTP requests, authentication guards, and response serialization.
2. **Services Layer (`app/services/`)**: Orchestrates business logic and AI pipelines.
3. **Adapters Layer (`app/adapters/`)**: Wraps external services (LLMs, OCR, S3) behind abstract interfaces to prevent vendor lock-in.
4. **Repository Layer (`app/repositories/`)**: Manages all MongoDB/GridFS data access.

### Frontend: Role-Based SPA

The React frontend is structured as a Single Page Application (SPA) with three distinct views gated by **Role-Based Access Control (RBAC)**:

- **Teacher Portal**: Exam management, blueprint creation, bulk grading, and class analytics.
- **Student Portal**: Exam submissions, result viewing, and re-evaluation requests.
- **Admin Portal**: User management, system health metrics, and global analytics.

---

## 4. The AI Core: Grading & Extraction

The "brain" of GradeSense consists of two sequential AI pipelines that transform raw PDF documents into structured academic data.

### A. The Blueprint Pipeline (Question Extraction)

Before grading begins, the system must understand the exam's structure:

1. **OCR Extraction**: Extracts text and spatial coordinates from the question paper.
2. **Anchor Detection**: Identifies question markers (e.g., "Q1", "2a", "iii").
3. **Span Building**: Determines where one question ends and another begins based on spatial anchors.
4. **Locking**: The blueprint is "locked" to create an immutable version for grading consistency.

### B. The Grading Pipeline (Student Evaluation)

Once an exam is locked, student papers are processed through a 7-stage pipeline:

1. **Ingestion**: Normalizes PDF pages into standardized images.
2. **OCR & Layout**: Extracts student handwriting and detects answer regions.
3. **Question Mapping**: Aligns extracted text to the pre-defined blueprint question IDs.
4. **LLM Evaluation**: Sends mapped text + model answer to **Gemini/OpenAI** for scoring.
5. **Normalization**: Clamps scores to `max_marks` and applies specialized policies (e.g., UPSC strict caps).
6. **Persistence**: Writes results to MongoDB and triggers class-wide analytics.

---

## 5. Data Architecture & Schema

GradeSense uses **MongoDB** with a "Document-First" design philosophy, prioritizing data integrity and lookup speed.

### Key Entities

- **Users**: Central identity holding roles (`teacher`, `student`, `admin`) and profile completion metadata.
- **Exams**: Stores exam configuration, embedded **Question Blueprints**, and status flags.
- **Submissions**: Represents a student's answer sheet, linked to a specific exam, containing per-question AI-generated scores and feedback.
- **Batches**: Groups students under a specific teacher for collective exam management.
- **Grading Jobs**: Manages the lifecycle of asynchronous background processing tasks.

### Design Decisions

- **Dual-ID Strategy**: Every document has a MongoDB `_id` for performance and a stable **UUID** for API/Frontend references.
- **Embedding**: Questions are embedded inside Exams for consistency; Grading Results are embedded inside Submissions for fast retrieval of results.

---

## 6. Access Control & Integration

- **Authentication**: Supports both modern **Google OAuth 2.0** and classic email/password fallback.
- **Session Management**: Uses **JWT** tokens stored in **HTTP-only, Secure cookies** to prevent XSS/CSRF vulnerabilities.
- **Role Gating**: Enforced at both the UI layer (React guards) and the API layer (FastAPI dependencies).
- **Analytics**: A separate aggregation engine computes class averages, topic mastery (identifying student strengths/weaknesses), and AI-generated performance recommendations.

---

## 7. Operational Lifecycle

1. **Setup**: Teacher creates a batch, adds students, and uploads a question paper.
2. **Blueprint**: AI extracts the exam structure; Teacher reviews and **Locks** the blueprint.
3. **Submission**: Students upload answer sheets (or Teacher bulk uploads).
4. **Grading**: Background workers trigger the AI pipeline; Job status is polled by the UI.
5. **Review**: Teacher reviews AI scores, applies manual overrides if needed, and publishes results.
6. **Insights**: Analytics engine computes trends, providing actionable feedback to both teachers and students.