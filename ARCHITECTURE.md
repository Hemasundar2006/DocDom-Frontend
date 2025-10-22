# DocDom Frontend - Architecture Documentation

## Technology Stack

### Core
- **React 18** - UI library with hooks
- **Vite 5** - Build tool and dev server (fast HMR)
- **React Router v6** - Client-side routing

### Styling
- **Tailwind CSS 3** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

### HTTP & State
- **Axios** - HTTP client for API calls
- **LocalStorage** - Client-side authentication state
- **React useState/useEffect** - Component state management

### Icons & UI
- **Lucide React** - Modern icon library (tree-shakeable)

## Project Structure

```
docdom-frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Button.jsx           # Button with variants
│   │   ├── Input.jsx            # Text/password input
│   │   ├── Select.jsx           # Dropdown select
│   │   ├── SearchBar.jsx        # Search input
│   │   ├── Modal.jsx            # Modal wrapper
│   │   ├── FileCard.jsx         # File display card
│   │   └── FileUploadModal.jsx  # Upload modal
│   │
│   ├── pages/          # Page components (routes)
│   │   ├── Registration.jsx     # /register
│   │   ├── Login.jsx            # /login
│   │   └── Dashboard.jsx        # /dashboard
│   │
│   ├── services/       # API layer
│   │   └── api.js              # Axios instance & API methods
│   │
│   ├── utils/          # Helper functions
│   │   └── validation.js       # Form validators
│   │
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
│
├── index.html          # HTML template
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
└── postcss.config.js   # PostCSS configuration
```

## Component Architecture

### Component Hierarchy

```
App
├── Router
    ├── Registration (Public Route)
    ├── Login (Public Route)
    └── Dashboard (Protected Route)
        ├── Sidebar
        │   ├── Logo
        │   ├── UserProfile
        │   ├── QuickFilters
        │   ├── UploadButton
        │   └── LogoutButton
        │
        └── MainContent
            ├── Header
            ├── SearchAndFilters
            │   ├── SearchBar
            │   └── Selects (Semester, Course)
            │
            ├── FileGrid
            │   └── FileCard (multiple)
            │
            └── FileUploadModal
                ├── Modal
                ├── DragDropArea
                ├── Input (File Name)
                ├── Select (Semester, Course)
                └── Textarea (Description)
```

### Component Patterns

#### 1. Presentational Components
Pure components that receive props and render UI.

Examples: `Button`, `Input`, `Select`, `FileCard`

```jsx
// Example: Button.jsx
export default function Button({ 
  children, variant, loading, onClick 
}) {
  return <button>{loading ? 'Loading...' : children}</button>
}
```

#### 2. Container Components
Components with state and logic that manage data.

Examples: `Dashboard`, `Registration`, `Login`

```jsx
// Example: Dashboard.jsx
export default function Dashboard() {
  const [files, setFiles] = useState([])
  const [filters, setFilters] = useState({})
  
  useEffect(() => {
    fetchFiles()
  }, [filters])
  
  return <div>...</div>
}
```

#### 3. Modal Components
Overlay components with state management.

Examples: `Modal`, `FileUploadModal`

```jsx
// Example: FileUploadModal.jsx
export default function FileUploadModal({ 
  isOpen, onClose, onUploadSuccess 
}) {
  const [formData, setFormData] = useState({})
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Form content */}
    </Modal>
  )
}
```

## Routing Architecture

### Route Configuration

```javascript
// App.jsx
<Router>
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" />} />
    <Route path="/register" element={<PublicRoute><Registration /></PublicRoute>} />
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
  </Routes>
</Router>
```

### Route Guards

**PublicRoute**: Redirects to dashboard if authenticated
**ProtectedRoute**: Redirects to login if not authenticated

```javascript
const ProtectedRoute = ({ children }) => {
  return isAuthenticated ? children : <Navigate to="/login" />
}

const PublicRoute = ({ children }) => {
  return !isAuthenticated ? children : <Navigate to="/dashboard" />
}
```

## State Management

### Authentication State

```javascript
// App.jsx
const [isAuthenticated, setIsAuthenticated] = useState(false)

useEffect(() => {
  const token = localStorage.getItem('authToken')
  setIsAuthenticated(!!token)
}, [])
```

**Stored in LocalStorage**:
- `authToken` - JWT token from backend
- `user` - User object (name, email, college)

### Component State

Each page/component manages its own state:

**Dashboard**:
- `files` - Array of file objects
- `filters` - Search and filter criteria
- `loading` - Loading state for API calls
- `uploadModalOpen` - Modal visibility

**Registration/Login**:
- `formData` - Form field values
- `errors` - Validation error messages
- `loading` - Submit button loading state

**FileUploadModal**:
- `selectedFile` - File object
- `formData` - Form metadata
- `uploadProgress` - Upload percentage (0-100)
- `dragActive` - Drag state

## API Layer

### Axios Instance

```javascript
// src/services/api.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' }
})

// Request interceptor adds auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### API Services

Organized by resource:

**authAPI**:
- `register(userData)` → POST /auth/register
- `login(credentials)` → POST /auth/login
- `logout()` → Clear localStorage

**filesAPI**:
- `getAll(filters)` → GET /files?semester=X&course=Y
- `upload(formData)` → POST /files/upload
- `download(fileId)` → GET /files/:id/download
- `delete(fileId)` → DELETE /files/:id

**collegesAPI**:
- `getAll()` → GET /colleges
- `search(query)` → GET /colleges/search?q=X

**coursesAPI**:
- `getAll()` → GET /courses
- `getBySemester(semester)` → GET /courses?semester=X

## Validation Layer

### Form Validation

```javascript
// src/utils/validation.js

// Email validation
validateCollegeEmail(email)
  → Returns true if email matches *.edu, *.ac.in, etc.

