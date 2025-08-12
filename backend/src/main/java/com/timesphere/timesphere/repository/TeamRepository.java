package com.timesphere.timesphere.repository;

import com.timesphere.timesphere.entity.TeamWorkspace;
import com.timesphere.timesphere.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Optional;

public interface TeamRepository extends JpaRepository<TeamWorkspace, String> {
    int countByCreatedBy(User user);

    @EntityGraph(attributePaths = {
            "columns",
            "columns.tasks",
            "columns.tasks.subTasks",
            "columns.tasks.assignees",
            "columns.tasks.assignees.user"
    })
    Optional<TeamWorkspace> findWithBoardById(String id);

    @Query("SELECT COUNT(t) FROM TeamWorkspace t WHERE DATE(t.createdAt) = :date")
    long countByCreatedDate(@Param("date") LocalDate date);
}
