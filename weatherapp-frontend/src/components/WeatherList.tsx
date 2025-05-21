import { useState, useEffect } from 'react';
import { weatherApi, cityApi } from '../services/api';
import type { Weather, City } from '../types';

export default function WeatherList() {
    const [weatherRecords, setWeatherRecords] = useState<Weather[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [selectedCity, setSelectedCity] = useState<number | null>(null);
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: '',
    });
    const [editingWeather, setEditingWeather] = useState<Weather | null>(null);
    const [newWeather, setNewWeather] = useState({
        cityId: '',
        temperature: '',
        humidity: '',
        windSpeed: '',
        pressure: '',
        status: '',
        dateRecorded: '',
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadCities();
        loadWeatherRecords();
    }, []);

    const loadCities = async () => {
        try {
            const response = await cityApi.getAll();
            setCities(response.data);
        } catch (error) {
            console.error('Error loading cities:', error);
            setError('Failed to load cities');
        }
    };

    const loadWeatherRecords = async () => {
        try {
            const response = await weatherApi.getAll();
            setWeatherRecords(response.data);
        } catch (error) {
            console.error('Error loading weather records:', error);
            setError('Failed to load weather records');
        }
    };

    const validateWeatherData = (data: {
        temperature: number;
        humidity: number;
        windSpeed: number;
        pressure: number;
        status: string;
    }) => {
        if (data.temperature < -50 || data.temperature > 50) {
            throw new Error('Temperature must be between -50 and 50°C');
        }
        if (data.humidity < 0 || data.humidity > 100) {
            throw new Error('Humidity must be between 0 and 100%');
        }
        if (data.windSpeed < 0) {
            throw new Error('Wind speed cannot be negative');
        }
        if (data.pressure < 800 || data.pressure > 1200) {
            throw new Error('Pressure must be between 800 and 1200 hPa');
        }
        if (!data.status.trim()) {
            throw new Error('Weather status cannot be empty');
        }
    };

    const handleCreateWeather = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const city = cities.find(c => c.id === parseInt(newWeather.cityId));
            if (!city) {
                setError('Please select a valid city');
                return;
            }

            const weatherData = {
                city,
                temperature: parseFloat(newWeather.temperature),
                humidity: parseInt(newWeather.humidity),
                windSpeed: parseFloat(newWeather.windSpeed),
                pressure: parseFloat(newWeather.pressure),
                status: newWeather.status,
                dateRecorded: newWeather.dateRecorded,
            };

            validateWeatherData(weatherData);

            await weatherApi.create(weatherData);

            setNewWeather({
                cityId: '',
                temperature: '',
                humidity: '',
                windSpeed: '',
                pressure: '',
                status: '',
                dateRecorded: '',
            });
            loadWeatherRecords();
        } catch (error) {
            console.error('Error creating weather record:', error);
            setError(error instanceof Error ? error.message : 'Failed to create weather record');
        }
    };

    const handleUpdateWeather = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!editingWeather) return;

        try {
            const city = cities.find(c => c.id === editingWeather.city.id);
            if (!city) {
                setError('Please select a valid city');
                return;
            }

            const weatherData = {
                city,
                temperature: editingWeather.temperature,
                humidity: editingWeather.humidity,
                windSpeed: editingWeather.windSpeed,
                pressure: editingWeather.pressure,
                status: editingWeather.status,
                dateRecorded: editingWeather.dateRecorded,
            };

            // Validate the data before sending
            validateWeatherData(weatherData);

            // Check if token exists
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found. Please log in again.');
                return;
            }

            console.log('Updating weather record:', {
                id: editingWeather.id,
                data: weatherData
            });

            await weatherApi.update(editingWeather.id, weatherData);
            setEditingWeather(null);
            loadWeatherRecords();
        } catch (error: any) {
            console.error('Error updating weather record:', error);
            if (error.response?.status === 403) {
                setError('Authentication failed. Please log in again.');
            } else {
                setError(error.response?.data?.message || error.message || 'Failed to update weather record');
            }
        }
    };

    const handleDeleteWeather = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this weather record?')) {
            return;
        }

        try {
            await weatherApi.delete(id);
            loadWeatherRecords();
        } catch (error) {
            console.error('Error deleting weather record:', error);
            setError(error instanceof Error ? error.message : 'Failed to delete weather record');
        }
    };

    const handleEditClick = (weather: Weather) => {
        setEditingWeather(weather);
    };

    const handleCancelEdit = () => {
        setEditingWeather(null);
    };

    const handleFilterByCity = async (cityId: number) => {
        try {
            const response = await weatherApi.getByCity(cityId);
            setWeatherRecords(response.data);
            setSelectedCity(cityId);
        } catch (error) {
            console.error('Error filtering by city:', error);
            setError('Failed to filter by city');
        }
    };

    const handleFilterByDateRange = async () => {
        if (!selectedCity || !dateRange.startDate || !dateRange.endDate) {
            setError('Please select a city and date range');
            return;
        }
        try {
            const response = await weatherApi.getByDateRange(
                selectedCity,
                dateRange.startDate,
                dateRange.endDate
            );
            setWeatherRecords(response.data);
        } catch (error) {
            console.error('Error filtering by date range:', error);
            setError('Failed to filter by date range');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Weather Records</h2>

            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {/* Create/Edit Weather Form */}
            <form onSubmit={editingWeather ? handleUpdateWeather : handleCreateWeather} className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                    {editingWeather ? 'Edit Weather Record' : 'Create New Weather Record'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <select
                        title='City'
                        value={editingWeather ? editingWeather.city.id : newWeather.cityId}
                        onChange={(e) => editingWeather 
                            ? setEditingWeather({...editingWeather, city: cities.find(c => c.id === parseInt(e.target.value))!})
                            : setNewWeather({...newWeather, cityId: e.target.value})}
                        className="border p-2 rounded"
                        required
                    >
                        <option value="">Select City</option>
                        {cities.map(city => (
                            <option key={city.id} value={city.id}>{city.name}, {city.country}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="Temperature"
                        value={editingWeather ? editingWeather.temperature : newWeather.temperature}
                        onChange={(e) => editingWeather
                            ? setEditingWeather({...editingWeather, temperature: parseFloat(e.target.value)})
                            : setNewWeather({...newWeather, temperature: e.target.value})}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Humidity"
                        value={editingWeather ? editingWeather.humidity : newWeather.humidity}
                        onChange={(e) => editingWeather
                            ? setEditingWeather({...editingWeather, humidity: parseInt(e.target.value)})
                            : setNewWeather({...newWeather, humidity: e.target.value})}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Wind Speed"
                        value={editingWeather ? editingWeather.windSpeed : newWeather.windSpeed}
                        onChange={(e) => editingWeather
                            ? setEditingWeather({...editingWeather, windSpeed: parseFloat(e.target.value)})
                            : setNewWeather({...newWeather, windSpeed: e.target.value})}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Pressure"
                        value={editingWeather ? editingWeather.pressure : newWeather.pressure}
                        onChange={(e) => editingWeather
                            ? setEditingWeather({...editingWeather, pressure: parseFloat(e.target.value)})
                            : setNewWeather({...newWeather, pressure: e.target.value})}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        title='Status'
                        type="text"
                        placeholder="Status"
                        value={editingWeather ? editingWeather.status : newWeather.status}
                        onChange={(e) => editingWeather
                            ? setEditingWeather({...editingWeather, status: e.target.value})
                            : setNewWeather({...newWeather, status: e.target.value})}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        title='Date Recorded'
                        type="datetime-local"
                        value={editingWeather ? editingWeather.dateRecorded : newWeather.dateRecorded}
                        onChange={(e) => editingWeather
                            ? setEditingWeather({...editingWeather, dateRecorded: e.target.value})
                            : setNewWeather({...newWeather, dateRecorded: e.target.value})}
                        className="border p-2 rounded"
                        required
                    />
                </div>
                <div className="mt-4">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {editingWeather ? 'Update' : 'Create'}
                    </button>
                    {editingWeather && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {/* Filters */}
            <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="filterCity" className="block text-sm font-medium text-gray-700 mb-1">
                            City
                        </label>
                        <select
                            id="filterCity"
                            value={selectedCity || ''}
                            onChange={(e) => handleFilterByCity(parseInt(e.target.value))}
                            className="border p-2 rounded w-full"
                        >
                            <option value="">Select City</option>
                            {cities.map((city) => (
                                <option key={city.id} value={city.id}>
                                    {city.name}, {city.country}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                        </label>
                        <input
                            id="startDate"
                            type="datetime-local"
                            value={dateRange.startDate}
                            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                        </label>
                        <input
                            id="endDate"
                            type="datetime-local"
                            value={dateRange.endDate}
                            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                </div>
                <button
                    onClick={handleFilterByDateRange}
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Apply Filters
                </button>
            </div>

            {/* Weather Records Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 border-b">City</th>
                            <th className="px-6 py-3 border-b">Temperature</th>
                            <th className="px-6 py-3 border-b">Humidity</th>
                            <th className="px-6 py-3 border-b">Wind Speed</th>
                            <th className="px-6 py-3 border-b">Pressure</th>
                            <th className="px-6 py-3 border-b">Status</th>
                            <th className="px-6 py-3 border-b">Date Recorded</th>
                            <th className="px-6 py-3 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {weatherRecords.map((weather) => (
                            <tr key={weather.id}>
                                <td className="px-6 py-4 border-b">{weather.city.name}, {weather.city.country}</td>
                                <td className="px-6 py-4 border-b">{weather.temperature}°C</td>
                                <td className="px-6 py-4 border-b">{weather.humidity}%</td>
                                <td className="px-6 py-4 border-b">{weather.windSpeed} km/h</td>
                                <td className="px-6 py-4 border-b">{weather.pressure} hPa</td>
                                <td className="px-6 py-4 border-b">{weather.status}</td>
                                <td className="px-6 py-4 border-b">{new Date(weather.dateRecorded).toLocaleString()}</td>
                                <td className="px-6 py-4 border-b">
                                    <button
                                        onClick={() => handleEditClick(weather)}
                                        className="text-blue-500 hover:text-blue-700 mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteWeather(weather.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 