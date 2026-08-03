package com.footballstore.backend.modules.auth.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GoogleLoginRequest {
    @NotBlank(message = "Google Token không được để trống")
    private String idToken; // credential
}
