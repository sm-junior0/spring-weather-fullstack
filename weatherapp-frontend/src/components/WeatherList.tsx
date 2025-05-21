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

            {/* Create Weather Form */}
            <form onSubmit={handleCreateWeather} className="mb-8 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Add New Weather Record</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                            City
                        </label>
                        <select
                            id="city"
                            value={newWeather.cityId}
                            onChange={(e) => setNewWeather({ ...newWeather, cityId: e.target.value })}
                            className="border p-2 rounded w-full"
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
                    <div>
                        <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">
                            Temperature (°C)
                        </label>
                        <input
                            id="temperature"
                            type="number"
                            placeholder="Temperature (°C)"
                            value={newWeather.temperature}
                            onChange={(e) => setNewWeather({ ...newWeather, temperature: e.target.value })}
                            className="border p-2 rounded w-full"
                            required
                            min="-50"
                            max="50"
                            step="0.1"
                        />
                    </div>
                    <div>
                        <label htmlFor="humidity" className="block text-sm font-medium text-gray-700 mb-1">
                            Humidity (%)
                        </label>
                        <input
                            id="humidity"
                            type="number"
                            placeholder="Humidity (%)"
                            value={newWeather.humidity}
                            onChange={(e) => setNewWeather({ ...newWeather, humidity: e.target.value })}
                            className="border p-2 rounded w-full"
                            required
                            min="0"
                            max="100"
                        />
                    </div>
                    <div>
                        <label htmlFor="windSpeed" className="block text-sm font-medium text-gray-700 mb-1">
                            Wind Speed (km/h)
                        </label>
                        <input
                            id="windSpeed"
                            type="number"
                            placeholder="Wind Speed (km/h)"
                            value={newWeather.windSpeed}
                            onChange={(e) => setNewWeather({ ...newWeather, windSpeed: e.target.value })}
                            className="border p-2 rounded w-full"
                            required
                            min="0"
                            step="0.1"
                        />
                    </div>
                    <div>
                        <label htmlFor="pressure" className="block text-sm font-medium text-gray-700 mb-1">
                            Pressure (hPa)
                        </label>
                        <input
                            id="pressure"
                            type="number"
                            placeholder="Pressure (hPa)"
                            value={newWeather.pressure}
                            onChange={(e) => setNewWeather({ ...newWeather, pressure: e.target.value })}
                            className="border p-2 rounded w-full"
                            required
                            min="800"
                            max="1200"
                            step="0.1"
                        />
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <select
                            id="status"
                            value={newWeather.status}
                            onChange={(e) => setNewWeather({ ...newWeather, status: e.target.value })}
                            className="border p-2 rounded w-full"
                            required
                        >
                            <option value="">Select Status</option>
                            <option value="Sunny">Sunny</option>
                            <option value="Partly Cloudy">Partly Cloudy</option>
                            <option value="Cloudy">Cloudy</option>
                            <option value="Rainy">Rainy</option>
                            <option value="Heavy Rain">Heavy Rain</option>
                            <option value="Thunderstorm">Thunderstorm</option>
                            <option value="Snowy">Snowy</option>
                            <option value="Foggy">Foggy</option>
                            <option value="Windy">Windy</option>
                            <option value="Clear">Clear</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="dateRecorded" className="block text-sm font-medium text-gray-700 mb-1">
                            Date Recorded
                        </label>
                        <input
                            id="dateRecorded"
                            type="datetime-local"
                            value={newWeather.dateRecorded}
                            onChange={(e) => setNewWeather({ ...newWeather, dateRecorded: e.target.value })}
                            className="border p-2 rounded w-full"
                            required
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add Weather Record
                </button>
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

            {/* Weather Records List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {weatherRecords.map((record) => (
                    <div key={record.id} className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold">{record.city.name}</h3>
                        <p className="text-gray-600">{record.city.country}</p>
                        <div className="mt-4 space-y-2">
                            <p>Temperature: {record.temperature}°C</p>
                            <p>Humidity: {record.humidity}%</p>
                            <p>Wind Speed: {record.windSpeed} km/h</p>
                            <p>Pressure: {record.pressure} hPa</p>
                            <p>Status: {record.status}</p>
                            <p>Date: {new Date(record.dateRecorded).toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 