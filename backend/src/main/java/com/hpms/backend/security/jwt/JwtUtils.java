package com.hpms.backend.security.jwt;

import com.hpms.backend.security.user.PMSUserDetails;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.List;

/**
 * JWT token kezelő segédosztály.
 */
@Component
public class JwtUtils {

    /** JWT titkosító kulcs (application.properties-ből) */
    @Value("${auth.token.jwtSecret}")
    private String jwtSecret;

    /** JWT lejárati idő milliszekundumban (application.properties-ből) */
    @Value("${auth.token.jwtExpiration}0")
    private int jwtExpiration;

    /**
     * JWT token generálása sikeres autentikáció után.
     * A token tartalmazza a felhasználó email címét, ID-ját és szerepköreit.
     * @param authentication Az autentikációs objektum
     * @return A generált JWT token
     */
    public String generateJwt(Authentication authentication) {
        PMSUserDetails userPrincipal = (PMSUserDetails) authentication.getPrincipal();
        List<String> roles = userPrincipal.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        return Jwts.builder()
                .setSubject(userPrincipal.getEmail())
                .claim("id",userPrincipal.getId())
                .claim("roles",roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpiration))
                .signWith(key(), SignatureAlgorithm.HS256).compact();
    }

    /**
     * Titkosító kulcs létrehozása a konfigurált secret alapján.
     * @return A HMAC-SHA256 titkosító kulcs
     */
    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    /**
     * Felhasználónév (email) kinyerése a JWT tokenből.
     * @param token A JWT token
     * @return A felhasználó email címe
     */
    public String getUsernameFromJwt(String token) {
         return Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody().getSubject();
    }

    /**
     * JWT token validálása.
     * Ellenőrzi az aláírást, lejáratot és a token formátumát.
     * @param authToken A validálandó JWT token
     * @return true ha a token érvényes
     * @throws RuntimeException ha a token érvénytelen (lejárt, rossz aláírás, stb.)
     */
    public boolean validateJwtToken(String authToken) {
        try {
            System.out.println("Attempting to validate for: " + authToken);
            Jwts.parserBuilder()
                    .setSigningKey(key())
                    .build()
                    .parseClaimsJws(authToken);
            return true;
        } catch (ExpiredJwtException e) {
            throw new RuntimeException(e);
        } catch (UnsupportedJwtException e) {
            throw new RuntimeException(e);
        } catch (MalformedJwtException e) {
            throw new RuntimeException(e);
        } catch (SignatureException e) {
            throw new RuntimeException(e);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e);
        }
    }
}
