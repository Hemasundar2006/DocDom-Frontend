import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import SplashScreen from './components/SplashScreen'
import Registration from './pages/Registration'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    // Check if user is authenticated (token exists)
    const token = localStorage.getItem('authToken')
    setIsAuthenticated(!!token)
  }, [])

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />
  }

  const PublicRoute = ({ children }) => {
    return !isAuthenticated ? children : <Navigate to="/dashboard" />
  }

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Registration setIsAuthenticated={setIsAuthenticated} />
            </PublicRoute>
          } 
        />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login setIsAuthenticated={setIsAuthenticated} />
            </PublicRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  )
}

export default App

