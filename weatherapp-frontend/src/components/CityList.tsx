"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cityApi } from "../services/api"
import type { City } from "../types"
import { Building2, Edit, Trash2, Plus, MapPin, Globe, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

export default function CityList() {
  const [cities, setCities] = useState<City[]>([])
  const [newCity, setNewCity] = useState({ name: "", country: "" })
  const [editingCity, setEditingCity] = useState<City | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCities()
  }, [])

  const loadCities = async () => {
    setIsLoading(true)
    try {
      const response = await cityApi.getAll()
      setCities(response.data)
    } catch (error) {
      console.error("Error loading cities:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCity = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await cityApi.create(newCity)
      setNewCity({ name: "", country: "" })
      loadCities()
    } catch (error) {
      console.error("Error creating city:", error)
    }
  }

  const handleUpdateCity = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCity) return
    try {
      await cityApi.update(editingCity.id, {
        name: editingCity.name,
        country: editingCity.country,
      })
      setEditingCity(null)
      loadCities()
    } catch (error) {
      console.error("Error updating city:", error)
    }
  }

  const handleDeleteCity = async (id: number) => {
    try {
      await cityApi.delete(id)
      loadCities()
    } catch (error) {
      console.error("Error deleting city:", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Building2 className="h-8 w-8 text-emerald-500 mr-3" />
        <h2 className="text-3xl font-bold text-gray-800">Cities</h2>
      </div>

      {/* Create City Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100"
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
          <Plus className="h-5 w-5 mr-2 text-emerald-500" />
          Add New City
        </h3>
        <form onSubmit={handleCreateCity}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="City Name"
                value={newCity.name}
                onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
                className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                required
              />
            </div>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Country"
                value={newCity.country}
                onChange={(e) => setNewCity({ ...newCity, country: e.target.value })}
                className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                required
              />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="mt-4 bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add City
          </motion.button>
        </form>
      </motion.div>

      {/* Cities List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city, index) => (
            <motion.div
              key={city.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100"
            >
              {editingCity?.id === city.id ? (
                <form onSubmit={handleUpdateCity} className="space-y-3">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      title="edit"
                      type="text"
                      value={editingCity.name}
                      onChange={(e) => setEditingCity({ ...editingCity, name: e.target.value })}
                      className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      title="edit"
                      type="text"
                      value={editingCity.country}
                      onChange={(e) => setEditingCity({ ...editingCity, country: e.target.value })}
                      className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Save
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setEditingCity(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-emerald-500" />
                        {city.name}
                      </h3>
                      <p className="text-gray-600 mt-1 flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-gray-400" />
                        {city.country}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setEditingCity(city)}
                        className="bg-amber-100 text-amber-600 p-2 rounded-lg hover:bg-amber-200 transition-colors"
                        aria-label="Edit city"
                      >
                        <Edit className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteCity(city.id)}
                        className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors"
                        aria-label="Delete city"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {cities.length === 0 && !isLoading && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500 text-lg">No cities found. Add your first city above!</p>
        </div>
      )}
    </div>
  )
}
