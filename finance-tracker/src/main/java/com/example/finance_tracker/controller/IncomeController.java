package com.example.finance_tracker.controller;

import com.example.finance_tracker.entity.Income;
import com.example.finance_tracker.service.IncomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/incomes")
public class IncomeController {

    @Autowired
    private IncomeService incomeService;

    @GetMapping
    public List<Income> getAllIncomes(Principal principal) {
        return incomeService.getAllIncomes(principal.getName());
    }

    @PostMapping
    public Income createIncome(@RequestBody Income income, Principal principal) {
        return incomeService.saveIncome(principal.getName(), income);
    }

    @PutMapping("/{id}")
    public Income updateIncome(@PathVariable Long id, @RequestBody Income income, Principal principal) {
        income.setId(id);
        return incomeService.saveIncome(principal.getName(), income);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncome(@PathVariable Long id, Principal principal) {
        incomeService.deleteIncome(principal.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
