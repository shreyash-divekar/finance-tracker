package com.example.finance_tracker.service;

import com.example.finance_tracker.entity.Income;
import com.example.finance_tracker.repository.IncomeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncomeService {

    @Autowired
    private IncomeRepository incomeRepository;

    public List<Income> getAllIncomes(String ownerUsername) {
        return incomeRepository.findByOwnerUsernameOrderByDateDescIdDesc(ownerUsername);
    }

    public Income saveIncome(String ownerUsername, Income income) {
        income.setOwnerUsername(ownerUsername);
        return incomeRepository.save(income);
    }

    public void deleteIncome(String ownerUsername, Long id) {
        incomeRepository.deleteByIdAndOwnerUsername(id, ownerUsername);
    }
}
