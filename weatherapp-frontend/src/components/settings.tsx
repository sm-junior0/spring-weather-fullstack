"use client"

import type React from "react"

import { useState } from "react"
import { SettingsIcon, Bell, Lock, Globe, Moon, Sun, ToggleLeft, ToggleRight, Save, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

export default function Setting() {
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    emailAlerts: true,
    temperatureUnit: "celsius",
    language: "english",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    // Show success message or handle accordingly
  }

  const toggleSetting = (setting: keyof typeof settings) => {
    if (typeof settings[setting] === "boolean") {
      setSettings({
        ...settings,
        [setting]: !settings[setting],
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <SettingsIcon className="h-8 w-8 text-emerald-500 mr-3" />
        <h2 className="text-3xl font-bold text-gray-800">Settings</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-3xl mx-auto"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Appearance Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Moon className="h-5 w-5 mr-2 text-emerald-500" />
                Appearance
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">Dark Mode</p>
                    <p className="text-sm text-gray-500">Switch between light and dark theme</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSetting("darkMode")}
                    className="focus:outline-none"
                    aria-pressed={settings.darkMode}
                  >
                    {settings.darkMode ? (
                      <Sun className="h-6 w-6 text-amber-500" />
                    ) : (
                      <Moon className="h-6 w-6 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Bell className="h-5 w-5 mr-2 text-emerald-500" />
                Notifications
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">Push Notifications</p>
                      <p className="text-sm text-gray-500">Receive app notifications</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSetting("notifications")}
                      className="focus:outline-none"
                      aria-pressed={settings.notifications}
                    >
                      {settings.notifications ? (
                        <ToggleRight className="h-6 w-6 text-emerald-500" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">Email Alerts</p>
                      <p className="text-sm text-gray-500">Receive email notifications</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSetting("emailAlerts")}
                      className="focus:outline-none"
                      aria-pressed={settings.emailAlerts}
                    >
                      {settings.emailAlerts ? (
                        <ToggleRight className="h-6 w-6 text-emerald-500" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Globe className="h-5 w-5 mr-2 text-emerald-500" />
                Preferences
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-800 mb-2">Temperature Unit</p>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="temperatureUnit"
                        value="celsius"
                        checked={settings.temperatureUnit === "celsius"}
                        onChange={() => setSettings({ ...settings, temperatureUnit: "celsius" })}
                        className="form-radio h-4 w-4 text-emerald-600 transition duration-150 ease-in-out"
                      />
                      <span className="ml-2 text-gray-700">Celsius (°C)</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="temperatureUnit"
                        value="fahrenheit"
                        checked={settings.temperatureUnit === "fahrenheit"}
                        onChange={() => setSettings({ ...settings, temperatureUnit: "fahrenheit" })}
                        className="form-radio h-4 w-4 text-emerald-600 transition duration-150 ease-in-out"
                      />
                      <span className="ml-2 text-gray-700">Fahrenheit (°F)</span>
                    </label>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-800 mb-2">Language</p>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                  >
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                    <option value="chinese">Chinese</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Lock className="h-5 w-5 mr-2 text-emerald-500" />
                Security
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-800 mb-2">Change Password</p>
                <button
                  type="button"
                  className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Update Password
                </button>
              </div>
            </div>

            <div className="pt-5 border-t border-gray-200">
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
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Save Settings
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

