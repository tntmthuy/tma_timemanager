package com.timesphere.timesphere.config.cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final CloudinaryProperties properties;

    private Cloudinary getCloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", properties.getCloudName(),
                "api_key", properties.getApiKey(),
                "api_secret", properties.getApiSecret()
        ));
    }

    public CloudinaryUploadResult uploadFile(MultipartFile file, String folder) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File rỗng, không thể upload.");
        }

        Map<String, Object> options = Map.of("folder", folder);
        Map<String, Object> uploadResult = getCloudinary().uploader().upload(file.getBytes(), options);

        return CloudinaryUploadResult.builder()
                .url(uploadResult.get("secure_url").toString())
                .publicId(uploadResult.get("public_id").toString())
                .format(uploadResult.get("format").toString())
                .resourceType(uploadResult.get("resource_type").toString())
                .build();
    }

    public void deleteFile(String publicId) throws IOException {
        getCloudinary().uploader().destroy(publicId, ObjectUtils.emptyMap());
    }

    public String extractCloudinaryId(String url) {
        final String UPLOAD_PATH = "/upload/";
        int index = url.indexOf(UPLOAD_PATH);
        if (index == -1) return null;

        String afterUpload = url.substring(index + UPLOAD_PATH.length());
        return afterUpload.contains(".")
                ? afterUpload.substring(0, afterUpload.lastIndexOf('.'))
                : afterUpload;
    }
}

