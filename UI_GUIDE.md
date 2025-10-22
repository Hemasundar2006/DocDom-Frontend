# DocDom Frontend - UI/UX Guide

## Design System

### Color Palette (Dark Theme)

```
Background:    #0f172a (Slate 900)
Cards:         #1e293b (Slate 800)
Hover:         #334155 (Slate 700)
Borders:       #475569 (Slate 600)

Primary:       #3b82f6 (Blue 500)
Primary Dark:  #2563eb (Blue 600)
Primary Light: #60a5fa (Blue 400)

Text Primary:  #f1f5f9 (Slate 100)
Text Secondary:#94a3b8 (Slate 400)
Text Muted:    #64748b (Slate 500)

Success:       #22c55e (Green 500)
Error:         #ef4444 (Red 500)
Warning:       #f59e0b (Amber 500)
```

### Typography

- **Headings**: System font stack with bold weight
- **Body**: System font stack with regular weight
- **Code**: Monospace font stack

### Spacing

Using Tailwind's spacing scale (0.25rem increments)

## Pages Overview

### 1. Registration Page (`/register`)

**Layout**: Centered single-column form

**Features**:
- Logo and branding at top
- Full name input field
- College email input with validation indicator
- Password input with show/hide toggle button
- College dropdown with searchable list
- Error messages appear below each field in red
- "Create Account" button (blue, full width)
- "Already have an account? Sign in" link at bottom
- Terms and privacy notice

**Validation**:
- Real-time validation as user types
- Email must match college domains (*.edu, *.ac.in, *.edu.in)
- Password must be 8+ characters with letter and number
- All fields required

**Mobile**: Single column, full width on small screens

---

### 2. Login Page (`/login`)

**Layout**: Centered single-column form

**Features**:
- Logo and branding at top
- College email input
- Password input with show/hide toggle
- "Forgot password?" link (right-aligned)
- Error message box for failed login attempts
- "Sign In" button (blue, full width)
- "Don't have an account? Create one" link

**Mobile**: Single column, full width on small screens

---

### 3. Dashboard (`/dashboard`)

**Layout**: Sidebar + Main Content

#### Sidebar (Left, 256px wide)

