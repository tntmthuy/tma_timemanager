package com.timesphere.timesphere.repository;

import com.timesphere.timesphere.entity.TeamMember;
import com.timesphere.timesphere.entity.TeamWorkspace;
import com.timesphere.timesphere.entity.User;
import com.timesphere.timesphere.entity.type.TeamRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeamMemberRepository extends JpaRepository<TeamMember, Integer> {
    boolean existsByTeamAndUserAndTeamRole(TeamWorkspace team, User user, TeamRole teamRole);
    List<TeamMember> findAllByTeam(TeamWorkspace team);

    // Tìm tất cả team mà user tham gia → dùng khi hiển thị dashboard
    List<TeamMember> findAllByUser(User user);

    // Kiểm tra user có nằm trong team không
    boolean existsByTeamAndUser(TeamWorkspace team, User user);

    // Tìm cụ thể 1 thành viên trong team
    Optional<TeamMember> findByTeamAndUser(TeamWorkspace team, User user);

    // Xoá toàn bộ thành viên khi xoá nhóm
    void deleteAllByTeam(TeamWorkspace team);
    void deleteAllByUser(User user);

    // Đếm dố thành viên
    long countByTeam(TeamWorkspace team);

    // Đếm thành viên đã tham gia mấy nhóm
    // Để check xem Role Free có đủ 5 nhóm chưa
    long countByUser(User user);

    Optional<TeamMember> findByUserIdAndTeamId(String userId, String teamId);

}
