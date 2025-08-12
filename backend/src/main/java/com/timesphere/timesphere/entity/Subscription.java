package com.timesphere.timesphere.entity;

import com.timesphere.timesphere.entity.type.PlanType;
import com.timesphere.timesphere.entity.type.SubscriptionStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "subscription")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Subscription extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlanType planType; // ✅ Enum để tránh typo + dễ validate

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionStatus status; // ✅ ACTIVE / EXPIRED / CANCELLED

    @Column(nullable = false, unique = true)
    private String paymentId; // ✅ ID giao dịch từ PayPal nếu có

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
