"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { weatherApi, cityApi } from "../services/api"
import type { Weather, City } from "../types"
import {
  CloudRain,
  Sun,
  Cloud,
  Wind,
  Droplets,
  Gauge,
  Calendar,
  Filter,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Thermometer,
  MapPin,
  Loader2,
  CloudLightning,
  CloudSnow,
  CloudFog,
  CloudDrizzle,
  CloudSun,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function WeatherList() {
  const [weatherRecords, setWeatherRecords] = useState<Weather[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<number | null>(null)
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  })
  const [editingWeather, setEditingWeather] = useState<Weather | null>(null)
  const [newWeather, setNewWeather] = useState({
    cityId: "",
    temperature: "",
    humidity: "",
    windSpeed: "",
    pressure: "",
    status: "",
    dateRecorded: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  useEffect(() => {
    loadCities()
    loadWeatherRecords()
  }, [])

  const loadCities = async () => {
    try {
      const response = await cityApi.getAll()
      setCities(response.data)
    } catch (error) {
      console.error("Error loading cities:", error)
      setError("Failed to load cities")
    }
  }

  const loadWeatherRecords = async () => {
    setIsLoading(true)
    try {
      const response = await weatherApi.getAll()
      setWeatherRecords(response.data)
    } catch (error) {
      console.error("Error loading weather records:", error)
      setError("Failed to load weather records")
    } finally {
      setIsLoading(false)
    }
  }

  const validateWeatherData = (data: {
    temperature: number
    humidity: number
    windSpeed: number
    pressure: number
    status: string
  }) => {
    if (data.temperature < -50 || data.temperature > 50) {
      throw new Error("Temperature must be between -50 and 50°C")
    }
    if (data.humidity < 0 || data.humidity > 100) {
      throw new Error("Humidity must be between 0 and 100%")
    }
    if (data.windSpeed < 0) {
      throw new Error("Wind speed cannot be negative")
    }
    if (data.pressure < 800 || data.pressure > 1200) {
      throw new Error("Pressure must be between 800 and 1200 hPa")
    }
    if (!data.status.trim()) {
      throw new Error("Weather status cannot be empty")
    }
  }

  const handleCreateWeather = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const city = cities.find((c) => c.id === Number.parseInt(newWeather.cityId))
      if (!city) {
        setError("Please select a valid city")
        return
      }

      const weatherData = {
        city,
        temperature: Number.parseFloat(newWeather.temperature),
        humidity: Number.parseInt(newWeather.humidity),
        windSpeed: Number.parseFloat(newWeather.windSpeed),
        pressure: Number.parseFloat(newWeather.pressure),
        status: newWeather.status,
        dateRecorded: newWeather.dateRecorded,
      }

      validateWeatherData(weatherData)

      await weatherApi.create(weatherData)

      setNewWeather({
        cityId: "",
        temperature: "",
        humidity: "",
        windSpeed: "",
        pressure: "",
        status: "",
        dateRecorded: "",
      })
      loadWeatherRecords()
    } catch (error) {
      console.error("Error creating weather record:", error)
      setError(error instanceof Error ? error.message : "Failed to create weather record")
    }
  }

  const handleUpdateWeather = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!editingWeather) return

    try {
      const city = cities.find((c) => c.id === editingWeather.city.id)
      if (!city) {
        setError("Please select a valid city")
        return
      }

      const weatherData = {
        city,
        temperature: editingWeather.temperature,
        humidity: editingWeather.humidity,
        windSpeed: editingWeather.windSpeed,
        pressure: editingWeather.pressure,
        status: editingWeather.status,
        dateRecorded: editingWeather.dateRecorded,
      }

      validateWeatherData(weatherData)

      const token = localStorage.getItem("token")
      if (!token) {
        setError("Authentication token not found. Please log in again.")
        return
      }

      await weatherApi.update(editingWeather.id, weatherData)
      setEditingWeather(null)
      loadWeatherRecords()
    } catch (error: any) {
      console.error("Error updating weather record:", error)
      if (error.response?.status === 403) {
        setError("Authentication failed. Please log in again.")
      } else {
        setError(error.response?.data?.message || error.message || "Failed to update weather record")
      }
    }
  }

  const handleDeleteWeather = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this weather record?")) {
      return
    }

    try {
      await weatherApi.delete(id)
      loadWeatherRecords()
    } catch (error) {
      console.error("Error deleting weather record:", error)
      setError(error instanceof Error ? error.message : "Failed to delete weather record")
    }
  }

  const handleEditClick = (weather: Weather) => {
    setEditingWeather(weather)
  }

  const handleCancelEdit = () => {
    setEditingWeather(null)
  }

  const handleFilterByCity = async (cityId: number) => {
    try {
      setIsLoading(true)
      const response = await weatherApi.getByCity(cityId)
      setWeatherRecords(response.data)
      setSelectedCity(cityId)
    } catch (error) {
      console.error("Error filtering by city:", error)
      setError("Failed to filter by city")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterByDateRange = async () => {
    if (!selectedCity || !dateRange.startDate || !dateRange.endDate) {
      setError("Please select a city and date range")
      return
    }
    try {
      setIsLoading(true)
      const response = await weatherApi.getByDateRange(selectedCity, dateRange.startDate, dateRange.endDate)
      setWeatherRecords(response.data)
    } catch (error) {
      console.error("Error filtering by date range:", error)
      setError("Failed to filter by date range")
    } finally {
      setIsLoading(false)
    }
  }

  const resetFilters = async () => {
    setSelectedCity(null)
    setDateRange({ startDate: "", endDate: "" })
    loadWeatherRecords()
  }

  // Function to get weather icon based on status
  const getWeatherIcon = (status: string) => {
    const statusLower = status.toLowerCase()
    if (statusLower.includes("rain")) return <CloudRain className="h-5 w-5 text-blue-500" />
    if (statusLower.includes("sun") || statusLower.includes("clear")) return <Sun className="h-5 w-5 text-yellow-500" />
    if (statusLower.includes("cloud") && statusLower.includes("sun"))
      return <CloudSun className="h-5 w-5 text-yellow-400" />
    if (statusLower.includes("cloud")) return <Cloud className="h-5 w-5 text-gray-500" />
    if (statusLower.includes("storm") || statusLower.includes("thunder"))
      return <CloudLightning className="h-5 w-5 text-purple-500" />
    if (statusLower.includes("snow")) return <CloudSnow className="h-5 w-5 text-blue-300" />
    if (statusLower.includes("fog") || statusLower.includes("mist"))
      return <CloudFog className="h-5 w-5 text-gray-400" />
    if (statusLower.includes("drizzle")) return <CloudDrizzle className="h-5 w-5 text-blue-400" />
    return <Sun className="h-5 w-5 text-yellow-500" />
  }

  // Function to get temperature color
  const getTemperatureColor = (temp: number) => {
    if (temp >= 30) return "text-red-600"
    if (temp >= 20) return "text-orange-500"
    if (temp >= 10) return "text-yellow-500"
    if (temp >= 0) return "text-green-500"
    return "text-blue-500"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <CloudRain className="h-8 w-8 text-emerald-500 mr-3" />
        <h2 className="text-3xl font-bold text-gray-800">Weather Records</h2>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start"
          >
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create/Edit Weather Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100"
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
          {editingWeather ? (
            <>
              <Edit className="h-5 w-5 mr-2 text-amber-500" />
              Edit Weather Record
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 mr-2 text-emerald-500" />
              Create New Weather Record
            </>
          )}
        </h3>
        <form onSubmit={editingWeather ? handleUpdateWeather : handleCreateWeather} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                title="City"
                value={editingWeather ? editingWeather.city.id : newWeather.cityId}
                onChange={(e) =>
                  editingWeather
                    ? setEditingWeather({
                        ...editingWeather,
                        city: cities.find((c) => c.id === Number.parseInt(e.target.value))!,
                      })
                    : setNewWeather({ ...newWeather, cityId: e.target.value })
                }
                className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all appearance-none"
                required
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}, {city.country}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Thermometer className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="number"
                placeholder="Temperature (°C)"
                value={editingWeather ? editingWeather.temperature : newWeather.temperature}
                onChange={(e) =>
                  editingWeather
                    ? setEditingWeather({ ...editingWeather, temperature: Number.parseFloat(e.target.value) })
                    : setNewWeather({ ...newWeather, temperature: e.target.value })
                }
                className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                required
              />
            </div>
            <div className="relative">
              <Droplets className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="number"
                placeholder="Humidity (%)"
                value={editingWeather ? editingWeather.humidity : newWeather.humidity}
                onChange={(e) =>
                  editingWeather
                    ? setEditingWeather({ ...editingWeather, humidity: Number.parseInt(e.target.value) })
                    : setNewWeather({ ...newWeather, humidity: e.target.value })
                }
                className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                required
              />
            </div>
            <div className="relative">
              <Wind className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="number"
                placeholder="Wind Speed (km/h)"
                value={editingWeather ? editingWeather.windSpeed : newWeather.windSpeed}
                onChange={(e) =>
                  editingWeather
                    ? setEditingWeather({ ...editingWeather, windSpeed: Number.parseFloat(e.target.value) })
                    : setNewWeather({ ...newWeather, windSpeed: e.target.value })
                }
                className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                required
              />
            </div>
            <div className="relative">
              <Gauge className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="number"
                placeholder="Pressure (hPa)"
                value={editingWeather ? editingWeather.pressure : newWeather.pressure}
                onChange={(e) =>
                  editingWeather
                    ? setEditingWeather({ ...editingWeather, pressure: Number.parseFloat(e.target.value) })
                    : setNewWeather({ ...newWeather, pressure: e.target.value })
                }
                className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                required
              />
            </div>
            <div className="relative">
              <Cloud className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                title="Status"
                type="text"
                placeholder="Status (e.g., Sunny, Rainy)"
                value={editingWeather ? editingWeather.status : newWeather.status}
                onChange={(e) =>
                  editingWeather
                    ? setEditingWeather({ ...editingWeather, status: e.target.value })
                    : setNewWeather({ ...newWeather, status: e.target.value })
                }
                className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                required
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                title="Date Recorded"
                type="datetime-local"
                value={editingWeather ? editingWeather.dateRecorded : newWeather.dateRecorded}
                onChange={(e) =>
                  editingWeather
                    ? setEditingWeather({ ...editingWeather, dateRecorded: e.target.value })
                    : setNewWeather({ ...newWeather, dateRecorded: e.target.value })
                }
                className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                required
              />
            </div>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className={`px-6 py-2 rounded-lg text-white flex items-center ${editingWeather ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-500 hover:bg-emerald-600"} transition-colors`}
            >
              {editingWeather ? (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Update
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create
                </>
              )}
            </motion.button>
            {editingWeather && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </motion.button>
            )}
          </div>
        </form>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center text-gray-800">
            <Filter className="h-5 w-5 mr-2 text-emerald-500" />
            Filters
          </h3>
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            {isFiltersOpen ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <AnimatePresence>
          {isFiltersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="filterCity" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                      id="filterCity"
                      value={selectedCity || ""}
                      onChange={(e) => handleFilterByCity(Number.parseInt(e.target.value))}
                      className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all appearance-none"
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}, {city.country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="startDate"
                      type="datetime-local"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                      className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="endDate"
                      type="datetime-local"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                      className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleFilterByDateRange}
                  className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filters
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetFilters}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Reset
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Weather Records Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">Weather Records</h3>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
          </div>
        ) : weatherRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Temperature
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Humidity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wind Speed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pressure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Recorded
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {weatherRecords.map((weather, index) => (
                  <motion.tr
                    key={weather.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                        <span>
                          {weather.city.name}, {weather.city.country}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Thermometer className="h-4 w-4 mr-2" />
                        <span className={getTemperatureColor(weather.temperature)}>{weather.temperature}°C</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Droplets className="h-4 w-4 text-blue-500 mr-2" />
                        {weather.humidity}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Wind className="h-4 w-4 text-gray-500 mr-2" />
                        {weather.windSpeed} km/h
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Gauge className="h-4 w-4 text-gray-500 mr-2" />
                        {weather.pressure} hPa
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getWeatherIcon(weather.status)}
                        <span className="ml-2">{weather.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                        {new Date(weather.dateRecorded).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditClick(weather)}
                          className="text-amber-500 hover:text-amber-600 transition-colors p-1"
                          aria-label="Edit weather record"
                        >
                          <Edit className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteWeather(weather.id)}
                          className="text-red-500 hover:text-red-600 transition-colors p-1"
                          aria-label="Delete weather record"
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50">
            <CloudRain className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500 text-lg">No weather records found.</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
