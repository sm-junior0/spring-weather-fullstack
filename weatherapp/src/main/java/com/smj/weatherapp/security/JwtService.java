package com.smj.weatherapp.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Slf4j
@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    public String extractUsername(String token) {
        try {
            String username = extractClaim(token, Claims::getSubject);
            log.debug("Extracted username from token: {}", username);
            return username;
        } catch (Exception e) {
            log.error("Error extracting username from token: ", e);
            return null;
        }
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            log.debug("Validating token for user: {}", username);
            
            if (username == null) {
                log.error("Username is null in token validation");
                return false;
            }
            
            boolean isUsernameValid = username.equals(userDetails.getUsername());
            boolean isTokenExpired = isTokenExpired(token);
            
            log.debug("Token validation - Username valid: {}, Token expired: {}", isUsernameValid, isTokenExpired);
            
            return isUsernameValid && !isTokenExpired;
        } catch (Exception e) {
            log.error("Error validating token: ", e);
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        try {
            Date expiration = extractExpiration(token);
            boolean isExpired = expiration.before(new Date());
            log.debug("Token expiration check - Expiration date: {}, Is expired: {}", expiration, isExpired);
            return isExpired;
        } catch (Exception e) {
            log.error("Error checking token expiration: ", e);
            return true;
        }
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            log.error("Error extracting claims from token: ", e);
            throw e;
        }
    }

    private Key getSigningKey() {
        byte[] keyBytes = secretKey.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }
} 