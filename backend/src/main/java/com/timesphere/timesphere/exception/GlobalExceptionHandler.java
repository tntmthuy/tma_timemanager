package com.timesphere.timesphere.exception;

import com.timesphere.timesphere.dto.auth.ApiResponse;
import jakarta.validation.ConstraintViolation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.ObjectError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestControllerAdvice

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    private static final String MIN_ATTRIBUTE = "min";

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handlingRuntimeException(Exception exception) {
        log.error("Exception: ", exception);

        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .code(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode())
                .message(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage())
                .build();

        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse> handlingAppException(AppException exception) {
        ErrorCode errorCode = exception.getErrorCode();
        ApiResponse apiResponse = new ApiResponse();

        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(exception.getMessage()); // ✅ lấy message thực tế từ lỗi
        return ResponseEntity.status(errorCode.getStatusCode()).body(apiResponse);
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<ApiResponse> handlingAccessDeniedException(AccessDeniedException exception) {
        ErrorCode errorCode = ErrorCode.UNAUTHORIZED;

        return ResponseEntity.status(errorCode.getStatusCode())
                .body(ApiResponse.builder()
                        .code(errorCode.getCode())
                        .message(errorCode.getMessage())
                        .build());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse> handlingValidation(MethodArgumentNotValidException exception) {
        String enumKey = exception.getFieldError().getDefaultMessage();
        ErrorCode errorCode = ErrorCode.INVALID_KEY;
        Map<String, Object> attributes = null;

        try {
            errorCode = ErrorCode.valueOf(enumKey);

            // 👉 Đây là chỗ bạn chèn đoạn unwrap safely
            List<ObjectError> errors = exception.getBindingResult().getAllErrors();
            if (!errors.isEmpty()) {
                try {
                    ConstraintViolation<?> violation = errors.get(0).unwrap(ConstraintViolation.class);
                    attributes = violation.getConstraintDescriptor().getAttributes();
                    log.info(attributes.toString());
                } catch (Exception e) {
                    log.warn("Không thể unwrap violation", e);
                }
            }

        } catch (IllegalArgumentException e) {
            log.warn("Không tìm thấy ErrorCode tương ứng với enumKey: {}", enumKey);
        }

        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(
                Objects.nonNull(attributes)
                        ? mapAttribute(errorCode.getMessage(), attributes)
                        : errorCode.getMessage());

        return ResponseEntity.badRequest().body(apiResponse);
    }

    private String mapAttribute(String message, Map<String, Object> attributes) {
        String minValue = String.valueOf(attributes.get(MIN_ATTRIBUTE));

        return message.replace("{" + MIN_ATTRIBUTE + "}", minValue);
    }

    //bắt theem enum
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleEnumDeserialize(HttpMessageNotReadableException ex) {
        if (ex.getMostSpecificCause().getMessage().contains("Role")) {
            ApiResponse<Void> response = ApiResponse.<Void>builder()
                    .code(ErrorCode.ROLE_NOT_SUPPORTED.getCode())
                    .message(ErrorCode.ROLE_NOT_SUPPORTED.getMessage())
                    .build();
            return ResponseEntity.badRequest().body(response);
        }

        // fallback
        ApiResponse<Void> fallback = ApiResponse.<Void>builder()
                .code(ErrorCode.INVALID_KEY.getCode())
                .message("Dữ liệu không hợp lệ")
                .build();
        return ResponseEntity.badRequest().body(fallback);
    }


    //thiếu tham số
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiResponse<Void>> handleMissingParam(MissingServletRequestParameterException ex) {
        return ResponseEntity.badRequest().body(ApiResponse.<Void>builder()
                .code(ErrorCode.INVALID_KEY.getCode())
                .message("Thiếu tham số: " + ex.getParameterName())
                .build());
    }

    //gọi sai method
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiResponse<Void>> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex) {
        return ResponseEntity.status(405).body(ApiResponse.<Void>builder()
                .code(405)
                .message("Phương thức không được hỗ trợ!")
                .build());
    }


}
