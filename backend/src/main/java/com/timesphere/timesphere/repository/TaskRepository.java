package com.timesphere.timesphere.repository;

import com.timesphere.timesphere.entity.Task;
import com.timesphere.timesphere.entity.TeamWorkspace;
import com.timesphere.timesphere.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, String> {

    // Lấy tất cả task trong column theo thứ tự position tăng dần
    List<Task> findByColumnIdOrderByPosition(String columnId);

    // Lấy các subtask của một task cha, theo thứ tự subtaskPosition
    List<Task> findByParentTaskIdOrderBySubtaskPosition(String taskId);

    // Lấy vị trí lớn nhất (MAX) trong column để gán task mới vào cuối
    @Query("SELECT MAX(t.position) FROM Task t WHERE t.column.id = :columnId")
    Optional<Integer> findMaxPositionByColumnId(@Param("columnId") String columnId);

    // Lấy vị trí lớn nhất (MAX) trong task để gán subtask mới vào cuối
    @Query("SELECT MAX(t.subtaskPosition) FROM Task t WHERE t.parentTask.id = :parentId")
    Optional<Integer> findMaxSubtaskPositionByParentId(@Param("parentId") String parentId);

    //báo hạn
    List<Task> findByDateDueBetween(LocalDateTime start, LocalDateTime end);

    //lấy tất cả task thuộc 1 team
    @Query("SELECT t FROM Task t WHERE t.column.team = :team")
    List<Task> findByColumn_Team(@Param("team") TeamWorkspace team);

    //lấy lịch
    @Query("""
    SELECT CAST(t.dateDue AS date), COUNT(t.id)
    FROM Task t
    WHERE t.column.team.id = :teamId AND t.dateDue IS NOT NULL
    GROUP BY CAST(t.dateDue AS date)
    ORDER BY CAST(t.dateDue AS date) ASC
""")
    List<Object[]> countTasksGroupedByDate(@Param("teamId") String teamId);

    //lấy task được gán
    @Query("""
    SELECT t FROM Task t JOIN t.assignees a
    WHERE a.user = :user
""")
    List<Task> findAssignedTasksByUser(@Param("user") User user);

    //tổng task 1 nhóm
    @Query("SELECT COUNT(t) FROM Task t WHERE t.column.team = :team")
    long countByTeam(@Param("team") TeamWorkspace team);

    //admin xóa task

}