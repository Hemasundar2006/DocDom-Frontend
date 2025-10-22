# DocDom Frontend

A modern, responsive document sharing platform for college students.

## Features

- 🌙 Dark mode theme for reduced eye strain
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🔐 Secure authentication with college email validation
- 📄 File upload with drag-and-drop support
- 🔍 Advanced search and filtering
- 🎨 Clean, minimalist UI with Tailwind CSS

## Tech Stack

- React 18
- Vite
- React Router v6
- Tailwind CSS
- Axios
- Lucide React (icons)

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Demo Credentials

To quickly test the application without registration:

**Email:** `demo@university.edu`  
**Password:** `demo123`

Click "Fill Demo Credentials" on the login page to auto-fill the form.

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/            # Page components
├── utils/            # Utility functions and validation
├── services/         # API service layer
├── App.jsx           # Main app component with routing
└── main.jsx          # Application entry point
```

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:5000/api
```

## License

MIT

