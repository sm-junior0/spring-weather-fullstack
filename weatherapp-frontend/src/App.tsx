"use client"

import type React from "react"
import { useState } from "react"
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import Login from "./components/Login"
import Register from "./components/Register"
import WeatherList from "./components/WeatherList"
import CityList from "./components/CityList"
import Setting from "./components/Settings"
import Help from "./components/Help"
import Profile from "./components/Profile"
import { useAuth } from "./contexts/AuthContext"
import { CloudRain, Building2, LogOut, Menu, X, User, ChevronDown, Settings, HelpCircle, Moon, Sun } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import "./App.css"

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

const Navbar: React.FC = () => {
  const { logout, user } = useAuth()
  const firstLetter = user?.username ? user.username.charAt(0).toUpperCase() : ""
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // In a real app, you would apply dark mode classes to the document here
  }

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <CloudRain className="h-8 w-8 text-emerald-500" />
              <span className="ml-2 text-xl font-semibold text-gray-800">WeatherApp</span>
            </Link>

            <div className="hidden md:flex ml-10 space-x-1">
              <Link
                to="/"
                className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
              >
                <CloudRain className="h-4 w-4 mr-2" />
                Weather
              </Link>
              <Link
                to="/cities"
                className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Cities
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5 text-gray-600" /> : <Moon className="h-5 w-5 text-gray-600" />}
            </button>

            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-semibold">
                  {firstLetter}
                </div>
                <span className="text-gray-700 font-medium">{user?.username}</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                    <Link
                      to="/help"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Help
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <CloudRain className="h-5 w-5 mr-2" />
                Weather
              </Link>
              <Link
                to="/cities"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Building2 className="h-5 w-5 mr-2" />
                Cities
              </Link>
              <div className="border-t border-gray-200 my-2"></div>
              <button
                onClick={toggleDarkMode}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 flex items-center"
              >
                {isDarkMode ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </button>
              <button
                onClick={logout}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 flex items-center"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register"

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && !isAuthPage && <Navbar />}
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <WeatherList />
              </PrivateRoute>
            }
          />
          <Route
            path="/cities"
            element={
              <PrivateRoute>
                <CityList />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Setting />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>

      {isAuthenticated && !isAuthPage && (
        <footer className="bg-white border-t border-gray-200 py-4 mt-8">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} WeatherApp. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
