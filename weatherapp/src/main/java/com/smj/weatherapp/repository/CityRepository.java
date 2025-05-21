package com.smj.weatherapp.repository;

import com.smj.weatherapp.model.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
@Repository
public interface CityRepository extends JpaRepository<City, Long> {
    boolean existsByNameAndCountry(String name, String country);
} 