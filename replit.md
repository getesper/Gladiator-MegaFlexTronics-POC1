# GLADIATOR MEGAFLEXTRONICS - Bodybuilding Form Analysis Application

## Recent Changes (October 26, 2025)

**🎨 Professional UI/UX Overhaul - COMPLETE**
- **Radial Gauge Visualizations**: Redesigned DetailedMuscleAnalysis with SVG-based circular progress indicators for all 4 metrics (Development, Definition, Symmetry, Conditioning)
- **Collapsible Accordion Layout**: Each muscle group (13 total) now expands/collapses on click with chevron indicators and hover states
- **Contextual Feedback Chips**: Dynamic badges based on performance ("Well Developed", "Sharp Definition", "Balanced", "Stage Ready", "Priority Area")
- **Mobile Progress Visibility**: Fixed header progress indicator to display on all screen sizes (was hidden on mobile)
- **Score Labels**: Human-readable performance tiers (Excellent 90+, Strong 80+, Good 70+, Fair 60+, Needs Work <60)
- **Enhanced Visual Hierarchy**: Color-coded radial rings, AI feedback sections with left-border accents, improved spacing consistency
- **Typography**: Montserrat (headings) + Open Sans (body text) throughout application
- **Architect-Approved**: Meets professional sports analysis platform standards (Hudl-inspired design)

## Previous Updates (October 26, 2025)

**💪 Detailed Per-Muscle VLM Analysis**
- **Individual Muscle Scoring**: 13 muscle groups analyzed separately (pectorals, biceps, triceps, forearms, shoulders, abs, obliques, lats, traps, quads, hamstrings, glutes, calves)
- **4-Dimensional Scores**: Each muscle gets Development, Definition, Symmetry, and Conditioning scores (0-100)
- **Personalized Feedback**: AI-generated specific feedback for each muscle group with strengths and improvement areas
- **Tabbed UI**: Organized muscle groups into Upper Body, Arms, Core, and Lower Body tabs for easy navigation
- **Overall Assessment**: Comprehensive physique summary highlighting priority areas
- **Multi-Model Support**: Works with GPT-4o, Gemini 2.5 Pro, and Claude Sonnet 4
- **Database Storage**: Added `muscleAnalysis` JSONB field to persist detailed muscle data
- **Progress Tab Integration**: New "Detailed Muscle Analysis" card in Progress tab with model selector

## Previous Updates (October 26, 2025)

**🎯 Professional IFBB Pose Detection System (COMPLETE OVERHAUL)**
- **VLM-Powered Identification**: Vision Language Models (GPT-4o/Gemini 2.5 Pro/Claude Sonnet 4) analyze actual frame images to identify poses
- **8 Mandatory IFBB Poses**: Front Double Biceps, Front Lat Spread, Side Chest, Back Double Biceps, Back Lat Spread, Side Triceps, Abdominals & Thighs, Most Muscular
- **Professional Judging Criteria**: VLM evaluates based on IFBB standards (Muscularity, Symmetry, Conditioning, Presentation)
- **Research-Based Prompts**: Comprehensive pose descriptions sourced from official IFBB Pro League rules and 2024 judging guidelines
- **On-Demand Re-Identification**: "Re-Identify Poses with VLM" button in Progress tab triggers AI analysis of all detected poses
- **Architecture**: MediaPipe (client-side) captures skeletal keypoints + frame snapshots → VLM analyzes images → Database updated with accurate pose names + quality scores

**📍 Interactive Video Timeline**
- **Visual Pose Markers**: Clickable dots on timeline scrubber showing exact timestamps of detected poses
- **Hover Tooltips**: Display pose name, timestamp, and quality score on marker hover
- **Instant Seeking**: Click any marker to jump directly to that pose in the video
- **Proportional Positioning**: Markers positioned accurately across video duration

**🦴 Real-Time Skeleton Overlay**
- **MediaPipe Landmarks Visualization**: Green skeleton (dots + lines) drawn on video during playback
- **33 Body Keypoints**: Full body tracking including face, torso, arms, legs with joint connections
- **Toggle Control**: "Pose Overlay" button to show/hide skeleton visualization
- **Smart Display**: Overlay shows landmarks from closest detected pose (within 1 second of current playback time)
- **Performance Optimized**: Canvas rendering matches video dimensions, updates on timeupdate events

