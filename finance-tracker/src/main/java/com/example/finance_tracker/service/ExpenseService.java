package com.example.finance_tracker.service;

import com.example.finance_tracker.entity.Expense;
import com.example.finance_tracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public List<Expense> getAllExpenses(String ownerUsername) {
        return expenseRepository.findByOwnerUsernameOrderByDateDescIdDesc(ownerUsername);
    }

    public Expense saveExpense(String ownerUsername, Expense expense) {
        expense.setOwnerUsername(ownerUsername);
        return expenseRepository.save(expense);
    }

    public void deleteExpense(String ownerUsername, Long id) {
        expenseRepository.deleteByIdAndOwnerUsername(id, ownerUsername);
    }
}
