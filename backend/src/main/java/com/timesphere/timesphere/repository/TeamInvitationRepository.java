package com.timesphere.timesphere.repository;

import com.timesphere.timesphere.entity.TeamInvitation;
import com.timesphere.timesphere.entity.TeamWorkspace;
import com.timesphere.timesphere.entity.User;
import com.timesphere.timesphere.entity.type.InvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TeamInvitationRepository extends JpaRepository<TeamInvitation, String> {
    List<TeamInvitation> findAllByInvitedUserAndStatus(User user, InvitationStatus status);
    List<TeamInvitation> findAllByTeam(TeamWorkspace team);
    Optional<TeamInvitation> findTopByTeamAndInvitedUserOrderByCreatedAtDesc(TeamWorkspace team, User user);
    void deleteAllByTeamAndInvitedUser(TeamWorkspace team, User user);

    //xóa noti -> xóa lời mời
    @Modifying
    @Query("DELETE FROM TeamInvitation i WHERE i.team.id = :teamId AND i.invitedUser.id = :userId")
    void deleteByTeamIdAndInvitedUserId(String teamId, String userId);

    void deleteAllByTeam(TeamWorkspace team);
}
