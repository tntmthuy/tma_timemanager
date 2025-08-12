package com.timesphere.timesphere.entity;

import com.timesphere.timesphere.entity.type.InvitationStatus;
import com.timesphere.timesphere.entity.type.TeamRole;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "team_invitation")
public class TeamInvitation extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private TeamWorkspace team;

    @ManyToOne
    private User invitedUser;

    @ManyToOne
    private User invitedBy;

    @Enumerated(EnumType.STRING)
    private TeamRole invitedRole;

    @Enumerated(EnumType.STRING)
    private InvitationStatus status; // PENDING / ACCEPTED / DECLINED
}
