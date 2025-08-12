package com.timesphere.timesphere.util;

import com.timesphere.timesphere.entity.type.AttachmentType;

public class FileUtils {

    /**
     * Chuyển dung lượng file từ byte thành định dạng dễ nhìn (VD: 2.3 MB)
     */
    public static String formatSize(long bytes) {
        if (bytes < 1024) return bytes + " B";
        int exp = (int) (Math.log(bytes) / Math.log(1024));
        char unit = "KMGTPE".charAt(exp - 1);
        return String.format("%.1f %sB", bytes / Math.pow(1024, exp), unit);
    }

    /**
     * Lấy phần đuôi mở rộng từ tên file (VD: pdf, png)
     */
    public static String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) return "";
        return fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
    }

    /**
     * Kiểm tra file có phải dạng hình ảnh không
     */
    public static boolean isImage(String fileType) {
        return fileType != null && fileType.toLowerCase().startsWith("image/");
    }

    /**
     * Tự động phân loại file là IMAGE hoặc FILE
     */
    public static AttachmentType resolveAttachmentType(String fileType) {
        if (fileType == null) return AttachmentType.FILE;

        String ft = fileType.toLowerCase();

        // ⚠️ Ưu tiên bắt PDF trước khi xét image
        if (ft.contains("pdf")) return AttachmentType.PDF;
        if (ft.startsWith("image/")) return AttachmentType.IMAGE;
        if (ft.startsWith("video/")) return AttachmentType.VIDEO;
        if (ft.startsWith("audio/")) return AttachmentType.AUDIO;
        if (ft.contains("msword") || ft.contains("word")) return AttachmentType.DOC;

        return AttachmentType.FILE;
    }

    /**
     * Kiểm tra file có thể xem online (image, PDF)
     */
    public static boolean isPreviewable(String mimeType) {
        return mimeType != null &&
                (mimeType.startsWith("image/") || mimeType.equals("application/pdf"));
    }
}