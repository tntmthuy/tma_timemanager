package com.timesphere.timesphere.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import static org.springframework.http.HttpStatus.*;

@Getter
public enum ErrorCode {

    // === 100x: Common ===
    UNCATEGORIZED_EXCEPTION(9999, "Lỗi không xác định", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Khóa dữ liệu không hợp lệ", BAD_REQUEST),

    // === 110x: Auth & Account ===
    EMAIL_ALREADY_REGISTERED(1101, "Email đã tồn tại.", BAD_REQUEST),
    EMAIL_INVALID(1102, "Email không hợp lệ, hãy nhập đúng định dạng.", BAD_REQUEST),
    EMAIL_REQUIRED(1103, "Vui lòng nhập email.", BAD_REQUEST),
    PASSWORD_REQUIRED(1104, "Vui lòng nhập mật khẩu.", BAD_REQUEST),
    PASSWORD_TOO_WEAK(1105, "Mật khẩu phải dài tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt.", BAD_REQUEST),
    PASSWORD_CONFIRMATION_MISMATCH(1106, "Mật khẩu xác nhận không khớp.", BAD_REQUEST),
    INVALID_LOGIN_CREDENTIALS(1107, "Email hoặc mật khẩu không đúng.", HttpStatus.UNAUTHORIZED),
    WRONG_PASSWORD(1108, "Mật khẩu hiện tại không đúng.", BAD_REQUEST),
    MFA_NOT_ENABLED(1109, "Người dùng chưa bật xác thực hai bước.", HttpStatus.BAD_REQUEST),

    // === 120x: User ===
    USER_EXISTED(1201, "Người dùng đã tồn tại.", BAD_REQUEST),
    USER_NOT_EXISTED(1202, "Người dùng không tồn tại.", NOT_FOUND),
    ROLE_REQUIRED(1203, "Vui lòng chọn vai trò cho người dùng.", BAD_REQUEST),
    ROLE_NOT_SUPPORTED(1204, "Vai trò không được hỗ trợ.", BAD_REQUEST),
    CANNOT_DELETE_ADMIN(1205, "Không thể xóa người dùng ADMIN.", BAD_REQUEST),

    // === 130x: Auth Token ===
    UNAUTHENTICATED(1301, "Chưa xác thực người dùng.", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1302, "Không có quyền truy cập.", HttpStatus.FORBIDDEN),
    REFRESH_TOKEN_INVALID(1303, "Refresh token không hợp lệ hoặc đã hết hạn.", HttpStatus.UNAUTHORIZED),
    TOKEN_EXPIRED(1304, "Token đã hết hạn, vui lòng đăng nhập lại.", HttpStatus.UNAUTHORIZED),

    // === 200x: Team & Workspace ===
    TEAM_NOT_FOUND(2001, "Không tìm thấy nhóm.", NOT_FOUND),
    TEAM_NAME_REQUIRED(2002, "Vui lòng nhập tên nhóm.", BAD_REQUEST),
    USER_ALREADY_IN_TEAM(2003, "Người dùng đã là thành viên nhóm.", CONFLICT),
    ONLY_OWNER_CAN_REMOVE(2004, "Chỉ OWNER mới có quyền xoá thành viên.", FORBIDDEN),
    CANNOT_REMOVE_SELF(2005, "Không thể tự rời nhóm khi bạn là OWNER duy nhất.", BAD_REQUEST),
    DESCRIPTION_TOO_LONG(2006, "Mô tả nhóm tối đa 500 ký tự.", BAD_REQUEST),
    USER_NOT_IN_TEAM(2007, "Người dùng không phải là thành viên nhóm.", NOT_FOUND),
    NOT_JOINED_ANY_TEAM(2008, "Bạn chưa tham gia nhóm nào.", BAD_REQUEST),
    CANNOT_KICK_SELF(2010, "Bạn không thể xoá chính mình khỏi nhóm.", BAD_REQUEST),
    CANNOT_CHANGE_OWN_ROLE(2011, "Bạn không thể thay đổi vai trò của chính mình.", BAD_REQUEST),

    USER_ALREADY_INVITED(2013, "Người dùng đã được mời vào nhóm này.", CONFLICT),
    INVITATION_NOT_FOUND(2014, "Không tìm thấy lời mời tương ứng.", NOT_FOUND),
    TEAM_LIMIT_REACHED_FOR_FREE_USER(2015, "Tài khoản FREE chỉ được tham gia tối đa 5 nhóm.", BAD_REQUEST),
    INVITE_TOO_SOON(2016, "Vui lòng đợi 1 phút trước khi mời lại người dùng này.", BAD_REQUEST),
    MAX_TEAM_MEMBER_REACHED(2017, "Số lượng thành viên nhóm đã đạt giới hạn", BAD_REQUEST),
    TEAM_CREATE_LIMIT_FOR_FREE_USER(2018, "Tài khoản FREE chỉ được tạo tối đa 5 nhóm.", BAD_REQUEST),

    // === 300x: Password Policy ===
    CURRENT_PASSWORD_REQUIRED(3001, "Vui lòng nhập mật khẩu hiện tại.", BAD_REQUEST),
    NEW_PASSWORD_REQUIRED(3002, "Vui lòng nhập mật khẩu mới.", BAD_REQUEST),
    CONFIRMATION_PASSWORD_REQUIRED(3003, "Vui lòng nhập xác nhận mật khẩu.", BAD_REQUEST),

    // === 400x: Kanban ===
    TASK_NOT_FOUND(4001, "Không tìm thấy task.", NOT_FOUND),
    COLUMN_NOT_FOUND(4002, "Không tìm thấy cột Kanban.", NOT_FOUND),
    INVALID_COLUMN_POSITION(4003, "Vị trí của cột không hợp lệ.", BAD_REQUEST),
    TASK_TITLE_REQUIRED(4004, "Vui lòng nhập tiêu đề task.", BAD_REQUEST),
    COMMENT_NOT_FOUND(4005, "Không tìm thấy bình luận.", HttpStatus.NOT_FOUND),

    // === 410x: Subtask ===
    SUBTASK_NOT_FOUND(4101, "Không tìm thấy subtask.", NOT_FOUND),
    SUBTASK_INVALID_PARENT(4102, "Không hợp lệ vì task này không phải subtask.", BAD_REQUEST),
    SUBTASK_TITLE_REQUIRED(4103, "Vui lòng nhập nội dung subtask.", BAD_REQUEST),
    INVALID_SUBTASK_POSITION(4104, "Vị trí subtask không hợp lệ.", BAD_REQUEST),

    // === 500x: Notification ===
    NOTIFICATION_NOT_FOUND(5001, "Không tìm thấy thông báo.", NOT_FOUND),

    // === 600x: Payment ===
    SUBSCRIPTION_ALREADY_ACTIVE(6001, "Bạn đã có gói đăng ký đang hoạt động", CONFLICT),
    ;
    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}