package com.hpms.backend.security.config;

import com.hpms.backend.security.jwt.AuthTokenFilter;
import com.hpms.backend.security.jwt.JwtAuthEntryPoint;
import com.hpms.backend.security.jwt.JwtUtils;
import com.hpms.backend.security.user.PMSUserDetailService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;

@RequiredArgsConstructor
@EnableWebSecurity
@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class BackendConfig {

    /**
     * Védett végpontok listája - ezekhez autentikáció szükséges.
     * Minden más végpont nyilvánosan elérhető (pl. /api/auth/login).
     */
    private static final List<String> SECURE_URLS =
            List.of(
                    "/api/init/**",
                    "/api/auth/logout",
                    "/api/bed-types/**",
                    "/api/bookings/**",
                    "/api/buildings/**",
                    "/api/dev-logs/**",
                    "/api/guests/**",
                    "/api/guest-tags/**",
                    "/api/housekeeping/**",
                    "/api/invoices/**",
                    "/api/roles/**",
                    "/api/rooms/**",
                    "/api/room-types/**",
                    "/api/service-models/**",
                    "/api/users/**",
                    "/api/statistics/**",
                    "/api/vats/**"
            );

    private final PMSUserDetailService userDetailsService;
    private final JwtAuthEntryPoint authEntryPoint;
    private final JwtUtils jwtUtils;

    /**
     * ModelMapper bean az entitás-DTO konverzióhoz.
     */
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

    /**
     * Jelszó titkosító (BCrypt).
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * JWT token szűrő filter.
     */
    @Bean
    public AuthTokenFilter authTokenFilter() {
        return new AuthTokenFilter(jwtUtils, userDetailsService);
    }

    /**
     * Autentikáció manager a bejelentkezéshez.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    /**
     * DAO alapú autentikációs provider.
     * Összeköti a UserDetailsService-t a jelszó titkosítóval.
     */
    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        var authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * Security filter lánc konfigurálása.
     * Beállítja a CORS-t, CSRF-t, session kezelést és a végpont védelmeket.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(Customizer.withDefaults());
        http.csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(exception -> exception.authenticationEntryPoint(authEntryPoint))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize.requestMatchers(SECURE_URLS.toArray(String[]::new))
                        .authenticated().anyRequest().permitAll());
        http.authenticationProvider(daoAuthenticationProvider());
        http.addFilterBefore(authTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

}