package com.smj.weatherapp.controller;

import com.smj.weatherapp.model.City;
import com.smj.weatherapp.service.CityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cities")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CityController {

    private final CityService cityService;

    @Autowired
    public CityController(CityService cityService) {
        this.cityService = cityService;
    }

    @PostMapping
    public ResponseEntity<City> createCity(@RequestBody City city) {
        return ResponseEntity.ok(cityService.saveCity(city));
    }

    @GetMapping
    public ResponseEntity<List<City>> getAllCities() {
        return ResponseEntity.ok(cityService.getAllCities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<City> getCityById(@PathVariable Long id) {
        return cityService.getCityById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<City> updateCity(@PathVariable Long id, @RequestBody City cityDetails) {
        try {
            City updatedCity = cityService.updateCity(id, cityDetails);
            return ResponseEntity.ok(updatedCity);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCity(@PathVariable Long id) {
        try {
            cityService.deleteCity(id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
} 