package com.smj.weatherapp.service;

import com.smj.weatherapp.model.City;
import com.smj.weatherapp.repository.CityRepository;
import com.smj.weatherapp.repository.WeatherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CityService {

    private final CityRepository cityRepository;
    private final WeatherRepository weatherRepository;

    @Autowired
    public CityService(CityRepository cityRepository, WeatherRepository weatherRepository) {
        this.cityRepository = cityRepository;
        this.weatherRepository = weatherRepository;
    }

    public City saveCity(City city) {
        if (cityRepository.existsByNameAndCountry(city.getName(), city.getCountry())) {
            throw new IllegalArgumentException("City already exists in this country");
        }
        return cityRepository.save(city);
    }

    public List<City> getAllCities() {
        return cityRepository.findAll();
    }

    public Optional<City> getCityById(Long id) {
        return cityRepository.findById(id);
    }

    public City updateCity(Long id, City cityDetails) {
        City city = cityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("City not found"));
        
        city.setName(cityDetails.getName());
        city.setCountry(cityDetails.getCountry());
        
        return cityRepository.save(city);
    }

    public void deleteCity(Long id) {
        if (!cityRepository.existsById(id)) {
            throw new IllegalArgumentException("City not found with id: " + id);
        }
        
        // Delete all weather records associated with this city first
        weatherRepository.deleteByCityId(id);
        
        // Then delete the city
        cityRepository.deleteById(id);
    }
} 