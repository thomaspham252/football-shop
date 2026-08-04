package com.footballstore.backend.modules.auth.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    private String id;
    private String email;
    private String fullName;
    private String phone;
    private String role;
    private String provider;
    private String address;
    private String createdAt;
}
