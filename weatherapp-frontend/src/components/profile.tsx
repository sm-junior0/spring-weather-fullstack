"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { User, Mail, Camera, Save, Loader2, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    avatar: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        avatar: user.avatar || "",
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Assuming updateProfile is implemented in your AuthContext
      await updateProfile(formData)
      setSuccess("Profile updated successfully!")
    } catch (error: any) {
      setError(error.message || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <User className="h-8 w-8 text-emerald-500 mr-3" />
        <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-2xl mx-auto"
      >
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
            <Save className="h-5 w-5 mr-2" />
            {success}
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center mb-8">
          <div className="relative mb-6 md:mb-0 md:mr-8">
            <div className="w-32 h-32 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500 text-4xl font-bold overflow-hidden">
              {formData.avatar ? (
                <img src={formData.avatar || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                formData.username.charAt(0).toUpperCase()
              )}
            </div>
            <button title="Upload Avatar" className="absolute bottom-0 right-0 bg-emerald-500 text-white p-2 rounded-full hover:bg-emerald-600 transition-colors">
              <Camera className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading ? "bg-emerald-400" : "bg-emerald-600 hover:bg-emerald-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Save Changes
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>

        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500">Member Since</p>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500">Last Login</p>
              <p className="font-medium">{new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
