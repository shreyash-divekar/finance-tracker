package com.example.finance_tracker.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.example.finance_tracker.dto.AuthRequest;
import com.example.finance_tracker.entity.User;
import com.example.finance_tracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody AuthRequest authRequest) {
        String username = authRequest.getUsername();
        String password = authRequest.getPassword();

        if (username == null || username.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body("Username and password are required");
        }

        User existingUser = userService.findByUsername(username.trim());
        if (existingUser != null) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        userService.registerUser(username.trim(), password);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(
        @RequestBody AuthRequest authRequest,
        HttpServletRequest request
    ) {
        String username = authRequest.getUsername();
        String password = authRequest.getPassword();

        if (username == null || username.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username and password are required"));
        }

        if (!userService.isValidLogin(username.trim(), password)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid credentials"));
        }

        Authentication authentication = new UsernamePasswordAuthenticationToken(
            username.trim(),
            null,
            AuthorityUtils.NO_AUTHORITIES
        );

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        request.getSession(true).setAttribute(
            HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
            context
        );

        return ResponseEntity.ok(Map.of(
            "message", "Login successful",
            "username", username.trim()
        ));
    }

    @GetMapping("/session")
    public ResponseEntity<Map<String, String>> session(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("message", "No active session"));
        }

        return ResponseEntity.ok(Map.of("username", principal.getName()));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(
        HttpServletRequest request,
        HttpServletResponse response
    ) {
        SecurityContextHolder.clearContext();
        if (request.getSession(false) != null) {
            request.getSession(false).invalidate();
        }
        response.setHeader("Clear-Site-Data", "\"cookies\"");
        return ResponseEntity.ok("Logout successful");
    }
}