**Responsive Layout Fixes - Complete**
- Removed ALL hard-coded widths (lg:w-96 xl:w-[420px]) from sidebar
- Layout now uses flexible 60/40 split (video: flex-[6], sidebar: flex-[4])
- Fixed 2-column grids in Overview/Detailed tabs with proper width constraints
- Zero horizontal overflow on all screen sizes

**UI Improvements**
- Fixed hard-coded "12 Poses Detected" badge - now shows real count from MediaPipe analysis
- Added proper pluralization (1 Pose vs 14 Poses)

## Previous Changes (October 25, 2025)

**AI Analysis Integration - PRODUCTION READY**
- Integrated 3 AI providers: OpenAI GPT-4o, Google Gemini 2.5, Anthropic Claude Sonnet 4
- Users can select different models for vision analysis and coaching feedback independently
- Vision analysis: Captures current video frame, analyzes muscle definition, vascularity, conditioning
- Coaching analysis: Generates personalized recommendations from pose measurements
- Privacy-first: Only frame snapshots + measurements sent to AI, never full video
- OpenAI uses Replit AI credits (no API key needed), Gemini/Claude require user API keys
- Robust frame capture timing: Explicit `isFrameReady` state prevents stale captures during video switching
- Graceful degradation: If frame capture fails, vision skips with warning and coaching continues
- Button gating: "Analyze with AI" disabled until video metadata loads, with "Loading video..." status
- Complete end-to-end flow validated and architect-approved

**Fully Responsive Dynamic Layout (October 26, 2025)**
- Removed ALL hard-coded widths - layout now uses flexible proportions
- Desktop: 60/40 split (video: `flex-[6]`, sidebar: `flex-[4]`)
- Mobile: Full-width stacking
- Zero horizontal overflow at all viewport sizes
- All components properly constrained with `min-w-0` and `max-w-full`
- Dynamic viewport height (`h-dvh`) for mobile browser compatibility

**Performance Optimizations**
- Smart frame sampling: 2x faster analysis (every 1s instead of 0.5s)
- All video processing happens locally in browser via MediaPipe
- Frame capture from video player for AI vision analysis

## Overview

GLADIATOR MEGAFLEXTRONICS is an AI-powered bodybuilding pose analysis platform that evaluates competitor form through video uploads. The application analyzes bodybuilding poses against professional judging criteria (muscularity, symmetry, conditioning, posing, aesthetics) and provides detailed scoring, recommendations, and frame-by-frame analysis. Built as a full-stack web application with a focus on sports analysis and fitness tracking interfaces.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- Single-page application (SPA) architecture

**UI Component Strategy**
- Radix UI primitives for accessible, unstyled component foundations
- shadcn/ui component library configured in "new-york" style
- Tailwind CSS for utility-first styling with custom design tokens
- Custom design system based on Montserrat (headings) and Open Sans (body text)
- Dark/light theme support via ThemeProvider context

**State Management**
- TanStack Query (React Query) for server state management and caching
- React hooks (useState, useContext) for local component state
- Custom hooks pattern for reusable logic (useIsMobile, useToast, useTheme)

**Layout Pattern**
- Two-column split layout: 60-65% video player, 35-40% analytics sidebar
- Mobile-first responsive design with stacking at md breakpoint
- Full viewport height main application view (h-screen)
- Scrollable analytics panel for metric cards

### Backend Architecture

**Server Framework**
- Express.js with TypeScript running on Node.js
- ESM (ECMAScript Modules) throughout the codebase
- Custom middleware for request logging and JSON body parsing
- Development server with Vite integration for HMR

**API Design**
- RESTful endpoints under `/api` namespace
- Key endpoints:
  - `POST /api/objects/upload` - Get presigned upload URL
  - `POST /api/analyses` - Create video analysis
  - `GET /api/analyses/:id` - Retrieve analysis results
  - `POST /api/analyses/:id/vision` - AI vision analysis (frame + measurements)
  - `POST /api/analyses/:id/coaching` - AI coaching feedback (measurements only)
  - `GET /objects/:objectPath` - Stream video files
- JSON request/response format with Zod schema validation

