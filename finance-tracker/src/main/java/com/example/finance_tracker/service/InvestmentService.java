package com.example.finance_tracker.service;

import com.example.finance_tracker.entity.Investment;
import com.example.finance_tracker.repository.InvestmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvestmentService {

    @Autowired
    private InvestmentRepository investmentRepository;

    public List<Investment> getAllInvestments(String ownerUsername) {
        return investmentRepository.findByOwnerUsernameOrderByDateDescIdDesc(ownerUsername);
    }

    public Investment saveInvestment(String ownerUsername, Investment investment) {
        investment.setOwnerUsername(ownerUsername);
        return investmentRepository.save(investment);
    }

    public void deleteInvestment(String ownerUsername, Long id) {
        investmentRepository.deleteByIdAndOwnerUsername(id, ownerUsername);
    }
}
