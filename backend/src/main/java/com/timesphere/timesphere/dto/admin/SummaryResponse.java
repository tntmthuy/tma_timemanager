package com.timesphere.timesphere.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SummaryResponse {
    private long totalUsers;
    private long totalTeams;
    private long totalFocusSessions;
}
