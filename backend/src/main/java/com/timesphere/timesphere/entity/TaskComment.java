package com.timesphere.timesphere.entity;

import com.timesphere.timesphere.entity.type.CommentVisibility;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "task_comment")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class TaskComment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private User createdBy;

    // Loại: PUBLIC (mọi người trong team), PRIVATE (chỉ 1 vài người được chỉ định)
    @Enumerated(EnumType.STRING)
    private CommentVisibility visibility;

    // Nếu visibility = PRIVATE → gắn những người nhìn thấy
    @ManyToMany
    @JoinTable(
            name = "task_comment_visible_to",
            joinColumns = @JoinColumn(name = "comment_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> visibleTo;

    @OneToMany(mappedBy = "comment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Attachment> attachments;

}
