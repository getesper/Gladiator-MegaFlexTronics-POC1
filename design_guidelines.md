# Bodybuilding Biomechanics Analysis Platform - Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing from clinical research platforms like VICON motion analysis systems, medical imaging software (DICOM viewers), and professional sports biomechanics labs. This creates a precise, authoritative environment that positions the application as a scientific tool for serious athletes and coaches.

## Color System

**Clinical Palette:**
- Primary: Deep Navy Blue (#1A2B4A) - headers, primary actions
- Secondary: Steel Blue (#4A6FA5) - accents, data points
- Neutral Base: Cool Gray scale (#F8F9FB, #E5E7EB, #9CA3AF, #4B5563)
- Data Visualization: Electric Blue (#3B82F6), Cyan (#06B6D4), Teal (#14B8A6)
- Alerts: Medical Red (#DC2626), Caution Amber (#F59E0B), Success Green (#10B981)
- Background: Crisp White (#FFFFFF) primary, Light Gray (#F8F9FB) secondary
- Text: Charcoal (#1F2937) primary, Medium Gray (#6B7280) secondary

## Typography System

**Font Families:**
- Primary: Inter (UI elements, headings, labels) - weights: 500 (medium), 600 (semibold), 700 (bold)
- Data Display: JetBrains Mono (metrics, measurements, technical data) - weights: 400 (regular), 500 (medium), 600 (semibold)
- Body: Inter (descriptions, annotations) - weight: 400 (regular)

**Type Scale:**
- Dashboard Title: text-3xl font-bold (Inter)
- Section Headers: text-xl font-semibold (Inter)
- Metric Values: text-2xl font-semibold (JetBrains Mono)
- Data Labels: text-sm font-medium (Inter)
- Measurements: text-base (JetBrains Mono)
- Body Text: text-sm (Inter)
- Technical Annotations: text-xs (JetBrains Mono)

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16 for precise, consistent spacing.

**Grid Structure:**
- Main Interface: Clinical three-panel layout
  - Left Panel: Video/Image Analysis (55% width desktop) - dark background for visual focus
  - Center Divider: Vertical measurement ruler with frame indicators
  - Right Panel: Analytics & Metrics (45% width desktop) - white background, scrollable
- Measurement Grid: 12-column system for metric cards and data tables
- Mobile: Single column stack (video → metrics)

**Container Strategy:**
- Full viewport application (h-screen with overflow control)
- Video container: 16:9 ratio with technical overlay grid
- Metrics panel: Fixed header, scrollable content area
- Modal dialogs: max-w-4xl for detailed analysis reports

## Component Library

### Navigation Header
- Fixed top bar: h-14, white background, subtle bottom border
- Logo section: Left-aligned with monospace version number (v2.4.1)
- Status indicators: Processing state with clinical icons
- Action bar: Right-aligned upload, export, settings buttons
- Breadcrumb trail: Center-positioned for analysis context

### Video Analysis Interface

**Video Player:**
- Dark background (#0F1419) for clinical viewing
- Skeletal overlay: Blue keypoints (#3B82F6), cyan connections (#06B6D4)
- Technical grid overlay: Thin white lines (10% opacity) for measurement reference
- Frame counter: Bottom-left, monospace font, millisecond precision
- Playback controls: Minimalist icons, bottom bar with timeline
- Angle measurement tools: Interactive protractor overlays

**Control Panel:**
- Frame-by-frame scrubber with thumbnail preview strip
- Speed controls: 0.25x, 0.5x, 1x, 2x with monospace labels
- Pose detection toggle: Switch with active state indicator
- Overlay controls: Skeletal view, muscle activation map, angle measurements
- Export frame: Button to capture annotated still image

### Scientific Metrics Dashboard

**Metric Cards (Grid Layout):**
- Card structure: White background, rounded-lg, shadow-sm, border border-gray-200
- Header: Small label (uppercase text-xs tracking-wide), icon indicator
- Primary value: Large monospace number (text-3xl), unit in smaller text
- Trend indicator: Small arrow with percentage change
- Mini chart: Sparkline showing historical trend
- Card sizes: Standard (1 column), Featured (2 columns wide)

**Core Metric Types:**

1. **Form Accuracy Score**
   - Large radial gauge (circular progress, 0-100 scale)
   - Color-coded segments: <60 red, 60-80 amber, 80+ green
   - Center: Monospace score with letter grade (A, B, C)
   - Subscores: Listed below with mini horizontal bars

2. **Bilateral Symmetry Analysis**
   - Split view: Left vs Right anatomical silhouette
   - Percentage deviation shown between sides
   - Color-coded highlighting: Asymmetries in amber/red
   - Numerical difference in degrees/percentages (monospace)

3. **Joint Angle Measurements**
   - Table format: Joint name, measured angle, ideal range, deviation
   - Each row: Striped background, monospace angle values
   - Warning icons for out-of-range measurements
   - Anatomical diagram with highlighted joints

4. **Muscle Activation Map**
   - Anatomical body diagram (front/back views)
   - Heat map overlay: Blue (low) to red (high) activation
   - Percentage values on major muscle groups
   - Toggle between muscle groups and individual muscles

5. **Temporal Analysis**
   - Timeline graph: X-axis (frames/time), Y-axis (angle/position)
   - Multiple data series with color coding
   - Vertical markers for pose phases (eccentric, peak, concentric)
   - Hover tooltips with precise measurements

### Data Tables & Lists
- Clean table design: Fixed header, striped rows (alternating gray backgrounds)
- Column headers: Uppercase text-xs, tracking-wide, medium gray
- Data cells: Monospace for numerical values, Inter for labels
- Sortable columns: Arrow indicators in headers
- Row hover: Subtle background highlight
- Dense spacing: Compact for information density

### Scientific Visualizations

**Radial Gauges:**
- SVG-based circular progress
- Thick stroke (10-12px), precise arc endpoints
- Tick marks every 10 degrees
- Center label: Large value, small unit text
- Background arc in light gray

**Bar Charts (Horizontal):**
- Left-aligned label, right-aligned value
- Filled bar with gradient (primary → accent color)
- Background bar in light gray
- Height: h-3 or h-4 for readability
- Grid lines at 25%, 50%, 75% marks

**Line Graphs:**
- Technical grid background with axis labels
- Multiple series with distinct colors
- Data points marked with small circles
- Smooth curves using bezier paths
- Legends with color swatches

### Anatomical Diagrams
- Clean line art illustrations (SVG)
- Clickable muscle groups with highlighting
- Labels with leader lines to specific points
- Front, side, and back view options
- Overlay capability on video frames

### Modal Panels
- Large overlay (max-w-5xl) for detailed reports
- Header: Title, close button, export actions
- Tabbed sections: Overview, Detailed, Recommendations, History
- Content: Mixed charts, tables, and annotated images
- Footer: Primary actions (Save, Export PDF, Share)

## Interaction Patterns

**Video Analysis:**
- Click timeline to jump frames
- Drag angle measurement tools onto joints
- Toggle overlay layers (skeletal, muscle, grid)
- Export annotated frames with measurements

**Metrics Exploration:**
- Click metric cards to expand into detailed modal
- Hover charts for precise tooltips with values
- Interactive anatomical diagrams with muscle selection
- Scrub timeline graph to sync with video frame

**Upload & Processing:**
- Drag-and-drop with technical progress indicator
- Processing: Step-by-step status (Upload → Analysis → Rendering)
- Completion: Automated transition to analysis view
- Error handling: Clinical alert boxes with diagnostic messages

## Responsive Behavior

**Desktop (lg+):**
- Three-panel layout with adjustable dividers
- Full metrics sidebar with all cards visible
- Multi-column grid for metric cards (2-3 columns)

**Tablet (md):**
- Two-panel: Video top, metrics bottom
- Collapsible sections in metrics panel
- 2-column metric grid

**Mobile:**
- Vertical stack: Video → Controls → Metrics
- Single column metrics
- Bottom drawer for detailed analysis
- Simplified anatomical views

## Images

**Hero Section:** Not applicable - clinical application prioritizes immediate functionality over marketing hero imagery.

**Anatomical Diagrams:** Clean, medical-grade SVG illustrations of human musculature (front, side, back views). Placed in muscle activation cards and detailed analysis modals. Style: Line art with subtle shading, professional medical textbook aesthetic.

**Video Thumbnails:** Generated from uploaded analysis videos, displayed in timeline scrubber and frame selector strip. Overlaid with pose quality indicators and frame numbers.

## Accessibility

- All controls: Keyboard navigable with clear focus rings (ring-2 ring-blue-500)
- Screen reader labels on all data visualizations
- High contrast mode support (maintains WCAG AAA ratios)
- Minimum 44x44px touch targets on all interactive elements
- Alt text on all anatomical diagrams
- Skip navigation for quick access to analysis results

## Key Design Principles

1. **Clinical Precision:** Every element conveys scientific accuracy and professional authority
2. **Data Hierarchy:** Critical measurements immediately visible, detailed analysis on demand
3. **Visual Clarity:** High contrast, generous whitespace, clear separation of data types
4. **Technical Authenticity:** Monospace typography and measurement tools create research lab credibility
5. **Professional Trust:** Color palette and typography establish expertise for coaches and competitive athletes

This design creates a biomechanics research platform that professionals can trust for precise, scientific bodybuilding pose analysis.