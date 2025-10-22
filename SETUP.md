# DocDom Frontend - Setup Guide

## Quick Start

Follow these steps to get the frontend up and running:

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

The `.env` file is already configured with default settings:
```
VITE_API_URL=http://localhost:5000/api
```

Update the `VITE_API_URL` if your backend runs on a different port.

### 3. Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:3000`

### 3.1 Demo Credentials

To quickly test the application without setting up a backend:

**Email:** `demo@university.edu`  
**Password:** `demo123`

- Click "Fill Demo Credentials" on the login page to auto-fill the form
- The demo account will log you in immediately without requiring a backend
- You'll see a sample dashboard with mock files

### 4. Build for Production

```bash
npm run build
```

The production build will be created in the `dist` folder.

## Features Implemented

### ✅ Authentication
- **Registration Page** - Full name, college email validation (*.edu, *.ac.in), password with show/hide toggle, searchable college dropdown
- **Login Page** - College email and password with validation
- **Protected Routes** - Dashboard only accessible when authenticated

### ✅ Dashboard
- **Responsive Layout** - Sidebar navigation (collapsible on mobile)
- **Search Bar** - Search files by name or description
- **Filters** - Semester, course/subject, "My Uploads" toggle
- **File Grid** - Responsive card layout showing all file details
- **Quick Actions** - Upload button, logout, semester quick filters

### ✅ File Upload
- **Drag & Drop** - Drop files directly or browse
- **File Validation** - Type checking (PDF, DOCX, images) and size limit (50MB)
- **Upload Progress** - Visual progress bar
- **Metadata** - File name, semester, course, optional description

### ✅ UI/UX
- **Dark Theme** - Custom dark color palette for reduced eye strain
- **Responsive Design** - Mobile, tablet, and desktop breakpoints
- **Modern Components** - Reusable Input, Select, Button, Modal components
- **Icons** - Lucide React for consistent iconography
- **Animations** - Smooth transitions and hover effects

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Button.jsx       # Button with variants (primary, secondary, ghost)
│   ├── Input.jsx        # Text/password input with validation
│   ├── Select.jsx       # Dropdown select component
│   ├── SearchBar.jsx    # Search input with icon
│   ├── FileCard.jsx     # File display card
│   ├── Modal.jsx        # Modal dialog wrapper
│   └── FileUploadModal.jsx  # File upload modal with drag-drop
├── pages/               # Page components
│   ├── Registration.jsx # User registration
│   ├── Login.jsx        # User login
│   └── Dashboard.jsx    # Main dashboard with file listing
├── services/            # API service layer
│   └── api.js          # Axios instance and API methods
├── utils/               # Utility functions
│   └── validation.js   # Form and file validation functions
├── App.jsx             # Main app with routing
├── main.jsx            # Entry point
└── index.css           # Global styles and Tailwind directives
```

## API Integration

The frontend is set up to work with a backend API. Currently using mock data for development.

### To connect to your backend:

1. Update `.env` with your backend URL
2. Uncomment the API calls in:
   - `src/pages/Registration.jsx` (line 38)
   - `src/pages/Dashboard.jsx` (lines 152, 175, 186)
   - `src/components/FileUploadModal.jsx` (line 121)

### API Endpoints Expected

```javascript
// Auth
POST /api/auth/register - Register new user
POST /api/auth/login - Login user

// Colleges
GET /api/colleges - Get all colleges
GET /api/colleges/search?q=query - Search colleges

// Files
GET /api/files - Get all files (with optional filters)
POST /api/files/upload - Upload file (multipart/form-data)
GET /api/files/:id/download - Download file
DELETE /api/files/:id - Delete file

// Courses
GET /api/courses - Get all courses
GET /api/courses?semester=1 - Get courses by semester
```

## Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme:

```javascript
colors: {
  dark: {
    bg: '#0f172a',      // Background
    card: '#1e293b',    // Cards
    hover: '#334155',   // Hover states
    border: '#475569'   // Borders
  },
  primary: {
    DEFAULT: '#3b82f6', // Primary color
    dark: '#2563eb',    // Darker shade
    light: '#60a5fa'    // Lighter shade
  }
}
```

### Validation Rules

Edit `src/utils/validation.js` to modify:
- College email domains
- Password requirements
- File size limits
- Allowed file types

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Port already in use
If port 3000 is taken, edit `vite.config.js`:
```javascript
server: {
  port: 3001, // Change to any available port
  open: true
}
```

### CORS Issues
Make sure your backend has CORS configured to allow requests from `http://localhost:3000`

## Next Steps

1. ✅ Frontend is complete and ready
2. 🔄 Connect to backend API
3. 🔄 Add user profile page (optional)
4. 🔄 Add file preview feature (optional)
5. 🔄 Add analytics/dashboard stats (optional)

## Support

For issues or questions, please refer to the main README.md or contact the development team.

