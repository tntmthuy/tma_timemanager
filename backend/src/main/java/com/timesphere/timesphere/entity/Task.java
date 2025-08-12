package com.timesphere.timesphere.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.timesphere.timesphere.entity.type.Priority;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "task")
@EqualsAndHashCode(callSuper = false)
public class Task extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String taskTitle;
    private String description;

    @Column(nullable = true)
    private LocalDateTime dateDue;

    private Integer reminderTime;

    @Column(nullable = true)
    @Enumerated(EnumType.STRING)
    private Priority priority;

    private Integer position;

    // Chỉ dành cho sub-task
    @Column(nullable = true)
    private Boolean isComplete;
    @Column(nullable = true)
    private Integer subtaskPosition;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    private KanbanColumn column;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_task_id")
    private Task parentTask;

    @OneToMany(mappedBy = "parentTask", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Task> subTasks = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "task_assignees",
            joinColumns = @JoinColumn(name = "task_id"),
            inverseJoinColumns = @JoinColumn(name = "team_member_id")
    )
    private List<TeamMember> assignees = new ArrayList<>();

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TaskComment> comments = new ArrayList<>();
}
