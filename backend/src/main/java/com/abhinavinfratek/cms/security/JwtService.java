package com.abhinavinfratek.cms.security;

import com.abhinavinfratek.cms.entity.AdminUser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JwtService {

    private static final String HMAC_SHA256 = "HmacSHA256";

    private final ObjectMapper objectMapper;

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration-seconds}")
    private long expirationSeconds;

    public String generateToken(AdminUser adminUser) {
        Instant now = Instant.now();

        Map<String, Object> header = new LinkedHashMap<>();
        header.put("alg", "HS256");
        header.put("typ", "JWT");

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("sub", adminUser.getEmail());
        payload.put("name", adminUser.getFullName());
        payload.put("role", adminUser.getRole());
        payload.put("iat", now.getEpochSecond());
        payload.put("exp", now.plusSeconds(expirationSeconds).getEpochSecond());

        String encodedHeader = base64UrlEncode(toJson(header));
        String encodedPayload = base64UrlEncode(toJson(payload));
        String unsignedToken = encodedHeader + "." + encodedPayload;

        return unsignedToken + "." + sign(unsignedToken);
    }

    public String extractUsername(String token) {
        return getPayload(token).get("sub").toString();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token) && isSignatureValid(token);
    }

    private boolean isTokenExpired(String token) {
        Object exp = getPayload(token).get("exp");
        return exp == null || Instant.now().getEpochSecond() >= Long.parseLong(exp.toString());
    }

    private boolean isSignatureValid(String token) {
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            return false;
        }

        String unsignedToken = parts[0] + "." + parts[1];
        String expectedSignature = sign(unsignedToken);
        return expectedSignature.equals(parts[2]);
    }

    private Map<String, Object> getPayload(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                throw new IllegalArgumentException("Invalid JWT structure");
            }

            byte[] decoded = Base64.getUrlDecoder().decode(parts[1]);
            return objectMapper.readValue(decoded, new TypeReference<>() {
            });
        } catch (Exception exception) {
            throw new IllegalArgumentException("Invalid JWT token", exception);
        }
    }

    private String toJson(Map<String, Object> value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to create JWT payload", exception);
        }
    }

    private String sign(String value) {
        try {
            Mac mac = Mac.getInstance(HMAC_SHA256);
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), HMAC_SHA256));
            return Base64.getUrlEncoder().withoutPadding()
                    .encodeToString(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to sign JWT token", exception);
        }
    }

    private String base64UrlEncode(String value) {
        return Base64.getUrlEncoder().withoutPadding()
                .encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }
}
