package com.timesphere.timesphere.entity;

import com.timesphere.timesphere.entity.type.TeamRole;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
        name = "team_members",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "team_id"})
)
public class TeamMember extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private User user;

    @ManyToOne(optional = false)
    private TeamWorkspace team;

    @Column(name = "team_role")
    @Enumerated(EnumType.STRING)
    private TeamRole teamRole; // OWNER, MEMBER...

    @ManyToMany(mappedBy = "assignees")
    private List<Task> assignedTasks = new ArrayList<>();

}
