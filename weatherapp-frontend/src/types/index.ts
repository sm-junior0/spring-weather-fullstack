export interface City {
    id: number;
    name: string;
    country: string;
}

export interface Weather {
    id: number;
    city: City;
    temperature: number;
    humidity: number;
    windSpeed: number;
    pressure: number;
    status: string;
    dateRecorded: string;
}          