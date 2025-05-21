package com.smj.weatherapp.repository;

import com.smj.weatherapp.model.Weather;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WeatherRepository extends JpaRepository<Weather, Long> {
    
    List<Weather> findByCityId(Long cityId);
    
    @Query("SELECT w FROM Weather w WHERE w.city.id = :cityId AND w.dateRecorded BETWEEN :startDate AND :endDate")
    List<Weather> findByCityAndDateRange(
            @Param("cityId") Long cityId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
    
    List<Weather> findByStatus(String status);
    
    boolean existsByCityIdAndDateRecorded(Long cityId, LocalDateTime dateRecorded);
} 