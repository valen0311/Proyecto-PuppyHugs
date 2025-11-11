package com.puppyhugs.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

/**
 * Configuración global de CORS para permitir peticiones desde Angular.
 */
@Configuration
public class WebConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // Permitir credenciales
        config.setAllowCredentials(true);

        // Permitir origen de Angular
        config.setAllowedOrigins(Arrays.asList("http://localhost:4200"));

        // Permitir todos los headers
        config.addAllowedHeader("*");

        // Permitir todos los métodos HTTP
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Aplicar configuración a todos los endpoints /api/**
        source.registerCorsConfiguration("/api/**", config);

        System.out.println("✅ CORS configurado: permitiendo http://localhost:4200");

        return new CorsFilter(source);
    }
}