**Desktop**:
- Fixed position, always visible
- Dark card background (#1e293b)

**Mobile/Tablet**:
- Slide-in drawer from left
- Overlay backdrop when open
- Hamburger menu button to toggle

**Sections**:

1. **Header** (Top)
   - DocDom logo with graduation cap icon
   - Blue circular icon background

2. **User Profile**
   - Circular avatar (blue background with user icon)
   - User name (truncated if long)
   - Email address (truncated if long)

3. **Quick Filters** (Scrollable)
   - "Quick Filters" label (uppercase, small, gray)
   - List of semester buttons (1-8)
   - Active filter highlighted in blue
   - Hover effect on inactive filters

4. **Upload Button**
   - Blue button with upload icon
   - Full width, prominent
   - Border separator above

5. **Logout Button**
   - Red text, ghost style
   - Logout icon + text
   - Bottom of sidebar

#### Main Content Area

**Header Bar**:
- Hamburger menu (mobile only)
- "Document Library" heading
- "Browse and download shared documents" subtitle
- "Upload" button (desktop only, top right)

**Search & Filters Panel**:
- Full-width search bar with search icon
- 3-column grid on desktop, stacked on mobile:
  - Semester dropdown (All Semesters default)
  - Course dropdown (All Courses default)
  - "My Uploads" toggle button + "Clear" button
- Filters have blue focus rings

**File Grid**:
- Responsive grid layout:
  - Desktop (XL): 3 columns
  - Tablet (MD): 2 columns
  - Mobile: 1 column
- 24px gap between cards
- Scrollable area with custom scrollbar

**Empty States**:

*No files*:
- Large file icon (gray, centered)
- "No files found" heading
- Helpful message
- "Upload First Document" button (if no filters)

*Loading*:
- Spinning loader (blue)
- "Loading files..." text

#### File Cards

**Card Structure**:
- Dark card background with border
- Hover: border turns blue, title turns blue
- Rounded corners (8px)
- Padding: 20px

**Card Contents**:

1. **Header Section**:
   - File type icon (left):
     - PDF: Red file icon
     - Image: Blue image icon
     - Other: Gray file icon
   - File name (large, bold, truncated)
   - Uploader name (small, gray)

2. **Tags**:
   - Semester badge (blue background, rounded pill)
   - Course badge (purple background, rounded pill)

3. **Description** (if present):
   - Gray text, 2 lines max
   - Truncated with ellipsis

4. **Footer** (border top):
   - Left: File size + date (gray, small)
   - Right: "Download" button (blue, with icon)

---

### 4. File Upload Modal

**Trigger**: Click "Upload" button or "Upload File" in sidebar

**Modal Structure**:
- Overlay backdrop (black, 75% opacity)
- Centered modal (max-width: 672px)
- Dark card background
- Rounded corners

**Header**:
- "Upload Document" title (left)
- Close button (X icon, right)
- Border bottom

**Content** (scrollable):

1. **Drag & Drop Area**:
   - Dashed border (2px)
   - Default: Gray border
   - Dragging: Blue border + light blue background
   - Error: Red border
   - Large upload icon (centered)
   - "Drag and drop your file here, or browse" text
   - Supported formats note (small, gray)

   *After file selected*:
   - Dark background
   - File icon (left)
   - File name and size
   - Remove button (X icon, right)

2. **Upload Progress** (during upload):
   - Progress bar (0-100%)
   - Percentage text
   - Blue fill, gray background

3. **Form Fields**:
   - **File Name**: Text input (required)
     - Pre-filled with selected filename
   - **Semester**: Dropdown (required)
     - Options: Semester 1-8
   - **Course**: Dropdown (required)
     - Options: Math, Physics, Chemistry, CS, English, Economics
   - **Description**: Multiline textarea (optional)
     - 3 rows
     - Placeholder: "Add notes or description..."

4. **Action Buttons**:
   - Two equal-width buttons:
     - "Cancel" (left, secondary style)
     - "Upload" (right, primary blue)
   - Loading state on Upload button during upload

**Validation**:
- File type checking (PDF, DOCX, JPG, PNG, GIF, WEBP)
- File size limit (50MB)
- Required field validation
- Error messages appear below fields in red

---

## Responsive Breakpoints

```
Mobile:  < 768px  (1 column)
Tablet:  768px+   (2 columns)
Desktop: 1024px+  (sidebar visible, 3 columns)
XL:      1280px+  (wider content)
```

## Interactions & Animations

### Hover Effects
- Buttons: Slight color darkening
- File cards: Border color change to blue
- Links: Color lightening
- Sidebar items: Background color change

### Transitions
- All interactive elements: 150-300ms ease
- Sidebar drawer: 300ms ease-in-out transform
- Modal: Fade in/out
- File upload progress: Smooth width animation

### Focus States
- Blue ring (2px) on all interactive elements
- Visible keyboard navigation
- Skip to content for accessibility

## Accessibility Features

1. **Keyboard Navigation**:
   - All interactive elements accessible via Tab
   - Focus visible indicators
   - Modal trapping

2. **Screen Readers**:
   - Semantic HTML elements
   - ARIA labels where needed
   - Alt text for icons (via Lucide React)

3. **Color Contrast**:
   - WCAG AA compliant
   - Text has sufficient contrast on dark backgrounds

4. **Forms**:
   - Labels associated with inputs
   - Error messages announced
   - Required field indicators

## Component Library

### Input Component
**Props**: label, type, placeholder, value, onChange, error, required
**Features**: Show/hide toggle for passwords, error state styling

### Select Component
**Props**: label, value, onChange, options, placeholder, error, required
**Features**: Custom styling, error states

### Button Component
**Props**: variant, loading, disabled, onClick
**Variants**: primary (blue), secondary (gray), ghost (transparent), danger (red)
**Features**: Loading spinner, disabled state

### SearchBar Component
**Props**: value, onChange, placeholder
**Features**: Search icon, full-width, focus ring

### FileCard Component
**Props**: file, onDownload
**Features**: Dynamic icon, hover effects, formatted dates/sizes

### Modal Component
**Props**: isOpen, onClose, title, size
**Features**: Backdrop, close button, scrollable content, body scroll lock

## Icon Usage

Using **Lucide React** icon library:
- GraduationCap: Logo, branding
- Upload: Upload actions
- Download: Download actions
- Search: Search functionality
- Filter: Filter actions
- User: User profile
- LogOut: Logout action
- Menu: Mobile menu toggle
- X: Close actions
- Eye/EyeOff: Password visibility
- FileText: Documents
- Image: Image files
- FileIcon: Generic files

## Best Practices Implemented

1. ✅ Mobile-first responsive design
2. ✅ Consistent spacing and typography
3. ✅ Clear visual hierarchy
4. ✅ Intuitive navigation
5. ✅ Immediate feedback on user actions
6. ✅ Error prevention and helpful error messages
7. ✅ Loading states for async operations
8. ✅ Empty states with clear calls-to-action
9. ✅ Accessible color contrast
10. ✅ Touch-friendly button sizes (min 44px)

## Dark Mode Considerations

- Reduced brightness for night usage
- High contrast for readability
- Subtle shadows instead of harsh borders
- Consistent color temperature (cool blues)
- Easy on the eyes for extended reading

## Performance Optimizations

- Lazy loading of routes
- Optimized re-renders with proper state management
- Debounced search input
- Efficient list rendering
- Minimal bundle size with tree-shaking

