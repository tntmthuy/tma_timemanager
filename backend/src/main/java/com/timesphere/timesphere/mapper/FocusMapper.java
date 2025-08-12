package com.timesphere.timesphere.mapper;

import com.timesphere.timesphere.dto.focus.FocusSessionResponse;
import com.timesphere.timesphere.entity.FocusSession;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class FocusMapper {

    public FocusSessionResponse toResponse(FocusSession session) {
        return FocusSessionResponse.builder()
                .id(session.getId())
                .mode(session.getMode())
                .targetMinutes(session.getTargetMinutes())
                .actualMinutes(
                        session.getActualMinutes() != null
                                ? session.getActualMinutes()
                                : 0
                )
                .status(session.getStatus().name())
                .startedAt(session.getStartedAt().toString())
                .endedAt(
                        session.getEndedAt() != null
                                ? session.getEndedAt().toString()
                                : null
                )
                .description(session.getDescription()) // cho phép null luôn
                .message(getMessage(session)) // truyền cả session vào
                .build();
    }

    private String getMessage(FocusSession session) {
        if (session.getEndedAt() == null) {
            return "⏳ Phiên vừa được khởi tạo. Hãy tập trung nhé!";
        }

        return switch (session.getStatus()) {
            case COMPLETED -> "🎯 Bạn đã hoàn thành phiên tập trung!";
            case CANCELLED -> "⚠️ Phiên chưa đạt mục tiêu và đã huỷ.";
        };
    }

    public List<FocusSessionResponse> toResponseList(List<FocusSession> sessions) {
        return sessions.stream()
                .map(this::toResponse)
                .toList(); // Java 16+ hoặc dùng .collect(Collectors.toList())
    }
}