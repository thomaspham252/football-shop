package com.footballstore.backend.modules.admin.services;

import com.footballstore.backend.modules.admin.dtos.CreateUserRequest;
import com.footballstore.backend.modules.admin.dtos.UpdateUserRoleRequest;
import com.footballstore.backend.modules.auth.dtos.UserResponse;
import com.footballstore.backend.modules.auth.models.AuthProvider;
import com.footballstore.backend.modules.auth.models.Role;
import com.footballstore.backend.modules.auth.models.User;
import com.footballstore.backend.modules.auth.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public Page<UserResponse> getUsers(String role, String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        String cleanRoleStr = (role != null && !role.trim().isEmpty() && !"ALL".equalsIgnoreCase(role)) 
                ? role.trim().toUpperCase() : null;

        Role roleEnum = null;
        if (cleanRoleStr != null) {
            try {
                if (!cleanRoleStr.startsWith("ROLE_")) {
                    roleEnum = Role.valueOf("ROLE_" + cleanRoleStr);
                } else {
                    roleEnum = Role.valueOf(cleanRoleStr);
                }
            } catch (IllegalArgumentException e) {
                roleEnum = null;
                cleanRoleStr = null;
            }
        }

        String cleanKeyword = (keyword != null && !keyword.trim().isEmpty()) 
                ? "%" + keyword.trim().toLowerCase() + "%" : null;

        Page<User> userPage;
        if (cleanRoleStr == null && cleanKeyword == null) {
            userPage = userRepository.findAll(pageable);
        } else {
            userPage = userRepository.searchUsers(cleanRoleStr, roleEnum, cleanKeyword, pageable);
        }

        return userPage.map(this::mapToUserResponse);
    }

    @Transactional(readOnly = true)
    public Map<String, Long> getUserCounts() {
        Map<String, Long> counts = new HashMap<>();
        counts.put("TOTAL", userRepository.count());
        counts.put("ADMIN", userRepository.countByRole(Role.ROLE_ADMIN));
        counts.put("STAFF", userRepository.countByRole(Role.ROLE_STAFF));
        counts.put("CUSTOMER", userRepository.countByRole(Role.ROLE_CUSTOMER));
        return counts;
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email '" + request.getEmail() + "' đã tồn tại trong hệ thống!");
        }

        Role userRole = parseRole(request.getRole());

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .address(request.getAddress())
                .role(userRole)
                .provider(AuthProvider.LOCAL)
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);
        return mapToUserResponse(savedUser);
    }

    @Transactional
    public UserResponse updateUserRole(String userId, UpdateUserRoleRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng với ID: " + userId));

        Role newRole = parseRole(request.getRole());
        user.setRole(newRole);

        User savedUser = userRepository.save(user);
        return mapToUserResponse(savedUser);
    }

    @Transactional
    public UserResponse toggleUserStatus(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng với ID: " + userId));

        user.setEnabled(!user.isEnabled());
        User savedUser = userRepository.save(user);
        return mapToUserResponse(savedUser);
    }

    @Transactional
    public void deleteUser(String userId, String currentAdminEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng với ID: " + userId));

        if (user.getEmail().equalsIgnoreCase(currentAdminEmail)) {
            throw new IllegalArgumentException("Không thể tự xóa tài khoản Quản trị viên đang đăng nhập!");
        }

        userRepository.delete(user);
    }

    private Role parseRole(String roleStr) {
        if (roleStr == null || roleStr.trim().isEmpty()) {
            return Role.ROLE_CUSTOMER;
        }
        String formatted = roleStr.trim().toUpperCase();
        if (!formatted.startsWith("ROLE_")) {
            formatted = "ROLE_" + formatted;
        }
        try {
            return Role.valueOf(formatted);
        } catch (IllegalArgumentException e) {
            return Role.ROLE_CUSTOMER;
        }
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .provider(user.getProvider() != null ? user.getProvider().name() : "LOCAL")
                .address(user.getAddress())
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null)
                .build();
    }
}
