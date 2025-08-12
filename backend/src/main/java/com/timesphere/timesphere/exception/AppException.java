package com.timesphere.timesphere.exception;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppException extends RuntimeException {

    public AppException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public AppException(ErrorCode errorCode, String customMessage) {
        super(customMessage); // hoặc vẫn dùng errorCode.getMessage() nếu muốn giữ message cứng
        this.errorCode = errorCode;
    }

    private ErrorCode errorCode;

}