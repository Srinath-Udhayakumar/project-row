package com.hackathon.app.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthResponse {
    private Long id;
    private String username;
    private String email;
    private String role;
    private String token;
}