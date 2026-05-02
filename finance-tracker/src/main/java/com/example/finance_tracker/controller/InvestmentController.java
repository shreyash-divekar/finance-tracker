package com.example.finance_tracker.controller;

import com.example.finance_tracker.entity.Investment;
import com.example.finance_tracker.service.InvestmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/investments")
public class InvestmentController {

    @Autowired
    private InvestmentService investmentService;

    @GetMapping
    public List<Investment> getAllInvestments(Principal principal) {
        return investmentService.getAllInvestments(principal.getName());
    }

    @PostMapping
    public Investment createInvestment(@RequestBody Investment investment, Principal principal) {
        return investmentService.saveInvestment(principal.getName(), investment);
    }

    @PutMapping("/{id}")
    public Investment updateInvestment(@PathVariable Long id, @RequestBody Investment investment, Principal principal) {
        investment.setId(id);
        return investmentService.saveInvestment(principal.getName(), investment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvestment(@PathVariable Long id, Principal principal) {
        investmentService.deleteInvestment(principal.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
