package com.hbhw.jippy.global.error;

import com.hbhw.jippy.global.code.ErrorCode;
import com.hbhw.jippy.global.response.ErrorResponse;

import java.util.List;

public class BusinessException extends RuntimeException {
    private ErrorCode errorCode;
    private List<ErrorResponse.CustomFieldError> errorList;

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public BusinessException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public BusinessException(ErrorCode errorCode, List<ErrorResponse.CustomFieldError> errorList) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
        this.errorList = errorList;
    }
}