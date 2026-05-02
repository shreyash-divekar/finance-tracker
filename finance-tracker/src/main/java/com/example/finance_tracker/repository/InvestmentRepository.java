package com.example.finance_tracker.repository;

import com.example.finance_tracker.entity.Investment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvestmentRepository extends JpaRepository<Investment, Long> {
    List<Investment> findByOwnerUsernameOrderByDateDescIdDesc(String ownerUsername);

    void deleteByIdAndOwnerUsername(Long id, String ownerUsername);
}
