package com.timesphere.timesphere.dto.member;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class AssignTaskRequest {
    @NotNull
    private List<String> memberIds; // là TeamMember.id
}
