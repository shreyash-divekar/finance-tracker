package com.example.finance_tracker.controller;

import com.example.finance_tracker.entity.Expense;
import com.example.finance_tracker.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @GetMapping
    public List<Expense> getAllExpenses(Principal principal) {
        return expenseService.getAllExpenses(principal.getName());
    }

    @PostMapping
    public Expense createExpense(@RequestBody Expense expense, Principal principal) {
        return expenseService.saveExpense(principal.getName(), expense);
    }

    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable Long id, @RequestBody Expense expense, Principal principal) {
        expense.setId(id);
        return expenseService.saveExpense(principal.getName(), expense);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id, Principal principal) {
        expenseService.deleteExpense(principal.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