// Password validation
validatePassword(password)
  → Returns error message or null
  → Rules: 8+ chars, letter + number

// Name validation
validateName(name)
  → Returns error message or null
  → Rules: 2+ characters

// File validation
validateFile(file, maxSize)
  → Returns error message or null
  → Checks: type, size
```

### Validation Flow

1. User types in input
2. `onChange` handler updates state
3. Error for that field is cleared
4. On submit, `validateForm()` runs
5. If errors exist, prevent submission
6. Display errors below respective fields

## Data Flow

### Authentication Flow

```
1. User fills registration/login form
2. Form validation on submit
3. API call to /auth/register or /auth/login
4. Backend returns { token, user }
5. Store token and user in localStorage
6. Update isAuthenticated state
7. Router navigates to /dashboard
```

### File Upload Flow

```
1. User clicks Upload button
2. Modal opens with form
3. User drags file or browses
4. File validation runs
5. User fills metadata (name, semester, course)
6. On submit, create FormData
7. API call to /files/upload
8. Progress bar updates
9. On success, refresh file list
10. Close modal
```

### File Browsing Flow

```
1. Dashboard loads, fetches files
2. User enters search or selects filters
3. Filters state updates
4. useEffect triggered by filter change
5. API call with filter parameters
6. Files state updated
7. UI re-renders with filtered files
```

## Styling Architecture

### Tailwind Utility Classes

Using Tailwind's utility-first approach:

```jsx
<div className="bg-dark-card border border-dark-border rounded-lg p-6">
  <h1 className="text-2xl font-bold text-gray-100">Title</h1>
</div>
```

### Custom Utilities

Defined in `index.css`:

```css
@layer utilities {
  .scrollbar-thin::-webkit-scrollbar {
    width: 8px;
  }
}
```

### Custom Theme

Extended in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      dark: {
        bg: '#0f172a',
        card: '#1e293b',
        hover: '#334155',
        border: '#475569'
      },
      primary: {
        DEFAULT: '#3b82f6',
        dark: '#2563eb',
        light: '#60a5fa'
      }
    }
  }
}
```

## Build & Deployment

### Development Build

```bash
npm run dev
```

- Fast HMR (Hot Module Replacement)
- Source maps enabled
- Runs on http://localhost:3000

### Production Build

```bash
npm run build
```

Outputs to `dist/`:
- Minified JavaScript
- Optimized CSS
- Code splitting
- Asset hashing for cache busting

### Preview Production Build

```bash
npm run preview
```

## Performance Considerations

### Optimization Techniques

1. **Code Splitting**: React Router auto-splits by route
2. **Lazy Loading**: Components loaded on-demand
3. **Tree Shaking**: Unused code eliminated
4. **Asset Optimization**: Vite optimizes images/fonts
5. **Minimal Dependencies**: Only essential packages

### Bundle Size

Estimated production bundle (gzipped):
- Main JS: ~150 KB
- Vendor JS: ~180 KB
- CSS: ~10 KB

Total: ~340 KB (initial load)

## Security Considerations

### Implemented

1. ✅ JWT token stored in localStorage
2. ✅ Token sent in Authorization header
3. ✅ Protected routes redirect to login
4. ✅ Form validation on client-side
5. ✅ File type and size validation

### Backend Required

- CORS configuration
- Input sanitization
- Rate limiting
- CSRF protection
- XSS prevention

## Browser Compatibility

**Supported**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Modern JavaScript Features Used**:
- ES6+ syntax
- Async/await
- Optional chaining
- Nullish coalescing
- Template literals

## Error Handling

### API Errors

```javascript
try {
  await authAPI.login(credentials)
} catch (error) {
  setErrors({ 
    submit: error.response?.data?.message || 'Login failed' 
  })
}
```

### Form Validation Errors

```javascript
const errors = {}
if (!validateEmail(email)) {
  errors.email = 'Invalid email address'
}
setErrors(errors)
```

### File Upload Errors

```javascript
const fileError = validateFile(file)
if (fileError) {
  setErrors({ file: fileError })
  return
}
```

## Testing Strategy (Recommended)

### Unit Tests
- Validation functions
- Utility functions
- Component rendering

### Integration Tests
- Form submissions
- API calls
- Route navigation

### E2E Tests
- User registration flow
- Login flow
- File upload flow
- File browsing and filtering

**Suggested Tools**:
- Vitest (unit tests)
- React Testing Library (component tests)
- Playwright/Cypress (E2E tests)

## Future Enhancements

### Suggested Features

1. **User Profile Page**
   - Edit profile
   - Change password
   - View upload history

2. **File Preview**
   - PDF viewer modal
   - Image lightbox

3. **Advanced Filters**
   - Date range
   - File type
   - Tags/keywords

4. **Social Features**
   - Comments on files
   - Ratings/reviews
   - Favorites

5. **Admin Dashboard**
   - User management
   - Content moderation
   - Analytics

6. **PWA Support**
   - Offline access
   - Push notifications
   - Install prompt

## Development Guidelines

### Code Style

- Use functional components with hooks
- Prop destructuring in function params
- Early returns for conditional rendering
- Consistent file naming (PascalCase for components)
- 2-space indentation
- Single quotes for strings

### Component Design

- Keep components small and focused
- Extract reusable logic to custom hooks
- Use composition over inheritance
- Props should be clearly named
- Validate props with PropTypes (optional)

### Git Workflow

- Feature branches from main
- Descriptive commit messages
- PR reviews before merging
- Keep commits atomic

### Performance

- Avoid unnecessary re-renders
- Use React.memo for expensive components
- Debounce search inputs
- Lazy load routes
- Optimize images

---

**Last Updated**: October 2025  
**Version**: 1.0.0  
**Maintainers**: Development Team

