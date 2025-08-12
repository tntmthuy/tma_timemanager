package com.timesphere.timesphere.service;

import com.timesphere.timesphere.entity.Task;
import com.timesphere.timesphere.entity.TeamMember;
import com.timesphere.timesphere.entity.type.NotificationType;
import com.timesphere.timesphere.repository.NotificationRepository;
import com.timesphere.timesphere.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeadlineReminderService {

    private final TaskRepository taskRepo;
    private final NotificationRepository notificationRepo;
    private final NotificationService notificationService;

    @Scheduled(cron = "0 0 1 * * *")
    public void remindTasksDueSoon() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime next3Days = now.plusDays(3);

        List<Task> tasks = taskRepo.findByDateDueBetween(now.minusDays(1), next3Days);

        for (Task task : tasks) {
            // ❌ Bỏ qua subtask
            if (task.getParentTask() != null) continue;

            LocalDateTime deadline = task.getDateDue();
            long hoursUntilDue = Duration.between(now, deadline).toHours();

            String label = null;
            if (hoursUntilDue <= 0) {
                label = "was due";
            } else if (hoursUntilDue <= 24) {
                label = "in less than 24 hours";
            } else {
                label = "in 3 days";
            }

            if (label != null && task.getAssignees() != null) {
                for (TeamMember member : task.getAssignees()) {
                    if (!notificationRepo.existsByTypeAndReferenceIdAndRecipientId(
                            NotificationType.DEADLINE_REMINDER,
                            task.getId(),
                            member.getUser().getId()
                    )) {
                        notificationService.notify(
                                member.getUser(),
                                null,
                                "Task \"" + task.getTaskTitle() + "\" " + label,
                                "Deadline: " + deadline.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")),
                                "/mainpage/team/" + member.getTeam().getId(),
                                NotificationType.DEADLINE_REMINDER,
                                task.getId()
                        );
                    }
                }
            }
        }
    }
}