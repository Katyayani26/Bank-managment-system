package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.User;
import com.example.demo.model.UserRequest;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.UserRequestRepository;
import com.example.demo.security.JwtUtil;
import com.example.demo.service.UserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5174")
public class AuthController {

    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRequestRepository requestRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public String register(@RequestBody User user){

        if(userRepository.count() == 0){
            user.setRole("ADMIN");
        } else {
            user.setRole("USER");
        }

        userRepository.save(user);

        return "User registered successfully";
    }
    

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        User dbUser = userService.login(user.getEmail(), user.getPassword());

        if (dbUser == null) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        String token = jwtUtil.generateToken(dbUser.getEmail());

        return ResponseEntity.ok(token);
    }
    @PostMapping("/request-account")
    public String requestAccount(@RequestBody UserRequest request){

        request.setStatus("PENDING");

        requestRepository.save(request);

        return "Account request submitted successfully";
    }
}