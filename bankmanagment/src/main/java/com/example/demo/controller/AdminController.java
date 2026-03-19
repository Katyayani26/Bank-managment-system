package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.model.Account;
import com.example.demo.model.Transaction;
import com.example.demo.model.UserRequest;

import com.example.demo.repository.UserRepository;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.repository.UserRequestRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5174")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRequestRepository requestRepository;

    // View all users
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // View all accounts
    @GetMapping("/accounts")
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    // View all transactions
    @GetMapping("/transactions")
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    // View pending account requests
    @GetMapping("/requests")
    public List<UserRequest> getPendingRequests() {
        return requestRepository.findByStatus("PENDING");
    }

    @PostMapping("/requests/approve/{id}")
    public String approveRequest(@PathVariable Long id) {

        // find request safely
        UserRequest request = requestRepository.findById(id).orElse(null);

        if (request == null) {
            return "Request not found";
        }

        // create new user from request
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        // save user
        userRepository.save(user);

        // update request status
        request.setStatus("APPROVED");
        requestRepository.save(request);

        return "User approved successfully";
    }
    }
