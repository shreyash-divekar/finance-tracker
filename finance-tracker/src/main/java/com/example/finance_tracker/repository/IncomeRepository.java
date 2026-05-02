package com.example.finance_tracker.repository;

import com.example.finance_tracker.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findByOwnerUsernameOrderByDateDescIdDesc(String ownerUsername);

    void deleteByIdAndOwnerUsername(Long id, String ownerUsername);
}
