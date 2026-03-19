package com.example.demo.service;

import com.example.demo.model.Account;
import com.example.demo.model.Transaction;
import com.example.demo.dto.TransferRequest;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.TransactionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    // DEPOSIT
    public String deposit(Transaction transaction) {

        Account account = accountRepository
                .findById(transaction.getAccountId())
                .orElse(null);

        if (account == null) {
            return "Account not found";
        }

        account.setBalance(account.getBalance() + transaction.getAmount());
        accountRepository.save(account);

        transaction.setType("DEPOSIT");
        transaction.setDate(LocalDateTime.now());

        transactionRepository.save(transaction);

        return "Deposit successful";
    }

    // WITHDRAW
    public String withdraw(Transaction transaction) {

        Account account = accountRepository
                .findById(transaction.getAccountId())
                .orElse(null);

        if (account == null) {
            return "Account not found";
        }

        if (account.getBalance() < transaction.getAmount()) {
            return "Insufficient balance";
        }

        account.setBalance(account.getBalance() - transaction.getAmount());
        accountRepository.save(account);

        transaction.setType("WITHDRAW");
        transaction.setDate(LocalDateTime.now());

        transactionRepository.save(transaction);

        return "Withdraw successful";
    }

    // TRANSFER
    public String transferMoney(TransferRequest request) {

        Account fromAccount = accountRepository
                .findById(request.getFromAccountId())
                .orElse(null);

        Account toAccount = accountRepository
                .findById(request.getToAccountId())
                .orElse(null);

        if (fromAccount == null || toAccount == null) {
            return "Account not found";
        }

        if (fromAccount.getBalance() < request.getAmount()) {
            return "Insufficient balance";
        }

        // subtract money
        fromAccount.setBalance(
                fromAccount.getBalance() - request.getAmount());

        // add money
        toAccount.setBalance(
                toAccount.getBalance() + request.getAmount());

        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        // sender transaction
        Transaction t1 = new Transaction();
        t1.setAccountId(fromAccount.getId());
        t1.setType("TRANSFER_OUT");
        t1.setAmount(request.getAmount());
        t1.setDate(LocalDateTime.now());

        transactionRepository.save(t1);

        // receiver transaction
        Transaction t2 = new Transaction();
        t2.setAccountId(toAccount.getId());
        t2.setType("TRANSFER_IN");
        t2.setAmount(request.getAmount());
        t2.setDate(LocalDateTime.now());

        transactionRepository.save(t2);

        return "Transfer successful";
    }
    public java.util.List<Transaction> getTransactionsByAccount(Long accountId) {

        return transactionRepository.findByAccountId(accountId);

    }
}