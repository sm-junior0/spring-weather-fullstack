import { useState, useEffect } from 'react';
import { cityApi } from '../services/api';
import type { City } from '../types';

export default function CityList() {
    const [cities, setCities] = useState<City[]>([]);
    const [newCity, setNewCity] = useState({ name: '', country: '' });
    const [editingCity, setEditingCity] = useState<City | null>(null);

    useEffect(() => {
        loadCities();
    }, []);

    const loadCities = async () => {
        try {
            const response = await cityApi.getAll();
            setCities(response.data);
        } catch (error) {
            console.error('Error loading cities:', error);
        }
    };

    const handleCreateCity = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await cityApi.create(newCity);
            setNewCity({ name: '', country: '' });
            loadCities();
        } catch (error) {
            console.error('Error creating city:', error);
        }
    };

    const handleUpdateCity = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCity) return;
        try {
            await cityApi.update(editingCity.id, {
                name: editingCity.name,
                country: editingCity.country,
            });
            setEditingCity(null);
            loadCities();
        } catch (error) {
            console.error('Error updating city:', error);
        }
    };

    const handleDeleteCity = async (id: number) => {
        try {
            await cityApi.delete(id);
            loadCities();
        } catch (error) {
            console.error('Error deleting city:', error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Cities</h2>
            
            {/* Create City Form */}
            <form onSubmit={handleCreateCity} className="mb-8 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Add New City</h3>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="City Name"
                        value={newCity.name}
                        onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Country"
                        value={newCity.country}
                        onChange={(e) => setNewCity({ ...newCity, country: e.target.value })}
                        className="border p-2 rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add City
                </button>
            </form>

            {/* Cities List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cities.map((city) => (
                    <div key={city.id} className="bg-white p-6 rounded-lg shadow-md">
                        {editingCity?.id === city.id ? (
                            <form onSubmit={handleUpdateCity}>
                                <input
                                    title='edit'
                                    type="text"
                                    value={editingCity.name}
                                    onChange={(e) => setEditingCity({ ...editingCity, name: e.target.value })}
                                    className="border p-2 rounded mb-2 w-full"
                                />
                                <input
                                    title='edit'
                                    type="text"
                                    value={editingCity.country}
                                    onChange={(e) => setEditingCity({ ...editingCity, country: e.target.value })}
                                    className="border p-2 rounded mb-2 w-full"
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingCity(null)}
                                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <h3 className="text-xl font-semibold">{city.name}</h3>
                                <p className="text-gray-600">{city.country}</p>
                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => setEditingCity(city)}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCity(city.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
} 