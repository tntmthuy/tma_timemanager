package com.timesphere.timesphere.repository;

import com.timesphere.timesphere.entity.Task;
import com.timesphere.timesphere.entity.TaskComment;
import com.timesphere.timesphere.entity.TeamWorkspace;
import com.timesphere.timesphere.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TaskCommentRepository extends JpaRepository<TaskComment, String> {
    List<TaskComment> findAllByTask(Task task);
    void deleteByIdAndTask(String id, Task task);

    List<TaskComment> findAllByTaskOrderByCreatedAtDesc(Task task);

    //lấy comment của 1 user trong các tasks thuộc team
    @Query("SELECT c FROM TaskComment c WHERE c.task.column.team = :team AND c.createdBy = :user")
    List<TaskComment> findByTask_Column_TeamAndCreatedBy(@Param("team") TeamWorkspace team, @Param("user") User user);

    // lấy tất cả comment nhoóm
    @Query("SELECT COUNT(c) FROM TaskComment c WHERE c.task.column.team = :team")
    long countByTeam(@Param("team") TeamWorkspace team);

    //admin xóa comment

}
