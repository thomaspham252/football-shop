package com.footballstore.backend.config.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Slf4j
@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration-ms}")
    private long jwtExpirationMs;

    private SecretKey getSigningKey() {
        byte[] keyBytes;
        try {
            // Trường hợp Secret Key được mã hóa Base64
            keyBytes = Decoders.BASE64.decode(jwtSecret);
        } catch (IllegalArgumentException e) {
            // Trường hợp Secret Key là chuỗi plain text
            keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Tạo JWT Token từ đối tượng Authentication
     */
    public String generateJwtToken(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        String role = userPrincipal.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("ROLE_CUSTOMER");

        return Jwts.builder()
                .subject(userPrincipal.getUsername()) // Email của người dùng
                .claim("userId", userPrincipal.getId())
                .claim("role", role)
                .claim("fullName", userPrincipal.getFullName())
                .issuedAt(new Date())
                .expiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Tạo JWT Token trực tiếp từ thông tin User
     */
    public String generateTokenFromUser(String email, String userId, String role) {
        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }
        return Jwts.builder()
                .subject(email)
                .claim("userId", userId)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Lấy Username (Email) từ JWT Token
     */
    public String getUserNameFromJwtToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    /**
     * Lấy User ID từ JWT Token
     */
    public String getUserIdFromJwtToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.get("userId", String.class);
    }

    /**
     * Kiểm tra tính hợp lệ của JWT Token
     */
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(authToken);
            return true;
        } catch (SignatureException e) {
            log.error("Chữ ký JWT không hợp lệ: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.error("Cấu trúc JWT không hợp lệ: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("JWT Token đã hết hạn: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("JWT Token không được hỗ trợ: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("Chuỗi JWT bị rỗng hoặc chứa ký tự không hợp lệ: {}", e.getMessage());
        }
        return false;
    }
}
