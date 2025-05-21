package com.smj.weatherapp.service;

import com.smj.weatherapp.model.Weather;
import com.smj.weatherapp.repository.WeatherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WeatherService {

    private final WeatherRepository weatherRepository;
    private final CityService cityService;

    @Autowired
    public WeatherService(WeatherRepository weatherRepository, CityService cityService) {
        this.weatherRepository = weatherRepository;
        this.cityService = cityService;
    }

    public Weather saveWeather(Weather weather) {
        validateWeatherData(weather);
        
        if (weatherRepository.existsByCityIdAndDateRecorded(
                weather.getCity().getId(), 
                weather.getDateRecorded())) {
            throw new IllegalArgumentException("Weather record already exists for this city and date");
        }
        
        return weatherRepository.save(weather);
    }

    public List<Weather> getAllWeatherRecords() {
        return weatherRepository.findAll();
    }

    public List<Weather> getWeatherByCity(Long cityId) {
        return weatherRepository.findByCityId(cityId);
    }

    public List<Weather> getWeatherByDateRange(Long cityId, LocalDateTime startDate, LocalDateTime endDate) {
        return weatherRepository.findByCityAndDateRange(cityId, startDate, endDate);
    }

    public List<Weather> getWeatherByStatus(String status) {
        return weatherRepository.findByStatus(status);
    }

    private void validateWeatherData(Weather weather) {
        if (weather.getHumidity() < 0 || weather.getHumidity() > 100) {
            throw new IllegalArgumentException("Humidity must be between 0 and 100");
        }
        
        if (weather.getTemperature() < -50 || weather.getTemperature() > 50) {
            throw new IllegalArgumentException("Temperature must be between -50 and 50 degrees Celsius");
        }
        
        if (weather.getWindSpeed() < 0) {
            throw new IllegalArgumentException("Wind speed cannot be negative");
        }
        
        if (weather.getPressure() < 800 || weather.getPressure() > 1200) {
            throw new IllegalArgumentException("Pressure must be between 800 and 1200 hPa");
        }
        
        if (weather.getStatus() == null || weather.getStatus().trim().isEmpty()) {
            throw new IllegalArgumentException("Weather status cannot be empty");
        }
    }
} 