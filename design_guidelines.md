# Bodybuilding Pose Analysis Application - Design Guidelines

## Design Approach

**Reference-Based Hybrid Approach**: Drawing inspiration from sports analysis platforms like Hudl (video analysis interface) and MyFitnessPal (fitness tracking dashboard), combined with Material Design principles for the analytics components. This creates a professional, data-driven environment that prioritizes video content while maintaining clear information hierarchy.

## Typography System

**Font Families:**
- Primary: Montserrat (headings, labels, UI elements) - weights: 600 (semibold), 700 (bold)
- Secondary: Open Sans (body text, descriptions, data) - weights: 400 (regular), 600 (semibold)

**Type Scale:**
- Hero/Page Titles: text-4xl font-bold (Montserrat)
- Section Headings: text-2xl font-semibold (Montserrat)
- Component Headers: text-lg font-semibold (Montserrat)
- Body Text: text-base (Open Sans)
- Metrics/Data: text-xl font-semibold (Montserrat)
- Labels/Captions: text-sm (Open Sans)
- Micro-labels: text-xs (Open Sans)

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, and 16 for consistent spacing throughout (p-4, m-8, gap-6, etc.)

**Grid Structure:**
- Main application: Two-column split layout
  - Left: Video player area (60-65% width on desktop, full width on mobile)
  - Right: Analytics sidebar (35-40% width on desktop, stacked below on mobile)
- Dashboard sections: 12-column CSS Grid for flexible analytics layout
- Responsive breakpoints: Mobile-first, stack columns at md breakpoint

**Container Strategy:**
- Full viewport height for main application view (h-screen)
- Video container: Maintains 16:9 aspect ratio with controls
- Analytics panel: Scrollable overflow for metric cards
- Upload interface: Centered modal/card with max-w-2xl

## Component Library

### Navigation & Header
- Top navigation bar: Fixed position, h-16, horizontal flex layout
- Logo/branding: Left-aligned, medium size icon + app name
- User actions: Right-aligned (upload button, settings icon, profile)
- Progress indicator: Thin horizontal bar below nav when processing video

### Video Upload Interface
- Drag-and-drop zone: Large dashed border rectangle, min-h-96
- Upload icon: Centered, large-scale (w-24 h-24)
- Instructions: Centered text below icon ("Drag video here or click to browse")
- File type indicator: Small text, supported formats (MP4, MOV, AVI)
- Upload button: Primary CTA when file selected
- Progress bar: Full-width, animated during upload

### Video Player
- Custom controls overlay: Bottom-aligned, semi-transparent background
- Playback controls: Play/pause, timeline scrubber, timestamp, speed selector
- Frame-by-frame controls: Dedicated buttons for advancing/rewinding single frames
- Pose overlay toggle: Switch to show/hide skeletal keypoints on video
- Fullscreen toggle: Standard icon button, right corner
- Timeline markers: Visual indicators for detected poses along scrubber

### Analytics Dashboard (Sidebar)

**Metrics Cards:**
- Grid layout: 2 columns on desktop, 1 column on mobile
- Card structure: Rounded corners (rounded-lg), shadow-sm, padding p-6
- Metric display: Large number (text-3xl font-bold), label below (text-sm)
- Icon: Top-left of card, accent color indicator

**Analysis Sections:**
1. **Overview Card**
   - Total poses detected count
   - Video duration
   - Processing status badge

2. **Form Score Card**
   - Large circular progress indicator (0-100 score)
   - Color-coded: High (success), Medium (warning), Low (error)
   - Breakdown: List of sub-scores with mini progress bars

3. **Symmetry Evaluation**
   - Left vs Right comparison
   - Horizontal bar chart showing balance
   - Percentage difference indicator

4. **Muscle Group Assessment**
   - List of muscle groups with engagement levels
   - Tag-style indicators (rounded-full badges)
   - Visual grid showing activated areas

5. **Frame-by-Frame Timeline**
   - Horizontal scrollable strip of video thumbnails
   - Each thumbnail: Click to jump to frame, pose quality indicator overlay
   - Selected frame: Highlighted border

### Reports & Insights
- Tabbed interface: Overview, Detailed Analysis, Recommendations
- Data tables: Striped rows, sticky headers, sortable columns
- Recommendation cards: Icon + title + description, stackable list format
- Export button: Secondary button style, top-right of report section

### Visual Elements

**Progress Indicators:**
- Circular: SVG-based, animated stroke, centered percentage text
- Linear: Horizontal bars with smooth gradient fills, height h-2 or h-3
- Processing spinner: Animated rotation, medium size for video processing

**Status Badges:**
- Pill-shaped (rounded-full), small padding (px-3 py-1)
- Text size: text-xs font-medium
- States: Processing, Complete, Error, Analyzing

**Icons:**
- Source: Heroicons (outline for secondary, solid for active states)
- Size: w-5 h-5 for inline, w-6 h-6 for buttons, w-8 h-8 for cards
- Key icons: Upload, Play, Pause, Chart, User, Settings, Download, Check, Alert

## Interaction Patterns

**Video Controls:**
- Scrubber: Click anywhere on timeline to jump, drag for precision
- Hover states: Show preview thumbnail above timeline on hover
- Keyboard shortcuts: Spacebar (play/pause), Arrow keys (frame advance)

**Analytics Interactions:**
- Metric cards: Clickable to expand detailed view in modal
- Charts: Interactive tooltips on hover showing exact values
- Timeline thumbnails: Click to sync video player to that frame

**Upload Flow:**
- Drag-and-drop: Visual feedback (border highlight) on dragover
- File validation: Immediate error message if wrong format
- Processing: Animated progress with estimated time remaining
- Completion: Success message with "View Analysis" CTA

## Responsive Behavior

**Desktop (lg and above):**
- Side-by-side video and analytics
- Full analytics sidebar visible
- Multi-column metric grid

**Tablet (md):**
- Video top, analytics below
- 2-column metric grid maintained
- Collapsible analytics sections

**Mobile:**
- Stacked vertical layout
- Video full-width, 16:9 ratio maintained
- Single column metrics
- Bottom sheet for detailed analysis (slide up from bottom)
- Simplified controls for video player

## Dark Mode Specification

**Video Viewing Mode:**
- Background: True black or very dark gray
- Reduces eye strain during extended analysis sessions
- Toggle: Top-right corner, moon/sun icon
- Persistent: Saved to user preference
- Affects: Video container, sidebar, and all UI elements

**Implementation:**
- Use Tailwind's dark: modifier throughout
- High contrast maintained for all text on dark backgrounds
- Subtle borders to define component boundaries in dark mode

## Accessibility

- Video player: Keyboard navigable controls, ARIA labels for all buttons
- Skip to content link for screen readers
- All interactive elements: min 44x44px touch target
- Form inputs: Associated labels, error states with icons and text
- Focus indicators: Clear visible outline (ring-2) on all focusable elements
- Contrast ratios: WCAG AA compliant for all text

## Key Design Principles

1. **Video-First:** Video player is the hero, analytics support the content
2. **Data Clarity:** Metrics are immediately scannable with visual hierarchy
3. **Progressive Disclosure:** Basic metrics upfront, detailed analysis on demand
4. **Responsive Performance:** Smooth video playback takes precedence
5. **Purposeful Animations:** Only for feedback (upload progress, processing status)

This design creates a professional sports analysis platform that balances powerful analytics with an intuitive, video-centric interface optimized for bodybuilding pose assessment.