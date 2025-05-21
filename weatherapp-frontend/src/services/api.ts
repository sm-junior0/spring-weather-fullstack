import api from '../utils/axios';
import type { City, Weather } from '../types';

export const cityApi = {
    getAll: () => api.get<City[]>('/cities'),
    getById: (id: number) => api.get<City>(`/cities/${id}`),
    create: (city: Omit<City, 'id'>) => api.post<City>('/cities', city),
    update: (id: number, city: Omit<City, 'id'>) => api.put<City>(`/cities/${id}`, city),
    delete: (id: number) => api.delete(`/cities/${id}`),
};

export const weatherApi = {
    getAll: () => api.get<Weather[]>('/weather'),
    getByCity: (cityId: number) => api.get<Weather[]>(`/weather/city/${cityId}`),
    getByDateRange: (cityId: number, startDate: string, endDate: string) => 
        api.get<Weather[]>(`/weather/range?cityId=${cityId}&startDate=${startDate}&endDate=${endDate}`),
    getByStatus: (status: string) => api.get<Weather[]>(`/weather/status/${status}`),
    create: (weather: Omit<Weather, 'id'>) => api.post<Weather>('/weather', weather),
}; 