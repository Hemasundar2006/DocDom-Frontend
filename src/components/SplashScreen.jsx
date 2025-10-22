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
    <div className="h-screen w-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-sm mx-auto px-4 text-center flex flex-col items-center justify-center">
        {/* Logo Container */}
        <div className="mb-6">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-2xl">
            <img 
              src="/qis collede logo.jpeg" 
              alt="IS College of Engineering and Technology logo" 
              className="w-24 h-24 object-contain rounded-full"
            />
          </div>
        </div>

        {/* College Name */}
        <h1 className="text-xl font-bold text-white mb-2 leading-tight px-2">
          QIS College of Engineering and Technology
        </h1>
        <p className="text-sm text-blue-200 mb-4 px-2">
          Sri Nidamanuri Educational Society
        </p>

        {/* Made by text */}
        <div className="mb-6">
          <p className="text-sm text-yellow-300 font-semibold px-2">
            Made by 2nd Year ECE-6 Students 
          </p>
        </div>

        {/* Loading Animation */}
        <div className="w-full px-2">
          <div className="flex items-center justify-center mb-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400"></div>
            <span className="ml-2 text-white text-sm">Loading...</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-1.5 mb-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-yellow-300 h-1.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <p className="text-white/80 text-xs">
            {progress}% Complete
          </p>
        </div>

        {/* Quality is Strength */}
        <div className="mt-6">
          <p className="text-yellow-300 font-semibold text-sm italic px-2">
            "Quality is Strength"
          </p>
        </div>
      </div>
    </div>
  )
}
