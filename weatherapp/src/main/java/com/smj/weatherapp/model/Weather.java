package com.smj.weatherapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "weather")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Weather {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "city_id", nullable = false)
    private City city;
    
    @Column(nullable = false)
    private Double temperature;
    
    @Column(nullable = false)
    private Integer humidity;
    
    @Column(name = "wind_speed", nullable = false)
    private Double windSpeed;
    
    @Column(nullable = false)
    private Double pressure;
    
    @Column(nullable = false)
    private String status;
    
    @Column(name = "date_recorded", nullable = false)
    private LocalDateTime dateRecorded;
} 