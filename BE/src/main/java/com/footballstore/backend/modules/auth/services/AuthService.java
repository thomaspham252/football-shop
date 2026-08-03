package com.footballstore.backend.modules.auth.services;

import com.footballstore.backend.modules.auth.dtos.*;
import com.footballstore.backend.modules.auth.models.AuthProvider;
import com.footballstore.backend.modules.auth.models.Role;
import com.footballstore.backend.modules.auth.models.User;
import com.footballstore.backend.modules.auth.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final RestTemplate restTemplate = new RestTemplate();

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được đăng ký sử dụng bởi tài khoản khác");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .provider(AuthProvider.LOCAL)
                .role(Role.USER)
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        return generateAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email hoặc mật khẩu không chính xác"));

        if (user.getProvider() != AuthProvider.LOCAL) {
            throw new RuntimeException("Tài khoản này được đăng ký thông qua mạng xã hội Google. Vui lòng chọn đăng nhập bằng Google.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Email hoặc mật khẩu không chính xác");
        }

        return generateAuthResponse(user);
    }

    @SuppressWarnings("unchecked")
    public AuthResponse googleLogin(GoogleLoginRequest request) {
        String googleVerifyUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + request.getIdToken();
        Map<String, Object> response;
        try {
            response = restTemplate.getForObject(googleVerifyUrl, Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Xác thực Google ID Token thất bại hoặc token hết hạn");
        }

        if (response == null || !response.containsKey("sub")) {
            throw new RuntimeException("Google ID Token không hợp lệ");
        }

        String email = (String) response.get("email");
        String name = (String) response.get("name");
        String googleId = (String) response.get("sub");

        if (email == null) {
            throw new RuntimeException("Không tìm thấy thông tin email từ Google ID Token");
        }

        User user = userRepository.findByEmail(email).orElse(null);

        if (user != null) {
            if (user.getProvider() == AuthProvider.LOCAL) {
                throw new RuntimeException("Email này đã được đăng ký bằng mật khẩu thường. Vui lòng đăng nhập bằng mật khẩu.");
            }
            if (user.getProviderId() == null) {
                user.setProviderId(googleId);
                userRepository.save(user);
            }
        } else {
            // Auto register a new account for Google login user
            user = User.builder()
                    .email(email)
                    .fullName(name != null ? name : email.split("@")[0])
                    .provider(AuthProvider.GOOGLE)
                    .providerId(googleId)
                    .role(Role.USER)
                    .enabled(true)
                    .createdAt(LocalDateTime.now())
                    .build();

            userRepository.save(user);
        }

        return generateAuthResponse(user);
    }

    private AuthResponse generateAuthResponse(User user) {
        String token = "auth-token-" + UUID.randomUUID().toString() + "-" + user.getId();
        
        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .provider(user.getProvider().name())
                .build();

        return new AuthResponse(token, userResponse);
    }
}
