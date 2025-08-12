package com.timesphere.timesphere.service;

import com.timesphere.timesphere.dto.focus.FocusSessionResponse;
import com.timesphere.timesphere.dto.focus.UserFocusStats;
import com.timesphere.timesphere.entity.FocusSession;
import com.timesphere.timesphere.entity.User;
import com.timesphere.timesphere.entity.type.Role;
import com.timesphere.timesphere.exception.AppException;
import com.timesphere.timesphere.exception.ErrorCode;
import com.timesphere.timesphere.mapper.FocusMapper;
import com.timesphere.timesphere.repository.FocusRepository;
import com.timesphere.timesphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class FocusService {

    private final FocusRepository focusRepository;
    private final FocusMapper focusMapper;
    private final UserRepository userRepository;

    /**
     * Khởi tạo phiên tập trung mới
     */
    public FocusSessionResponse startSession(User user, String mode, int targetMinutes, String description) {
        if (targetMinutes <= 0 || targetMinutes > 240) {
            throw new AppException(ErrorCode.INVALID_KEY, "Thời lượng phải từ 1 đến 240 phút.");
        }

        if (!mode.equalsIgnoreCase("focus") && !mode.equalsIgnoreCase("break")) {
            throw new AppException(ErrorCode.INVALID_KEY, "Mode phải là 'focus' hoặc 'break'.");
        }

        FocusSession session = FocusSession.builder()
                .user(user)
                .mode(mode.toLowerCase())
                .targetMinutes(targetMinutes)
                .description(description)
                .status(FocusSession.Status.CANCELLED)
                .startedAt(LocalDateTime.now())
                .build();

        return focusMapper.toResponse(focusRepository.save(session));
    }

    /**
     * Kết thúc phiên, cập nhật trạng thái
     */
    public FocusSessionResponse endSession(Long sessionId, int actualMinutes) {
        if (actualMinutes < 0 || actualMinutes > 720) {
            throw new AppException(ErrorCode.INVALID_KEY, "Số phút thực tế không hợp lệ.");
        }

        FocusSession session = focusRepository.findById(sessionId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_KEY, "Không tìm thấy session."));

        session.setActualMinutes(actualMinutes);
        session.setEndedAt(LocalDateTime.now());

        boolean isFocus = session.getMode().equals("focus");
        boolean isValid = actualMinutes >= session.getTargetMinutes();

        session.setStatus(
                isFocus ? (isValid ? FocusSession.Status.COMPLETED : FocusSession.Status.CANCELLED)
                        : FocusSession.Status.COMPLETED
        );

        return focusMapper.toResponse(focusRepository.save(session));
    }

    /**
     * Lấy danh sách phiên hôm nay
     */
    public List<FocusSession> getTodaySessions(User user) {
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        return focusRepository.findByUserAndCreatedAtAfterOrderByStartedAtDesc(user, todayStart);
    }

    /**
     * Tổng phút tập trung tuần này
     */
    public int getWeeklyFocusedMinutes(User user) {
        LocalDate today = LocalDate.now();
        LocalDate start = today.with(DayOfWeek.MONDAY);
        LocalDateTime startOfWeek = start.atStartOfDay();
        LocalDateTime endOfWeek = start.plusDays(6).atTime(LocalTime.MAX);

        List<FocusSession> sessions = focusRepository.findByUserAndModeAndStatusAndStartedAtBetween(
                user, "focus", FocusSession.Status.COMPLETED, startOfWeek, endOfWeek);

        return sessions.stream().mapToInt(FocusSession::getActualMinutes).sum();
    }

    //lấy phiên
    public List<FocusSessionResponse> getCompletedSessions(User user) {
        List<FocusSession> sessions = focusRepository.findByUserAndStatusOrderByStartedAtDesc(
                user, FocusSession.Status.COMPLETED
        );
        return focusMapper.toResponseList(sessions); // convert tại đây
    }

    // lấy phiên tất cả người dùng
    public List<UserFocusStats> getWeeklyFocusStatsForAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserFocusStats> results = new ArrayList<>();

        LocalDate startDate = LocalDate.now().with(DayOfWeek.MONDAY);
        LocalDateTime startOfWeek = startDate.atStartOfDay();
        LocalDateTime endOfWeek = startDate.plusDays(6).atTime(LocalTime.MAX);

        for (User user : users) {
            if (user.getRole() == Role.ADMIN) continue;

            List<FocusSession> weeklySessions = focusRepository.findByUserAndModeAndStatusAndStartedAtBetween(
                    user, "focus", FocusSession.Status.COMPLETED, startOfWeek, endOfWeek);

            int totalMinutes = weeklySessions.stream().mapToInt(FocusSession::getActualMinutes).sum();

            results.add(new UserFocusStats(user.getId(), user.getFullName(), user.getAvatarUrl(), totalMinutes));
        }

        return results;
    }

    //xóa phiên
    public void deleteSession(Long sessionId, User user) {
        FocusSession session = focusRepository.findById(sessionId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_KEY, "Không tìm thấy phiên tập trung."));

        if (!session.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED, "Bạn không có quyền xóa phiên này.");
        }

        focusRepository.delete(session);
    }

    //phiên tất cả người dùng
    public List<UserFocusStats> getAllUserFocusStats() {
        List<User> users = userRepository.findAll();

        List<UserFocusStats> results = new ArrayList<>();

        for (User user : users) {
            if (user.getRole() == Role.ADMIN) continue; // bỏ admin khỏi xếp hạng

            List<FocusSession> sessions = focusRepository.findByUserAndModeAndStatus(
                    user, "focus", FocusSession.Status.COMPLETED
            );

            int total = sessions.stream()
                    .mapToInt(FocusSession::getActualMinutes)
                    .sum();

            results.add(new UserFocusStats(user.getId(), user.getFullName(), user.getAvatarUrl(), total));
        }

        return results;
    }

    //phiên của hôm này và hôm qua (biểu đồ tròn)
    public Map<String, Object> getDayComparison(User user) {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        // Hôm nay
        LocalDateTime startToday = today.atStartOfDay();
        LocalDateTime endToday = today.atTime(LocalTime.MAX);

        // Hôm qua
        LocalDateTime startYesterday = yesterday.atStartOfDay();
        LocalDateTime endYesterday = yesterday.atTime(LocalTime.MAX);

        List<FocusSession> todaySessions = focusRepository.findByUserAndStartedAtBetweenAndStatus(
                user, startToday, endToday, FocusSession.Status.COMPLETED
        );

        List<FocusSession> yesterdaySessions = focusRepository.findByUserAndStartedAtBetweenAndStatus(
                user, startYesterday, endYesterday, FocusSession.Status.COMPLETED
        );

        int todayMinutes = todaySessions.stream().mapToInt(FocusSession::getActualMinutes).sum();
        int yesterdayMinutes = yesterdaySessions.stream().mapToInt(FocusSession::getActualMinutes).sum();

        Map<String, Object> response = new HashMap<>();
        response.put("today", Map.of("count", todaySessions.size(), "minutes", todayMinutes));
        response.put("yesterday", Map.of("count", yesterdaySessions.size(), "minutes", yesterdayMinutes));

        return response;
    }

    //lấy phiên tuần naày và tuần truước
    public Map<String, Map<String, Integer>> getWeeklyComparison(User user) {
        Map<String, Integer> thisWeek = getFocusMinutesByDay(user, LocalDate.now());
        Map<String, Integer> lastWeek = getFocusMinutesByDay(user, LocalDate.now().minusWeeks(1));

        Map<String, Map<String, Integer>> response = new HashMap<>();
        response.put("thisWeek", thisWeek);
        response.put("lastWeek", lastWeek);

        return response;
    }
    private Map<String, Integer> getFocusMinutesByDay(User user, LocalDate referenceDate) {
        LocalDate startOfWeek = referenceDate.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = referenceDate.with(DayOfWeek.SUNDAY);

        LocalDateTime from = startOfWeek.atStartOfDay();
        LocalDateTime to = endOfWeek.atTime(LocalTime.MAX);

        List<FocusSession> sessions = focusRepository.findByUserAndModeAndStatusAndStartedAtBetween(
                user, "focus", FocusSession.Status.COMPLETED, from, to
        );

        Map<String, Integer> result = new LinkedHashMap<>();
        for (DayOfWeek day : DayOfWeek.values()) {
            String key = day.name().substring(0, 3).toLowerCase(); // mon, tue,...
            result.put(key, 0);
        }

        for (FocusSession session : sessions) {
            String key = session.getStartedAt().getDayOfWeek().name().substring(0, 3).toLowerCase();
            result.put(key, result.get(key) + session.getActualMinutes());
        }

        return result;
    }
}
