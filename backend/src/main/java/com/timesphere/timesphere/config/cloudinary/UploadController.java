package com.timesphere.timesphere.config.cloudinary;

import com.timesphere.timesphere.dto.comment.AttachmentDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
@Slf4j
public class UploadController {

    private final CloudinaryService cloudinaryService;
    private final UploadService uploadService;

    @PostMapping
    @PreAuthorize("hasAuthority('user:manage_team')")
    public ResponseEntity<CloudinaryUploadResult> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "uploads/") String folder
    ) {
        try {
            CloudinaryUploadResult result = cloudinaryService.uploadFile(file, folder);
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(CloudinaryUploadResult.builder()
                            .url(null)
                            .publicId(null)
                            .format(null)
                            .resourceType("Upload failed: " + e.getMessage())
                            .build()
                    );
        }
    }

    //gửi nhiều file
    @PostMapping("/multiple")
    @PreAuthorize("hasAuthority('user:manage_team')")
    public ResponseEntity<List<AttachmentDTO>> uploadMultipleFiles(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(value = "folder", defaultValue = "uploads/") String folder
    ) {
        log.info("🔥 FILES RECEIVED: {}", files == null ? "null" : files.size());
        if (files.size() > 5) {
            return ResponseEntity.badRequest().build();
        }
        log.info("📥 Nhận yêu cầu upload {} file đến folder: {}", files.size(), folder);
        return ResponseEntity.ok(uploadService.upload(files, folder));
    }

}
