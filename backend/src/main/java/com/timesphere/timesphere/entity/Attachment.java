package com.timesphere.timesphere.entity;

import com.timesphere.timesphere.entity.type.AttachmentType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "attachment")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attachment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;         // Tên file gốc người dùng upload
    private String url;          // Link CDN từ Cloudinary
    private String fileType;     // MIME type: image/png, application/pdf,...
    private Long size;           // Kích thước file tính bằng byte
    private String displaySize;
    private String cloudId;      // Public ID bên Cloudinary để xoá nếu cần

    @Enumerated(EnumType.STRING)
    @Column(name = "type", length = 10)
    private AttachmentType type; // IMAGE hoặc FILE (dựa theo fileType)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id") // thêm rõ ràng tên cột khoá ngoại
    private TaskComment comment;

}
