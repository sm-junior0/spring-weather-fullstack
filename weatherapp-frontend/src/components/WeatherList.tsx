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
  X,
  Search,
  RefreshCw,
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
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

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
      setShowAddForm(false)
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
      setShowEditForm(false)
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
    setShowEditForm(true)
  }

  const handleCancelEdit = () => {
    setEditingWeather(null)
    setShowEditForm(false)
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
    setSearchTerm("")
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

  // Function to get large weather icon based on status
  const getLargeWeatherIcon = (status: string) => {
    const statusLower = status.toLowerCase()
    if (statusLower.includes("rain")) return <CloudRain className="h-16 w-16 text-blue-500" />
    if (statusLower.includes("sun") || statusLower.includes("clear"))
      return <Sun className="h-16 w-16 text-yellow-500" />
    if (statusLower.includes("cloud") && statusLower.includes("sun"))
      return <CloudSun className="h-16 w-16 text-yellow-400" />
    if (statusLower.includes("cloud")) return <Cloud className="h-16 w-16 text-gray-500" />
    if (statusLower.includes("storm") || statusLower.includes("thunder"))
      return <CloudLightning className="h-16 w-16 text-purple-500" />
    if (statusLower.includes("snow")) return <CloudSnow className="h-16 w-16 text-blue-300" />
    if (statusLower.includes("fog") || statusLower.includes("mist"))
      return <CloudFog className="h-16 w-16 text-gray-400" />
    if (statusLower.includes("drizzle")) return <CloudDrizzle className="h-16 w-16 text-blue-400" />
    return <Sun className="h-16 w-16 text-yellow-500" />
  }

  // Function to get temperature color
  const getTemperatureColor = (temp: number) => {
    if (temp >= 30) return "text-red-600"
    if (temp >= 20) return "text-orange-500"
    if (temp >= 10) return "text-yellow-500"
    if (temp >= 0) return "text-green-500"
    return "text-blue-500"
  }

  // Function to get temperature background color
  const getTemperatureBgColor = (temp: number) => {
    if (temp >= 30) return "bg-red-100"
    if (temp >= 20) return "bg-orange-100"
    if (temp >= 10) return "bg-yellow-100"
    if (temp >= 0) return "bg-green-100"
    return "bg-blue-100"
  }

  // Filter weather records by search term
  const filteredWeatherRecords = weatherRecords.filter((weather) => {
    if (!searchTerm) return true

    const searchLower = searchTerm.toLowerCase()
    return (
      weather.city.name.toLowerCase().includes(searchLower) ||
      weather.city.country.toLowerCase().includes(searchLower) ||
      weather.status.toLowerCase().includes(searchLower) ||
      weather.temperature.toString().includes(searchLower)
    )
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <CloudRain className="h-8 w-8 text-emerald-500 mr-3" />
          <h2 className="text-3xl font-bold text-gray-800">Weather Records</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Weather Record
        </motion.button>
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

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div className="flex items-center">
            <Filter className="h-5 w-5 mr-2 text-emerald-500" />
            <h3 className="text-xl font-semibold text-gray-800">Filters</h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search weather records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center whitespace-nowrap"
              >
                <Filter className="h-4 w-4 mr-1" />
                {isFiltersOpen ? "Hide Filters" : "Show Filters"}
              </button>

              <button
                onClick={resetFilters}
                className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                title="Reset filters"
              >
                <RefreshCw className="h-4 w-4" />
              </button>

              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 ${viewMode === "grid" ? "bg-emerald-500 text-white" : "bg-white text-gray-700"}`}
                  title="Grid view"
                >
                  <div className="grid grid-cols-2 gap-0.5">
                    <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                    <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                    <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                    <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 ${viewMode === "list" ? "bg-emerald-500 text-white" : "bg-white text-gray-700"}`}
                  title="List view"
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="w-4 h-1.5 bg-current rounded-sm"></div>
                    <div className="w-4 h-1.5 bg-current rounded-sm"></div>
                    <div className="w-4 h-1.5 bg-current rounded-sm"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Weather Records */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
        </div>
      ) : filteredWeatherRecords.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWeatherRecords.map((weather, index) => (
              <motion.div
                key={weather.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 overflow-hidden"
              >
                <div className={`p-6 flex flex-col items-center ${getTemperatureBgColor(weather.temperature)}`}>
                  {getLargeWeatherIcon(weather.status)}
                  <h3 className="text-2xl font-bold mt-3 mb-1 text-center">{weather.city.name}</h3>
                  <p className="text-gray-600 mb-2">{weather.city.country}</p>
                  <div className={`text-4xl font-bold ${getTemperatureColor(weather.temperature)}`}>
                    {weather.temperature}°C
                  </div>
                  <p className="text-gray-700 mt-1">{weather.status}</p>
                </div>

                <div className="p-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-sm flex items-center">
                        <Droplets className="h-4 w-4 mr-1 text-blue-500" /> Humidity
                      </span>
                      <span className="font-medium">{weather.humidity}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-sm flex items-center">
                        <Wind className="h-4 w-4 mr-1 text-gray-500" /> Wind
                      </span>
                      <span className="font-medium">{weather.windSpeed} km/h</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-sm flex items-center">
                        <Gauge className="h-4 w-4 mr-1 text-gray-500" /> Pressure
                      </span>
                      <span className="font-medium">{weather.pressure} hPa</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-sm flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-500" /> Date
                      </span>
                      <span className="font-medium text-xs">{new Date(weather.dateRecorded).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4 space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEditClick(weather)}
                      className="bg-amber-100 text-amber-600 p-2 rounded-lg hover:bg-amber-200 transition-colors"
                      aria-label="Edit weather record"
                    >
                      <Edit className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteWeather(weather.id)}
                      className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors"
                      aria-label="Delete weather record"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {filteredWeatherRecords.map((weather, index) => (
                <motion.div
                  key={weather.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center mb-3 md:mb-0">
                      <div className={`p-3 rounded-lg mr-4 ${getTemperatureBgColor(weather.temperature)}`}>
                        {getWeatherIcon(weather.status)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                          {weather.city.name}, {weather.city.country}
                        </h3>
                        <p className="text-gray-600 text-sm">{weather.status}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 md:gap-6">
                      <div className="flex items-center">
                        <Thermometer className="h-4 w-4 mr-1" />
                        <span className={`font-bold ${getTemperatureColor(weather.temperature)}`}>
                          {weather.temperature}°C
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Droplets className="h-4 w-4 mr-1 text-blue-500" />
                        <span>{weather.humidity}%</span>
                      </div>
                      <div className="flex items-center">
                        <Wind className="h-4 w-4 mr-1 text-gray-500" />
                        <span>{weather.windSpeed} km/h</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                        <span className="text-sm">{new Date(weather.dateRecorded).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex mt-3 md:mt-0">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditClick(weather)}
                        className="text-amber-500 hover:text-amber-600 transition-colors p-1 mr-2"
                        aria-label="Edit weather record"
                      >
                        <Edit className="h-5 w-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteWeather(weather.id)}
                        className="text-red-500 hover:text-red-600 transition-colors p-1"
                        aria-label="Delete weather record"
                      >
                        <Trash2 className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-200">
          <CloudRain className="h-16 w-16 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500 text-lg">No weather records found.</p>
          <p className="text-gray-500 mt-2">Try adjusting your filters or add a new weather record.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="mt-6 bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors inline-flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Weather Record
          </motion.button>
        </div>
      )}

      {/* Add Weather Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Plus className="h-5 w-5 mr-2 text-emerald-500" />
                  Add New Weather Record
                </h3>
                <button
                  type="button"
                  title="Close"
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={handleCreateWeather} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cityId" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <select
                          id="cityId"
                          value={newWeather.cityId}
                          onChange={(e) => setNewWeather({ ...newWeather, cityId: e.target.value })}
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
                    </div>
                    <div>
                      <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">
                        Temperature (°C)
                      </label>
                      <div className="relative">
                        <Thermometer className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          id="temperature"
                          type="number"
                          step="0.1"
                          placeholder="Temperature"
                          value={newWeather.temperature}
                          onChange={(e) => setNewWeather({ ...newWeather, temperature: e.target.value })}
                          className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="humidity" className="block text-sm font-medium text-gray-700 mb-1">
                        Humidity (%)
                      </label>
                      <div className="relative">
                        <Droplets className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          id="humidity"
                          type="number"
                          placeholder="Humidity"
                          value={newWeather.humidity}
                          onChange={(e) => setNewWeather({ ...newWeather, humidity: e.target.value })}
                          className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="windSpeed" className="block text-sm font-medium text-gray-700 mb-1">
                        Wind Speed (km/h)
                      </label>
                      <div className="relative">
                        <Wind className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          id="windSpeed"
                          type="number"
                          step="0.1"
                          placeholder="Wind Speed"
                          value={newWeather.windSpeed}
                          onChange={(e) => setNewWeather({ ...newWeather, windSpeed: e.target.value })}
                          className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="pressure" className="block text-sm font-medium text-gray-700 mb-1">
                        Pressure (hPa)
                      </label>
                      <div className="relative">
                        <Gauge className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          id="pressure"
                          type="number"
                          placeholder="Pressure"
                          value={newWeather.pressure}
                          onChange={(e) => setNewWeather({ ...newWeather, pressure: e.target.value })}
                          className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <div className="relative">
                        <Cloud className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          id="status"
                          type="text"
                          placeholder="Weather Status (e.g., Sunny, Rainy)"
                          value={newWeather.status}
                          onChange={(e) => setNewWeather({ ...newWeather, status: e.target.value })}
                          className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="dateRecorded" className="block text-sm font-medium text-gray-700 mb-1">
                        Date Recorded
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          id="dateRecorded"
                          type="datetime-local"
                          value={newWeather.dateRecorded}
                          onChange={(e) => setNewWeather({ ...newWeather, dateRecorded: e.target.value })}
                          className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Weather Modal */}
      <AnimatePresence>
        {showEditForm && editingWeather && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Edit className="h-5 w-5 mr-2 text-amber-500" />
                  Edit Weather Record
                </h3>
                <button title="Close" onClick={handleCancelEdit} className="text-gray-500 hover:text-gray-700 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={handleUpdateWeather} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="editCity" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <select
                          id="editCity"
                          value={editingWeather.city.id}
                          onChange={(e) =>
                            setEditingWeather({
                              ...editingWeather,
                              city: cities.find((c) => c.id === Number.parseInt(e.target.value))!,
                            })
                          }
                          className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all appearance-none"
                          required
                        >
                          {cities.map((city) => (
                            <option key={city.id} value={city.id}>
                              {city.name}, {city.country}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="editTemperature" className="block text-sm font-medium text-gray-700 mb-1">
                        Temperature (°C)
                      </label>
                      <div className="relative">
                        <Thermometer className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          id="editTemperature"
                          type="number"
                          step="0.1"
                          value={editingWeather.temperature}
                          onChange={(e) =>
                            setEditingWeather({
                              ...editingWeather,
                              temperature: Number.parseFloat(e.target.value),
                            })
                          }
                          className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="editHumidity" className="block text-sm font-medium text-gray-700 mb-1">
                        Humidity (%)
                      </label>
                      <div className="relative">
                        <Droplets className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          id="editHumidity"
                          type="number"
                          value={editingWeather.humidity}
                          onChange={(e) =>
                            setEditingWeather({
                              ...editingWeather,
                              humidity: Number.parseInt(e.target.value),
                            })
                          }
                          className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="editWindSpeed" className="block text-sm font-medium text-gray-700 mb-1">
                        Wind Speed (km/h)
                      </label>
                      <div className="relative">
                        <Wind className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          id="editWindSpeed"
                          type="number"
                          step="0.1"
                          value={editingWeather.windSpeed}
                          onChange={(e) =>
                            setEditingWeather({
                              ...editingWeather,
                              windSpeed: Number.parseFloat(e.target.value),
                            })
                          }
                          className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="editPressure" className="block text-sm font-medium text-gray-700 mb-1">
                        Pressure (hPa)
                      </label>
                      <div className="relative">
                        <Gauge className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          id="editPressure"
                          type="number"
                          value={editingWeather.pressure}
                          onChange={(e) =>
                            setEditingWeather({
                              ...editingWeather,
                              pressure: Number.parseFloat(e.target.value),
                            })
                          }
                          className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="editStatus" className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <div className="relative">
                        <Cloud className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          id="editStatus"
                          type="text"
                          value={editingWeather.status}
                          onChange={(e) =>
                            setEditingWeather({
                              ...editingWeather,
                              status: e.target.value,
                            })
                          }
                          className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="editDateRecorded" className="block text-sm font-medium text-gray-700 mb-1">
                        Date Recorded
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          id="editDateRecorded"
                          type="datetime-local"
                          value={editingWeather.dateRecorded}
                          onChange={(e) =>
                            setEditingWeather({
                              ...editingWeather,
                              dateRecorded: e.target.value,
                            })
                          }
                          className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Update
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
