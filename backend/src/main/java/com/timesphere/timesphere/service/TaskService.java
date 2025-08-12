package com.timesphere.timesphere.service;


import com.timesphere.timesphere.dto.member.TeamMemberDTO;
import com.timesphere.timesphere.dto.subtask.CreateSubtaskRequest;
import com.timesphere.timesphere.dto.subtask.SubtaskDTO;
import com.timesphere.timesphere.dto.task.AssignedTaskSummary;
import com.timesphere.timesphere.dto.task.CreateTaskRequest;
import com.timesphere.timesphere.dto.task.TaskResponseDTO;
import com.timesphere.timesphere.dto.task.UpdateTaskRequest;
import com.timesphere.timesphere.entity.*;
import com.timesphere.timesphere.entity.type.NotificationType;
import com.timesphere.timesphere.entity.type.TeamRole;
import com.timesphere.timesphere.exception.AppException;
import com.timesphere.timesphere.exception.ErrorCode;
import com.timesphere.timesphere.mapper.TaskMapper;
import com.timesphere.timesphere.repository.KanbanColumnRepository;
import com.timesphere.timesphere.repository.TaskRepository;
import com.timesphere.timesphere.repository.TeamMemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {

    private final TaskRepository taskRepo;
    private final KanbanColumnRepository columnRepo;
    private final TeamMemberRepository memberRepo;
    private final TaskRepository taskRepository;
    private final NotificationService notificationService;

    public boolean canModifyTask(Task task, User user) {
        TeamWorkspace team = task.getColumn().getTeam();

        boolean isOwner = memberRepo.existsByTeamAndUserAndTeamRole(team, user, TeamRole.OWNER);
        boolean isAssigned = task.getAssignees().stream()
                .anyMatch(m -> m.getUser().getId().equals(user.getId()));

        return isOwner || isAssigned;
    }

    // 🛒TASK

    //task được gán
    public List<AssignedTaskSummary> getMyAssignedTasks(User user) {
        List<Task> allTasks = taskRepository.findAll(); // có thể refactor sau

        List<AssignedTaskSummary> result = new ArrayList<>();

        for (Task task : allTasks) {
            for (TeamMember assignee : task.getAssignees()) {
                if (assignee.getUser().getId().equals(user.getId())) {
                    TeamWorkspace team = assignee.getTeam();

                    if (team != null) {
                        result.add(new AssignedTaskSummary(
                                task.getId(),
                                task.getTaskTitle(),
                                team.getId(),
                                team.getTeamName(),
                                "mainpage/team/" + team.getId(),
                                task.getDateDue()
                        ));
                    }
                    break; // task chỉ cần match một assignee là user
                }
            }
        }
        return result;
    }


    // gán task
    @Transactional
    public TaskResponseDTO assignMembers(String taskId, List<String> memberIds, User currentUser) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new AppException(ErrorCode.TASK_NOT_FOUND));

        TeamWorkspace team = task.getColumn().getTeam();

        boolean isOwner = memberRepo.existsByTeamAndUserAndTeamRole(team, currentUser, TeamRole.OWNER);
        if (!isOwner) {
            throw new AppException(ErrorCode.UNAUTHORIZED); // Chỉ OWNER được gán
        }

        List<TeamMember> membersToAssign = memberIds.stream()
                .map(id -> memberRepo.findById(Integer.parseInt(id))
                        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_IN_TEAM)))
                .filter(m -> m.getTeam().getId().equals(team.getId()))
                .toList();

        membersToAssign.forEach(member -> {
            task.getAssignees().add(member); // ✅ vừa gán vừa gửi noti
            notificationService.notify(
                    member.getUser(),
                    currentUser,
                    currentUser.getFullName() + " has assigned you to the task \"" + task.getTaskTitle() + "\"",
                    "Task: " + task.getTaskTitle(),
                    "/mainpage/team/" + team.getId(),
                    NotificationType.TASK_ASSIGNED,
                    task.getId()
            );
        });

        Task updated = taskRepo.save(task);
        return TaskMapper.toDto(updated);
    }

    //bỏ gán task
    @Transactional
    public TaskResponseDTO unassignMembers(String taskId, List<String> memberIds, User currentUser) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new AppException(ErrorCode.TASK_NOT_FOUND));

        TeamWorkspace team = task.getColumn().getTeam();

        boolean isOwner = memberRepo.existsByTeamAndUserAndTeamRole(team, currentUser, TeamRole.OWNER);
        if (!isOwner) {
            throw new AppException(ErrorCode.UNAUTHORIZED, "Chỉ nhóm trưởng mới được gỡ thành viên khỏi task.");
        }

        List<TeamMember> membersToUnassign = memberIds.stream()
                .map(id -> memberRepo.findById(Integer.parseInt(id))
                        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_IN_TEAM)))
                .filter(m -> m.getTeam().getId().equals(team.getId())) // ✅ đảm bảo cùng team
                .toList();

        // 👇 Gỡ thành viên khỏi task
        task.getAssignees().removeAll(membersToUnassign);

        Task updated = taskRepo.save(task);
        return TaskMapper.toDto(updated);
    }

    // danh sách asignees từng task
    public List<TeamMemberDTO> getAssigneesOfTask(String taskId, User requester) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new AppException(ErrorCode.TASK_NOT_FOUND));

        TeamWorkspace team = task.getColumn().getTeam();

        if (!memberRepo.existsByTeamAndUser(team, requester)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        return task.getAssignees().stream()
                .map(member -> TeamMemberDTO.builder()
                        .memberId(member.getId()) // 👈 thêm dòng này
                        .userId(member.getUser().getId())
                        .teamId(member.getTeam().getId())
                        .fullName(member.getUser().getFullName())
                        .email(member.getUser().getEmail())
                        .avatarUrl(member.getUser().getAvatarUrl())
                        .build())
                .toList();
    }

    // tạo task
    @Transactional
    public Task createTask(CreateTaskRequest req, User currentUser) {
        KanbanColumn column = columnRepo.findById(req.getColumnId())
                .orElseThrow(() -> new AppException(ErrorCode.COLUMN_NOT_FOUND));

        TeamWorkspace team = column.getTeam();

        TeamMember member = memberRepo.findByUserIdAndTeamId(currentUser.getId(), team.getId())
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));

        if (!TeamRole.OWNER.equals(member.getTeamRole())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        int nextPosition = taskRepo.findMaxPositionByColumnId(req.getColumnId()).orElse(-1) + 1;

        Task task = Task.builder()
                .taskTitle(req.getTitle())
                .description(req.getDescription())
                .position(nextPosition)
                .dateDue(req.getDateDue())
                .priority(req.getPriority())
                .column(column)
                .build();

        return taskRepo.save(task);
    }

    //cập nhật task
    @Transactional
    public TaskResponseDTO updateTask(String taskId, UpdateTaskRequest req, User requester) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new AppException(ErrorCode.TASK_NOT_FOUND));

        TeamWorkspace team = task.getColumn().getTeam();

        if (!canModifyTask(task, requester)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if (req.getTitle() != null) task.setTaskTitle(req.getTitle());
        if (req.getDescription() != null) task.setDescription(req.getDescription());
        task.setDateDue(req.getDateDue());
        task.setPriority(req.getPriority());

        Task updated = taskRepo.save(task);
        return TaskMapper.toDto(updated);
    }

    // xoá task
    @Transactional
    public void deleteTask(String taskId, User requester) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new AppException(ErrorCode.TASK_NOT_FOUND));

        TeamWorkspace team = task.getColumn().getTeam();
        boolean isOwner = memberRepo.existsByTeamAndUserAndTeamRole(team, requester, TeamRole.OWNER);

        if (!isOwner) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        taskRepo.delete(task);
    }

    public TaskResponseDTO getTaskById(String taskId) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new AppException(ErrorCode.TASK_NOT_FOUND));
        return TaskMapper.toDto(task); // đã map sẵn subTasks + progress
    }

    // dời task sang các cột
    @Transactional
    public TaskResponseDTO moveTaskToColumnAtPosition(String taskId, String targetColumnId, int targetPosition, User currentUser) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new AppException(ErrorCode.TASK_NOT_FOUND));

        if (!canModifyTask(task, currentUser)) {
            throw new AppException(ErrorCode.UNAUTHORIZED); // Không có quyền thao tác task
        }

        KanbanColumn targetColumn = columnRepo.findById(targetColumnId)
                .orElseThrow(() -> new AppException(ErrorCode.COLUMN_NOT_FOUND));

        List<Task> tasks = taskRepo.findByColumnIdOrderByPosition(targetColumnId);
        tasks.removeIf(t -> t.getId().equals(taskId));

        // ✅ Giới hạn vị trí nếu target vượt quá
        targetPosition = Math.min(targetPosition, tasks.size());
        tasks.add(targetPosition, task);

        // ✅ Cập nhật lại position và column
        for (int i = 0; i < tasks.size(); i++) {
            Task t = tasks.get(i);
            t.setPosition(i);
            t.setColumn(targetColumn);
        }

        taskRepo.saveAll(tasks);
        log.info("📦 {} chuyển task {} sang column {} tại vị trí {}", currentUser.getEmail(), taskId, targetColumnId, targetPosition);

        return TaskMapper.toDto(task);
    }

    // 📮SUBTASK
    // tạo subtask
    @Transactional
    public Task createSubtask(CreateSubtaskRequest req, User currentUser) {
        Task parent = taskRepo.findById(req.getParentTaskId())
                .orElseThrow(() -> new AppException(ErrorCode.TASK_NOT_FOUND));

        if (!canModifyTask(parent, currentUser)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        int nextPosition = taskRepo.findMaxSubtaskPositionByParentId(req.getParentTaskId()).orElse(-1) + 1;

        Task sub = Task.builder()
                .taskTitle(req.getTitle())
                .isComplete(false)
                .subtaskPosition(nextPosition)
                .parentTask(parent)
                .build();

        return taskRepo.save(sub);
    }

    //tạo nhiều subtask
    @Transactional
    public List<SubtaskDTO> createAndReturnSubtaskDtos(List<String> titles, String parentTaskId, User currentUser) {
        Task parent = taskRepo.findById(parentTaskId)
                .orElseThrow(() -> new AppException(ErrorCode.TASK_NOT_FOUND));

        if (!canModifyTask(parent, currentUser)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        int currentPosition = taskRepo.findMaxSubtaskPositionByParentId(parentTaskId).orElse(-1) + 1;

        List<Task> subtasks = new ArrayList<>();
        for (String title : titles) {
            Task subtask = Task.builder()
                    .taskTitle(title)
                    .isComplete(false)
                    .subtaskPosition(currentPosition++)
                    .parentTask(parent)
                    .build();
            subtasks.add(subtask);
        }

        List<Task> saved = taskRepo.saveAll(subtasks);
        return saved.stream()
                .map(TaskMapper::toSubtaskDto)
                .toList();
    }

    // đánh dấu subtask
    @Transactional
    public void toggleSubtaskStatus(String subtaskId, User currentUser) {
        Task sub = taskRepo.findById(subtaskId)
                .orElseThrow(() -> new AppException(ErrorCode.TASK_NOT_FOUND));

        Task parent = sub.getParentTask();
        if (parent == null)
            throw new AppException(ErrorCode.SUBTASK_INVALID_PARENT);

        if (!canModifyTask(parent, currentUser))
            throw new AppException(ErrorCode.UNAUTHORIZED);

        sub.setIsComplete(!Boolean.TRUE.equals(sub.getIsComplete()));
        taskRepo.save(sub);
    }

    // dời subtask
    @Transactional
    public void reorderSubtask(String parentId, String subtaskId, int targetPosition, User currentUser) {
        Task parent = taskRepo.findById(parentId)
                .orElseThrow(() -> new AppException(ErrorCode.TASK_NOT_FOUND));

        if (!canModifyTask(parent, currentUser))
            throw new AppException(ErrorCode.UNAUTHORIZED);

        List<Task> subtasks = taskRepo.findByParentTaskIdOrderBySubtaskPosition(parentId);
        Task moving = subtasks.stream()
                .filter(s -> s.getId().equals(subtaskId))
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.TASK_NOT_FOUND));

        subtasks.remove(moving);
        subtasks.add(Math.min(targetPosition, subtasks.size()), moving);

        for (int i = 0; i < subtasks.size(); i++) {
            subtasks.get(i).setSubtaskPosition(i);
        }

        taskRepo.saveAll(subtasks);
    }

    // cập nhật nôi dung subtask
    @Transactional
    public void updateSubtaskTitle(String subtaskId, String newTitle, User currentUser) {
        Task sub = taskRepo.findById(subtaskId)
                .orElseThrow(() -> new AppException(ErrorCode.TASK_NOT_FOUND));

        Task parent = sub.getParentTask();
        if (parent == null)
            throw new AppException(ErrorCode.SUBTASK_INVALID_PARENT);

        if (!canModifyTask(parent, currentUser))
            throw new AppException(ErrorCode.UNAUTHORIZED);

        sub.setTaskTitle(newTitle);
        taskRepo.save(sub);
    }

    // xóa subtask
    @Transactional
    public void deleteSubtask(String subtaskId, User currentUser) {
        Task sub = taskRepo.findById(subtaskId)
                .orElseThrow(() -> new AppException(ErrorCode.TASK_NOT_FOUND));

        Task parent = sub.getParentTask();
        if (parent == null)
            throw new AppException(ErrorCode.SUBTASK_INVALID_PARENT);

        if (!canModifyTask(parent, currentUser))
            throw new AppException(ErrorCode.UNAUTHORIZED);

        taskRepo.delete(sub);

        List<Task> remaining = taskRepo.findByParentTaskIdOrderBySubtaskPosition(parent.getId());
        for (int i = 0; i < remaining.size(); i++) {
            remaining.get(i).setSubtaskPosition(i);
        }

        taskRepo.saveAll(remaining);
    }
}
