package com.footballstore.backend.modules.auth.services;

import com.footballstore.backend.config.security.JwtUtils;
import com.footballstore.backend.modules.auth.dtos.AuthResponse;
import com.footballstore.backend.modules.auth.dtos.GoogleLoginRequest;
import com.footballstore.backend.modules.auth.dtos.LoginRequest;
import com.footballstore.backend.modules.auth.dtos.RegisterRequest;
import com.footballstore.backend.modules.auth.dtos.UserResponse;
import com.footballstore.backend.modules.auth.models.AuthProvider;
import com.footballstore.backend.modules.auth.models.Role;
import com.footballstore.backend.modules.auth.models.User;
import com.footballstore.backend.modules.auth.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final AuthEmailService authEmailService;
    private final RestTemplate restTemplate = new RestTemplate();

    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được đăng ký sử dụng bởi tài khoản khác");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .provider(AuthProvider.LOCAL)
                .role(Role.ROLE_CUSTOMER)
                .enabled(false) // Không kích hoạt ngay lập tức
                .createdAt(LocalDateTime.now())
                .build();

        user = userRepository.save(user);

        // Gửi email xác thực
        String token = jwtUtils.generateEmailVerificationToken(user.getEmail(), user.getId());
        authEmailService.sendVerificationEmail(user.getEmail(), token);
    }

    @Transactional
    public void verifyEmail(String token) {
        if (!jwtUtils.validateJwtToken(token)) {
            throw new RuntimeException("Link xác thực không hợp lệ hoặc đã hết hạn");
        }
        
        String userId = jwtUtils.getUserIdFromJwtToken(token);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
                
        if (user.isEnabled()) {
            return; // Tránh lỗi do React StrictMode gọi API 2 lần
        }
        
        user.setEnabled(true);
        userRepository.save(user);
    }

    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            // Để bảo mật, không ném lỗi nếu không tìm thấy email, chỉ return (tránh hacker dò email)
            // Hoặc ném lỗi nếu muốn UX rõ ràng. Theo yêu cầu, ta cứ ném lỗi cho thân thiện.
            throw new RuntimeException("Không tìm thấy tài khoản nào đăng ký với email này");
        }
        
        if (user.getProvider() != AuthProvider.LOCAL) {
            throw new RuntimeException("Tài khoản này được đăng nhập qua Google, không thể đổi mật khẩu.");
        }

        String token = jwtUtils.generatePasswordResetToken(user.getEmail(), user.getId());
        authEmailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        if (!jwtUtils.validateJwtToken(token)) {
            throw new RuntimeException("Link đổi mật khẩu không hợp lệ hoặc đã hết hạn");
        }

        String userId = jwtUtils.getUserIdFromJwtToken(token);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email hoặc mật khẩu không chính xác"));

        if (!user.isEnabled()) {
            throw new RuntimeException("Tài khoản của bạn chưa được xác thực. Vui lòng kiểm tra email để xác thực.");
        }

        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Tài khoản này được đăng ký qua Google. Vui lòng đăng nhập bằng Google!");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwtToken = jwtUtils.generateJwtToken(authentication);
        UserResponse userResponse = buildUserResponse(user);

        return new AuthResponse(jwtToken, userResponse);
    }

    @Transactional
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
            if (user.getProviderId() == null) {
                user.setProviderId(googleId);
                userRepository.save(user);
            }
        } else {
            user = User.builder()
                    .email(email)
                    .fullName(name != null ? name : email.split("@")[0])
                    .provider(AuthProvider.GOOGLE)
                    .providerId(googleId)
                    .role(Role.ROLE_CUSTOMER)
                    .enabled(true)
                    .createdAt(LocalDateTime.now())
                    .build();

            userRepository.save(user);
        }

        return generateAuthResponse(user);
    }

    public String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    private AuthResponse generateAuthResponse(User user) {
        String token = jwtUtils.generateTokenFromUser(user.getEmail(), user.getId(), user.getRole().name());
        UserResponse userResponse = buildUserResponse(user);
        return new AuthResponse(token, userResponse);
    }

    private UserResponse buildUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .provider(user.getProvider().name())
                .address(user.getAddress())
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null)
                .build();
    }

    public String extractUserIdFromToken(String authHeader) {
        if (authHeader == null || authHeader.trim().isEmpty()) {
            return null;
        }
        String token = authHeader.trim();
        while (token.startsWith("\"") && token.endsWith("\"") && token.length() > 1) {
            token = token.substring(1, token.length() - 1).trim();
        }
        while (token.regionMatches(true, 0, "Bearer ", 0, 7)) {
            token = token.substring(7).trim();
        }
        if (jwtUtils.validateJwtToken(token)) {
            return jwtUtils.getUserIdFromJwtToken(token);
        }
        return null;
    }

    @Transactional(readOnly = true)
    public User getUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    @Transactional
    public void updateUser(User user) {
        userRepository.save(user);
    }
}
