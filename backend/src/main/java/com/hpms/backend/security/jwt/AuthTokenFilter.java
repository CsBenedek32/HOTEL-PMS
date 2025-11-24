package com.hpms.backend.security.jwt;

import com.hpms.backend.security.user.PMSUserDetailService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT token szűrő filter.
 * Minden HTTP kérésnél ellenőrzi a JWT tokent és beállítja a Security kontextust.
 * Ez a filter a Spring Security filter lánc része.
 */
@RequiredArgsConstructor
public class AuthTokenFilter extends OncePerRequestFilter {
    private final JwtUtils jwtUtils;
    private final PMSUserDetailService userDetailService;

    /**
     * Minden HTTP kérésnél végrehajtódik.
     * Kinyeri a JWT tokent a kérésből, validálja, és beállítja az autentikációt.
     * @param request A HTTP kérés
     * @param response A HTTP válasz
     * @param filterChain A filter lánc folytatásához
     */
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        // JWT token kinyerése a kérésből
        String jwt = parseJwt(request);
        try {
            // Ha van érvényes token, beállítjuk az autentikációt
            if (StringUtils.hasText(jwt) && jwtUtils.validateJwtToken(jwt)) {
                // Felhasználónév kinyerése a tokenből
                String username = jwtUtils.getUsernameFromJwt(jwt);
                UserDetails userDetails = userDetailService.loadUserByUsername(username);

                // Autentikáció beállítása a Security kontextusban
                Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        } catch (JwtException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write(e.getMessage() + "Invalid JWT token");
            return;
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return;
        }
        // Filter lánc folytatása
        filterChain.doFilter(request, response);
    }

    /**
     * JWT token kinyerése az Authorization headerből.
     * A token "Bearer " prefixszel kezdődik.
     * @param request A HTTP kérés
     * @return A JWT token vagy null ha nincs
     */
    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("authorization");
        System.out.println(request.getHeader("authorization"));
        if (headerAuth != null && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}