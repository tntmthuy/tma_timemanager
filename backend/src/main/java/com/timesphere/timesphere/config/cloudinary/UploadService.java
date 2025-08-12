package com.timesphere.timesphere.config.cloudinary;

import com.timesphere.timesphere.dto.comment.AttachmentDTO;
import com.timesphere.timesphere.util.FileUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UploadService {

    private final CloudinaryService cloudinaryService;

    public List<AttachmentDTO> upload(List<MultipartFile> files, String folder) {
        return files.stream()
                .map(file -> {
                    if (file == null || file.isEmpty()) {
                        throw new IllegalArgumentException("File upload rỗng hoặc null.");
                    }

                    try {
                        CloudinaryUploadResult result = cloudinaryService.uploadFile(file, folder);

                        return AttachmentDTO.builder()
                                .name(file.getOriginalFilename())
                                .url(result.getUrl())
                                .fileType(result.getResourceType() + "/" + result.getFormat())
                                .size(file.getSize())
                                .displaySize(FileUtils.formatSize(file.getSize()))
                                .type(FileUtils.resolveAttachmentType(file.getContentType()).name())
                                .build();

                    } catch (IOException e) {
                        log.error("❌ Upload failed: {}", file.getOriginalFilename(), e);
                        throw new IllegalStateException("Upload thất bại cho file: " + file.getOriginalFilename(), e);
                    }

                })
                .toList();

    }
}