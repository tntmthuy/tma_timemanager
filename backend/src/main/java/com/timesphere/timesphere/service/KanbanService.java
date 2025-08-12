package com.timesphere.timesphere.service;

import com.timesphere.timesphere.dto.kanban.CreateColumnRequest;
import com.timesphere.timesphere.dto.kanban.KanbanBoardResponseDTO;
import com.timesphere.timesphere.entity.*;
import com.timesphere.timesphere.entity.type.TeamRole;
import com.timesphere.timesphere.exception.AppException;
import com.timesphere.timesphere.exception.ErrorCode;
import com.timesphere.timesphere.mapper.KanbanBoardMapper;
import com.timesphere.timesphere.repository.KanbanColumnRepository;
import com.timesphere.timesphere.repository.TaskRepository;
import com.timesphere.timesphere.repository.TeamMemberRepository;
import com.timesphere.timesphere.repository.TeamRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class KanbanService {

    private final TeamRepository workspaceRepo;
    private final KanbanColumnRepository columnRepo;
    private final TeamMemberRepository memberRepo;
    private final TaskRepository taskRepo;

    public KanbanBoardResponseDTO getKanbanBoard(String workspaceId) {
        TeamWorkspace workspace = workspaceRepo.findWithBoardById(workspaceId)
                .orElseThrow(() -> new AppException(ErrorCode.TEAM_NOT_FOUND));

        return KanbanBoardMapper.toDto(workspace);
    }

    // tao column
    @Transactional
    public KanbanColumn createColumn(CreateColumnRequest req, User currentUser) {
        TeamWorkspace workspace = workspaceRepo.findById(req.getWorkspaceId())
                .orElseThrow(() -> new AppException(ErrorCode.TEAM_NOT_FOUND));

        // 🔐 Kiểm tra quyền OWNER
        TeamMember member = memberRepo.findByUserIdAndTeamId(currentUser.getId(), workspace.getId())
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));

        if (!TeamRole.OWNER.equals(member.getTeamRole())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // Tính vị trí mới cho column
        int nextPosition = columnRepo.findMaxPositionByTeamId(req.getWorkspaceId()).orElse(-1) + 1;

        KanbanColumn column = KanbanColumn.builder()
                .title(req.getTitle())
                .position(nextPosition)
                .team(workspace)
                .build();

        return columnRepo.save(column);
    }

    // cập nhật tiêu đề
    @Transactional
    public KanbanColumn updateColumnTitle(String columnId, String newTitle, User requester) {
        KanbanColumn column = columnRepo.findById(columnId)
                .orElseThrow(() -> new AppException(ErrorCode.COLUMN_NOT_FOUND));

        TeamWorkspace team = column.getTeam();

        System.out.println("🧩 PATCH Column ID: " + columnId);
        System.out.println("🧠 Tiêu đề hiện tại: " + column.getTitle());
        System.out.println("🎯 Sẽ đổi thành: " + newTitle);
        System.out.println("🏢 Team ID: " + team.getId());
        System.out.println("🙋 Requester ID: " + requester.getId());
        System.out.println("🙋 Email: " + requester.getEmail());

        boolean isOwner = memberRepo.existsByTeamAndUserAndTeamRole(team, requester, TeamRole.OWNER);

        System.out.println("🛡 isOwner: " + isOwner);

        if (!isOwner) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        column.setTitle(newTitle);
        return columnRepo.save(column);
    }

    // di chuyển column
    @Transactional
    public KanbanColumn moveColumnToPosition(String columnId, int targetPosition, User currentUser) {
        KanbanColumn column = columnRepo.findById(columnId)
                .orElseThrow(() -> new AppException(ErrorCode.COLUMN_NOT_FOUND));

        TeamWorkspace team = column.getTeam();

        TeamMember member = memberRepo.findByUserIdAndTeamId(currentUser.getId(), team.getId())
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));

        if (!TeamRole.OWNER.equals(member.getTeamRole())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // Lấy toàn bộ column trong team (trừ column đang di chuyển)
        List<KanbanColumn> columns = columnRepo.findByTeamIdOrderByPositionAsc(team.getId())
                .stream()
                .filter(c -> !c.getId().equals(columnId))
                .collect(Collectors.toList());

        // Chèn lại vào vị trí mới
        columns.add(targetPosition, column);

        // Cập nhật lại vị trí từng column
        for (int i = 0; i < columns.size(); i++) {
            columns.get(i).setPosition(i);
        }

        columnRepo.saveAll(columns);
        log.info("📦 Column {} được dời về vị trí {}", column.getId(), targetPosition);
        return column;
    }

    // xóa column
    @Transactional
    public void deleteColumnById(String columnId, User currentUser) {
        KanbanColumn column = columnRepo.findById(columnId)
                .orElseThrow(() -> new AppException(ErrorCode.COLUMN_NOT_FOUND));

        TeamWorkspace team = column.getTeam();

        TeamMember member = memberRepo.findByUserIdAndTeamId(currentUser.getId(), team.getId())
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));

        if (!TeamRole.OWNER.equals(member.getTeamRole())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // Xoá toàn bộ task trong column nếu có
        List<Task> tasks = column.getTasks();
        if (tasks != null && !tasks.isEmpty()) {
            taskRepo.deleteAll(tasks);
        }

        columnRepo.delete(column);

        // 🔄 Re-index lại position các column còn lại
        List<KanbanColumn> remainingColumns = columnRepo.findByTeamIdOrderByPositionAsc(team.getId());
        for (int i = 0; i < remainingColumns.size(); i++) {
            remainingColumns.get(i).setPosition(i);
        }
        columnRepo.saveAll(remainingColumns);

        log.info("🗑 {} xoá column {} trong team {}", currentUser.getEmail(), column.getId(), team.getId());
    }
}
