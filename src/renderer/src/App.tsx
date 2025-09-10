
import React, { useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Projects from "./pages/Projects"
import ProjectDetails from "./pages/ProjectDetails"
import Settings from "./pages/Settings"
import './global.css'
import SideBar from "./components/SideBar"

function App(): React.JSX.Element {
  const [isTracking, setIsTracking] = useState(true)

  React.useEffect(() => {
    // Listen for tracking status changes
    const cleanup = window.api.onTrackingStatus((status) => {
      setIsTracking(status.active)
    })

    return cleanup
  }, [])

  return (
    <Router>
      <div className="flex w-screen h-screen bg-gray-100">
        <SideBar/>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
