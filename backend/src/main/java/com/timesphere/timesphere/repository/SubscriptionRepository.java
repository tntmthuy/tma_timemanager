package com.timesphere.timesphere.repository;

import com.timesphere.timesphere.entity.Subscription;
import com.timesphere.timesphere.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface SubscriptionRepository extends JpaRepository<Subscription, Integer> {
    List<Subscription> findByUser(User user);

    long countByStartDate(LocalDate date);

    @Query("SELECT COUNT(s) FROM Subscription s WHERE s.startDate BETWEEN :start AND :end AND s.status = 'ACTIVE'")
    long countByStartDateBetween(@Param("start") LocalDateTime start,
                                 @Param("end") LocalDateTime end);

    @Query("SELECT SUM(CASE s.planType WHEN 'WEEKLY' THEN 1.0 WHEN 'MONTHLY' THEN 3.0 WHEN 'YEARLY' THEN 25.0 ELSE 0 END) " +
            "FROM Subscription s WHERE s.startDate BETWEEN :start AND :end AND s.status = 'ACTIVE'")
    Double sumAmountByStartDateBetween(@Param("start") LocalDateTime start,
                                       @Param("end") LocalDateTime end);

}

