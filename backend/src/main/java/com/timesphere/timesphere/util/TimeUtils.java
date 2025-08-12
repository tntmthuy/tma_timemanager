package com.timesphere.timesphere.util;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class TimeUtils {
    public static String timeAgo(LocalDateTime time) {
        Duration duration = Duration.between(time, LocalDateTime.now());

        if (duration.toMinutes() < 1) return "vừa xong";
        if (duration.toMinutes() < 60) return duration.toMinutes() + " phút trước";
        if (duration.toHours() < 24) return duration.toHours() + " giờ trước";
        if (duration.toDays() < 7) return duration.toDays() + " ngày trước";

        return time.format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
    }
}
