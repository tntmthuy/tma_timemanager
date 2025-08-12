package com.timesphere.timesphere.repository;

import com.timesphere.timesphere.entity.KanbanColumn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface KanbanColumnRepository extends JpaRepository<KanbanColumn, String> {

    // Lấy column theo thứ tự position
    List<KanbanColumn> findByTeamIdOrderByPositionAsc(String teamId);

    // Tìm vị trí cao nhất để gán column mới
    @Query("SELECT MAX(c.position) FROM KanbanColumn c WHERE c.team.id = :teamId")
    Optional<Integer> findMaxPositionByTeamId(@Param("teamId") String teamId);
}


