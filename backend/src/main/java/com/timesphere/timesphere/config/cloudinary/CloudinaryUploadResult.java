package com.timesphere.timesphere.config.cloudinary;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class CloudinaryUploadResult {
    private String url;          // Link CDN ảnh/file
    private String publicId;     // Để xoá sau này nếu cần
    private String format;       // png, pdf, docx, ...
    private String resourceType; // image, raw, video,...
}
