
package com.hpms.backend.security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS (Cross-Origin Resource Sharing) konfiguráció.
 * Engedélyezi a frontend alkalmazásoknak a backend API-hoz való hozzáférést.
 */
@Configuration
public class CorsConfig {

    /**
     * CORS beállítások konfigurálása.
     * Engedélyezi a localhost:5173, localhost:3000 és frontend:3000 origókat.
     * @return A WebMvcConfigurer a CORS beállításokkal
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173", "http://localhost:3000", "http://frontend:3000") // Frontend URL
                        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .exposedHeaders("Authorization")
                        .allowCredentials(true);
            }
        };
    }
}