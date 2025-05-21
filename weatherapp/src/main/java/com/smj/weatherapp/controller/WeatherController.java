package com.smj.weatherapp.controller;

import com.smj.weatherapp.model.Weather;
import com.smj.weatherapp.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class WeatherController {

    private final WeatherService weatherService;

    @Autowired
    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @PostMapping
    public ResponseEntity<Weather> createWeatherRecord(@RequestBody Weather weather) {
        try {
            return ResponseEntity.ok(weatherService.saveWeather(weather));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Weather>> getAllWeatherRecords() {
        return ResponseEntity.ok(weatherService.getAllWeatherRecords());
    }

    @GetMapping("/city/{cityId}")
    public ResponseEntity<List<Weather>> getWeatherByCity(@PathVariable Long cityId) {
        return ResponseEntity.ok(weatherService.getWeatherByCity(cityId));
    }

    @GetMapping("/range")
    public ResponseEntity<List<Weather>> getWeatherByDateRange(
            @RequestParam Long cityId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(weatherService.getWeatherByDateRange(cityId, startDate, endDate));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Weather>> getWeatherByStatus(@PathVariable String status) {
        return ResponseEntity.ok(weatherService.getWeatherByStatus(status));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Weather> updateWeatherRecord(@PathVariable Long id, @RequestBody Weather weather) {
        try {
            return ResponseEntity.ok(weatherService.updateWeather(id, weather));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWeatherRecord(@PathVariable Long id) {
        try {
            weatherService.deleteWeather(id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 