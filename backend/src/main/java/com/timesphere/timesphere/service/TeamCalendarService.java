package com.timesphere.timesphere.service;

import com.timesphere.timesphere.dto.task.CalendarDayResponse;
import com.timesphere.timesphere.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamCalendarService {

    private final TaskRepository taskRepository;

    public List<CalendarDayResponse> getCalendarByTeam(String teamId) {
        List<Object[]> rawData = taskRepository.countTasksGroupedByDate(teamId);

        return rawData.stream()
                .map(obj -> new CalendarDayResponse(
                        ((java.sql.Date) obj[0]).toLocalDate(),
                        ((Long) obj[1]).intValue()
                ))
                .toList();
    }
}
