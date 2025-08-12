package com.timesphere.timesphere.repository;


import com.timesphere.timesphere.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {

    // Lúc đã có team thì mời trừ những ai đã trong team và ADMIN
    @Query("""
                SELECT u FROM User u
                WHERE
                    (LOWER(u.firstname) LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')))
                    AND u.status = com.timesphere.timesphere.entity.type.UserStatus.ACTIVE
                    AND u.role <> com.timesphere.timesphere.entity.type.Role.ADMIN
                    AND u.id NOT IN (
                        SELECT m.user.id FROM TeamMember m WHERE m.team.id = :teamId
                    )
                    AND u.id NOT IN (
                        SELECT i.invitedUser.id FROM TeamInvitation i
                        WHERE i.team.id = :teamId AND i.status = 'PENDING'
                    )
            """)
    List<User> searchUsersNotInTeamWithNoPendingInvite(@Param("keyword") String keyword, @Param("teamId") String teamId);

    // Khi mới tạo team thì tìm hết trừ ADMIN
    @Query("""
                SELECT u FROM User u
                WHERE
                    (LOWER(u.firstname) LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR LOWER(u.lastname) LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')))
                    AND u.status = com.timesphere.timesphere.entity.type.UserStatus.ACTIVE
                    AND u.role <> com.timesphere.timesphere.entity.type.Role.ADMIN
            """)
    List<User> searchUsersForNewTeam(@Param("keyword") String keyword);

    // Không nhập gì cũng hiện
    @Query("""
            SELECT u FROM User u
            WHERE u.status = com.timesphere.timesphere.entity.type.UserStatus.ACTIVE
            AND u.role <> com.timesphere.timesphere.entity.type.Role.ADMIN
            ORDER BY u.firstname ASC
            """)
    List<User> suggestUsersForNewTeamDefault();

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("SELECT COUNT(u) FROM User u WHERE DATE(u.createdAt) = :date")
    long countByCreatedDate(@Param("date") LocalDate date);
}
