import { useState, useEffect } from 'react'

export default function SplashScreen({ onComplete }) {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 100)

    // Complete loading after 5 seconds
    const timer = setTimeout(() => {
      setLoading(false)
      setProgress(100)
      if (onComplete) {
        onComplete()
      }
    }, 5000)

    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
    }
  }, [onComplete])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        {/* Logo Container */}
        <div className="mb-8">
          <div className="w-48 h-48 mx-auto mb-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-2xl">
            <img 
              src="/qis collede logo.jpeg" 
              alt="QIS College of Pharmacy Logo" 
              className="w-40 h-40 object-contain rounded-full"
            />
          </div>
        </div>

        {/* College Name */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          QIS College of Pharmacy
        </h1>
        <p className="text-lg md:text-xl text-blue-200 mb-8">
          Sri Nidamanuri Educational Society
        </p>

        {/* Made by text */}
        <div className="mb-8">
          <p className="text-lg text-yellow-300 font-semibold">
            Made by 2ND YEAR ECE-6 STUDENTS
          </p>
        </div>

        {/* Loading Animation */}
        <div className="w-80 mx-auto">
          <div className="flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
            <span className="ml-3 text-white text-lg">Loading...</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-yellow-300 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <p className="text-white/80 text-sm">
            {progress}% Complete
          </p>
        </div>

        {/* Quality is Strength */}
        <div className="mt-12">
          <p className="text-yellow-300 font-semibold text-lg italic">
            "Quality is Strength"
          </p>
        </div>
      </div>
    </div>
  )
}