**Video Processing Pipeline**
1. Client requests presigned upload URL
2. Direct upload to object storage (bypassing server)
3. Analysis creation triggers pose detection engine
4. Mock analysis generates judging scores (placeholder for TensorFlow.js/MediaPipe)
5. Results stored in database and returned to client

**Pose Analysis Engine** (server/poseAnalysis.ts)
- Currently mock implementation simulating pose detection
- Designed for future integration with TensorFlow.js or MediaPipe
- Analyzes videos across 5 judging criteria: muscularity, symmetry, conditioning, posing, aesthetics
- Generates frame-by-frame pose scores and recommendations
- Returns structured analysis data matching database schema

### Data Storage Solutions

**Database**
- PostgreSQL via Neon serverless (indicated by @neondatabase/serverless)
- Drizzle ORM for type-safe database queries and migrations
- Single table schema: `video_analyses`

**Schema Design** (shared/schema.ts)
```typescript
video_analyses {
  id: uuid (primary key)
  videoUrl: text
  videoName: text
  category: text (default: "bodybuilding")
  duration: real
  overallScore: integer
  muscularityScore: integer
  symmetryScore: integer
  conditioningScore: integer
  posingScore: integer
  aestheticsScore: integer
  measurements: jsonb (shoulder width, body fat %, etc.)
  poseScores: jsonb (scores per detected pose)
  detectedPoses: jsonb (array of pose detections with timestamps)
  muscleGroups: jsonb (development levels per muscle group)
  recommendations: jsonb (improvement suggestions)
  judgeNotes: jsonb (strengths, weaknesses, attention items)
  createdAt: timestamp
}
```

**Design Rationale**
- JSONB columns for flexible, schema-less nested data (measurements, pose scores, recommendations)
- Allows iteration on analysis criteria without database migrations
- Single table simplifies queries and relationships
- UUID primary keys for distributed system compatibility

**Object Storage**
- Google Cloud Storage integration via @google-cloud/storage
- Replit-specific sidecar authentication for development environment
- Videos stored in private bucket configured via PRIVATE_OBJECT_DIR
- Direct upload pattern reduces server bandwidth and processing load
- Streaming video delivery via Express endpoint

### Authentication & Authorization

**Current State**
- No authentication system implemented
- Session infrastructure prepared (connect-pg-simple for PostgreSQL session store)
- Credentials passed with `credentials: "include"` in fetch requests (suggests future session-based auth)

**Future Considerations**
- Session-based authentication ready to implement
- Would require user table and video_analyses foreign key relationship
- Authorization logic needed for video access control

### External Dependencies

**Third-Party Services**
- Google Cloud Storage - Video file storage and delivery
- Neon Database - Serverless PostgreSQL hosting
- Replit sidecar services - Development environment authentication for GCS

**Client Libraries**
- Radix UI - 20+ accessible component primitives
- TanStack Query - Server state management
- React Hook Form (@hookform/resolvers) - Form validation
- date-fns - Date formatting utilities
- Lucide React - Icon library

**Development Tools**
- Drizzle Kit - Database migration management
- esbuild - Production server bundling
- tsx - TypeScript execution for development
- Vite plugins - Replit-specific development enhancements

**Font Dependencies**
- Google Fonts: Montserrat (600, 700), Open Sans (400, 600)
- Loaded via CDN in index.html

## Key Architectural Decisions

**Monorepo Structure**
- Shared code in `/shared` (schema, types)
- Client code in `/client`
- Server code in `/server`
- Database code in `/db`
- Path aliases configured in tsconfig.json (@/, @shared/, @assets/)

**Type Safety**
- End-to-end TypeScript coverage
- Zod schemas for runtime validation matching Drizzle schemas
- Shared types between client and server via @shared imports
- No type casting - strict type checking enabled

**Video Upload Pattern**
- Presigned URL approach eliminates server as video proxy
- Reduces server resource consumption
- Enables large file uploads (500MB limit)
- Direct client-to-storage communication

**Mock Analysis Approach**
- Placeholder implementation for computer vision
- Real structure and data format in place
- Easy to swap for actual TensorFlow.js/MediaPipe integration
- Demonstrates full data flow without ML complexity

**Component Organization**
- Atomic design principles (small, reusable components)
- Co-located example files for component documentation
- UI components in `/components/ui` (shadcn pattern)
- Feature components in `/components` root
- Page components in `/pages`