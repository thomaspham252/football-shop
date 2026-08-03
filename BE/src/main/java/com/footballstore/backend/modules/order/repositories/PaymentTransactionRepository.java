package com.footballstore.backend.modules.order.repositories;

import com.footballstore.backend.modules.order.models.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Integer> {
    Optional<PaymentTransaction> findByRequestId(String requestId);
}
