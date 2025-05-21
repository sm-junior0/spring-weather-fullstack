package com.smj.weatherapp.service;

import com.smj.weatherapp.dto.AuthRequest;
import com.smj.weatherapp.dto.AuthResponse;
import com.smj.weatherapp.dto.RegisterRequest;
import com.smj.weatherapp.model.User;
import com.smj.weatherapp.repository.UserRepository;
import com.smj.weatherapp.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Collections.singleton("USER"))
                .build();

        userRepository.save(user);
        var token = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        var token = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .build();
    }
} 