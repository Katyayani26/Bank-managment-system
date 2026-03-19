package com.example.demo.controller;

import com.example.demo.model.Transaction;
import com.example.demo.dto.TransferRequest;
import com.example.demo.service.TransactionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5174")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    // Deposit
    @PostMapping("/deposit")
    public String deposit(@RequestBody Transaction transaction) {
        return transactionService.deposit(transaction);
    }

    // Withdraw
    @PostMapping("/withdraw")
    public String withdraw(@RequestBody Transaction transaction) {
        return transactionService.withdraw(transaction);
    }

    // Transfer
    @PostMapping("/transfer")
    public String transfer(@RequestBody TransferRequest request) {
        return transactionService.transferMoney(request);
    }
    @GetMapping("/account/{accountId}")
    public java.util.List<com.example.demo.model.Transaction> getTransactions(
            @PathVariable Long accountId) {

        return transactionService.getTransactionsByAccount(accountId);
    }
}