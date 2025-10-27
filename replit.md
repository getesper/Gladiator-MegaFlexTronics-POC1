# GLADIATOR MEGAFLEXTRONICS - Bodybuilding Form Analysis Application

## Overview
GLADIATOR MEGAFLEXTRONICS is an AI-powered bodybuilding pose analysis platform designed to evaluate competitor form through video uploads. The application analyzes bodybuilding poses against professional judging criteria (muscularity, symmetry, conditioning, posing, aesthetics), providing detailed scoring, recommendations, and frame-by-frame analysis. It is built as a full-stack web application with a focus on sports analysis and fitness tracking interfaces, aiming to offer professional-grade analysis similar to biomechanics platforms.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is a Single-Page Application (SPA) built with React 18 and TypeScript, using Vite for building. It leverages Radix UI primitives and shadcn/ui components with Tailwind CSS for styling, following a custom design system featuring Montserrat and Open Sans fonts. State management is handled by TanStack Query for server state and React hooks for local component state. The layout is a responsive two-column split (60-65% video, 35-40% analytics sidebar) for desktop, stacking on mobile, with a dark/light theme. UI components are designed for a scientific/clinical aesthetic, incorporating professional color palettes (deep navy, steel blue), technical typography (JetBrains Mono), advanced radial gauges, and precise video overlays.

### Backend Architecture
The backend is an Express.js server with TypeScript on Node.js, using ESM. It provides RESTful APIs for video upload, analysis creation, and AI vision/coaching feedback. The video processing pipeline uses presigned URLs for direct client-to-object storage uploads, reducing server load. A mock pose analysis engine is in place, designed for future integration with actual computer vision models like TensorFlow.js or MediaPipe, analyzing videos across 5 judging criteria and generating frame-by-frame scores and recommendations.

### Data Storage Solutions
The application uses PostgreSQL via Neon serverless, with Drizzle ORM for type-safe queries. A single `video_analyses` table stores all analysis data, utilizing JSONB columns for flexible, schema-less nested data such as measurements, pose scores, and recommendations. Google Cloud Storage is integrated for video file storage and delivery, using Replit-specific sidecar authentication for development.

### Key Architectural Decisions
The project adopts a monorepo structure with shared code, client, server, and database directories. It emphasizes end-to-end type safety using TypeScript, Zod schemas, and Drizzle ORM. The video upload process utilizes presigned URLs for direct client-to-storage uploads to optimize performance. A mock analysis engine is used as a placeholder for future computer vision integration, demonstrating the full data flow. Component organization follows atomic design principles, leveraging shadcn/ui patterns.

## External Dependencies

### Third-Party Services
- **Google Cloud Storage**: For video file storage and delivery.
- **Neon Database**: Serverless PostgreSQL hosting.
- **Replit sidecar services**: Development environment authentication for GCS.
- **OpenAI GPT-4o, Google Gemini 2.5, Anthropic Claude Sonnet 4**: AI models for vision analysis and coaching feedback.

### Client Libraries
- **Radix UI**: Accessible UI component primitives.
- **TanStack Query**: Server state management and caching.
- **Wouter**: Lightweight client-side routing.
- **React Hook Form (@hookform/resolvers)**: Form validation.
- **date-fns**: Date formatting utilities.
- **Lucide React**: Icon library.
- **MediaPipe**: Client-side skeletal keypoint detection.

### Development Tools
- **Vite**: Build tool and development server.
- **Drizzle Kit**: Database migration management.
- **esbuild**: Production server bundling.
- **tsx**: TypeScript execution for development.
- **Tailwind CSS**: Utility-first styling framework.

### Font Dependencies
- **Google Fonts**: Montserrat (headings) and Open Sans (body text), loaded via CDN.
- **JetBrains Mono**: For numerical data displays.