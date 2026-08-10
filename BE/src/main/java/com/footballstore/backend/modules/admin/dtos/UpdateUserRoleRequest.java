package com.footballstore.backend.modules.admin.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateUserRoleRequest {
    @NotBlank(message = "Vai trò mới không được để trống!")
    private String role; // ROLE_ADMIN, ROLE_STAFF, ROLE_CUSTOMER
}
