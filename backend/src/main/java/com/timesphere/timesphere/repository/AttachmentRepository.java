package com.timesphere.timesphere.repository;

import com.timesphere.timesphere.entity.Attachment;
import com.timesphere.timesphere.entity.type.AttachmentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, String> {

    @Query("""
    SELECT a
    FROM Attachment a
    JOIN a.comment c
    JOIN c.task t
    JOIN t.column col
    WHERE col.team.id = :teamId
      AND (:type IS NULL OR a.type = :type)
""")
    List<Attachment> findByTeamId(@Param("teamId") String teamId, @Param("type") AttachmentType type);

    @Query("""
    SELECT COUNT(a) FROM Attachment a
    WHERE a.comment.task.column.team.id = :teamId
      AND (:type IS NULL OR a.type = :type)
""")
    long countByTeamId(@Param("teamId") String teamId, @Param("type") AttachmentType type);

    //admin xóa team

}

