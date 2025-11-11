package com.puppyhugs.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// ¡¡Importante!! Añadimos esto para deshabilitar la protección
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

/**
 * Configuración de Seguridad de Spring.
 * Aquí le decimos a Spring cómo manejar la autenticación y autorización.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Este es el "Fabricador" de Encriptadores.
     * Le dice a Spring que use BCrypt para las contraseñas.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * ¡¡EL CAMBIO MÁS IMPORTANTE!!
     * Aquí configuramos la "Lista de Puertas Abiertas" (Reglas de la API).
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Deshabilitar CSRF: Necesario para APIs REST que no usan sesiones.
                .csrf(AbstractHttpConfigurer::disable)

                // 2. Configurar CORS (Cross-Origin Resource Sharing)
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    // Permite que Angular (corriendo en localhost:4200) haga peticiones
                    config.setAllowedOrigins(List.of("http://localhost:4200"));
                    // Permite todos los métodos (GET, POST, PUT, DELETE)
                    config.setAllowedMethods(List.of("*"));
                    // Permite todas las cabeceras (Content-Type, Authorization, etc.)
                    config.setAllowedHeaders(List.of("*"));
                    return config;
                }))

                // 3. ¡LA REGLA DE ORO! Autorizar peticiones.
                .authorizeHttpRequests(auth -> auth
                        // Permite que CUALQUIERA acceda a estas URLs (login y registro)
                        .requestMatchers("/api/auth/**", "/api/clientes/**").permitAll()

                        // Para CUALQUIER OTRA petición, requiere estar autenticado
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}