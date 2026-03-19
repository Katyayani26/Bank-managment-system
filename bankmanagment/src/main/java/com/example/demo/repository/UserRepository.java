package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.User;

// JpaRepository provides built-in database operations like save, findAll, findById, delete
public interface UserRepository extends JpaRepository<User, Long> {

    // Custom query method to find a user by email
    // Spring Data JPA automatically generates the query
    User findByEmail(String email);
    
}