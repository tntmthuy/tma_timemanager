package com.timesphere.timesphere.dto.task;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class CalendarDayResponse {
    private LocalDate date;
    private int taskCount;
}