import { RouterProvider } from "react-router-dom"
import { useState, useEffect } from "react"
import { useUser } from "./hooks/useUser"
import router from "./routes/Routes"

const App = () => {
  const [loading, setLoading] = useState(true)
  const { profileHandler } = useUser()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await profileHandler()
      } catch (error) {
        // User not authenticated - that's okay
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-stone-200 border-t-stone-600 mx-auto"></div>
          <p className="text-stone-400 mt-3 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <RouterProvider router={router} />
  )
}

export default App
