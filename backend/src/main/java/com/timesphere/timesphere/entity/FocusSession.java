package com.timesphere.timesphere.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "focus_session")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FocusSession extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String mode; // "focus" hoặc "break"

    private Integer targetMinutes;

    private Integer actualMinutes;

    @Enumerated(EnumType.STRING)
    private Status status; // COMPLETED hoặc CANCELLED

    private LocalDateTime startedAt;
    private LocalDateTime endedAt;

    @Column(length = 512)
    private String description; // Mô tả hoặc ghi chú của phiên

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public enum Status {
        COMPLETED,
        CANCELLED
    }
}
