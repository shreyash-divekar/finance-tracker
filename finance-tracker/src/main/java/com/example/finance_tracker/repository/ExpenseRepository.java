package com.example.finance_tracker.repository;

import com.example.finance_tracker.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByOwnerUsernameOrderByDateDescIdDesc(String ownerUsername);

    void deleteByIdAndOwnerUsername(Long id, String ownerUsername);
}
