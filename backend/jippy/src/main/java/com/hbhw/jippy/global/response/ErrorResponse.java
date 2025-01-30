package com.hbhw.jippy.global.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.hbhw.jippy.global.code.ErrorCode;
import com.hbhw.jippy.utils.EnvironmentUtil;
import jakarta.validation.ConstraintViolation;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ErrorResponse {

    private HttpStatus status;
    private String code;
    private String message;
    private boolean success;
    private List<CustomFieldError> errors;

    private ErrorResponse(ErrorCode errorCode, String errorMessage) {
        this.status = errorCode.getStatus();
        this.code = errorCode.getCode();
        this.message = errorMessage;
        this.success = false;
        this.errors = new ArrayList<>();
    }

    private ErrorResponse(ErrorCode errorCode, String errorMessage, List<CustomFieldError> errors) {
        this.status = errorCode.getStatus();
        this.code = errorCode.getCode();
        this.message = errorMessage;
        this.success = false;
        this.errors = errors;
    }

    // 입력받은 유효성 검사 @Vaild, @Validated 중 검증 실패시 발생
    public static ErrorResponse of(final ErrorCode errorCode, final BindingResult bindingResult) {
        return new ErrorResponse(errorCode, getSafeMessage(errorCode.getMessage()), CustomFieldError.of(bindingResult));
    }

    // NullPointer에러 처리 등 메세지와 에러 코드만 전달할때.
    public static ErrorResponse of(final ErrorCode errorCode, final String errorMessage) {
        return new ErrorResponse(errorCode, getSafeMessage(errorCode.getMessage()), CustomFieldError.of("", "", errorMessage));
    }

    // ConstraintViolation 예외 처리
    public static ErrorResponse of(final ErrorCode errorCode, final Set<ConstraintViolation<?>> constraintViolations) {
        return new ErrorResponse(errorCode, getSafeMessage(errorCode.getMessage()), CustomFieldError.of(constraintViolations));
    }

    // 파라미터의 값이 입력이 안되어었을때 예외처리.
    public static ErrorResponse of(final ErrorCode errorCode, final MissingServletRequestParameterException missingServletRequestParameterException) {
        return new ErrorResponse(errorCode, getSafeMessage(errorCode.getMessage()), CustomFieldError.of(missingServletRequestParameterException));
    }

    // 파라미터로 전달된 값이 타입이 맞지 않을때 발생
    public static ErrorResponse of(final ErrorCode errorCode, final MethodArgumentTypeMismatchException methodArgumentTypeMismatchException) {
        return new ErrorResponse(errorCode, getSafeMessage(errorCode.getMessage()), CustomFieldError.of(methodArgumentTypeMismatchException));
    }

    public static ErrorResponse of(final ErrorCode errorCode) {
        return new ErrorResponse(errorCode, getSafeMessage(errorCode.getMessage()));
    }

    public static ErrorResponse of(final ErrorCode errorCode, final List<CustomFieldError> errors) {
        return new ErrorResponse(errorCode, getSafeMessage(errorCode.getMessage()), errors);
    }

    private static String getSafeMessage(String devMessage) {
        return EnvironmentUtil.isProduction() ?
                "예기치 않은 오류가 발생했습니다. 다시 시도하거나, 에러 코드를 고객센터에 전달해 주세요." : devMessage;
    }

    @Getter
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class CustomFieldError {
        private String field;
        private String value;
        private String reason;

        public CustomFieldError(String field, String reason) {
            this.field = field;
            this.reason = reason;
        }

        public CustomFieldError(String field, String value, String reason) {
            this.field = field;
            this.value = value;
            this.reason = reason;
        }

        // 기본 커스텀에러 객체
        public static List<CustomFieldError> of(String field, String reason) {
            List<CustomFieldError> errorList = new ArrayList<>();
            errorList.add(new CustomFieldError(field, reason));
            return errorList;
        }

        // 기본 커스텀에러 객체
        public static List<CustomFieldError> of(String field, String value, String reason) {
            List<CustomFieldError> errorList = new ArrayList<>();
            errorList.add(new CustomFieldError(field, value, reason));
            return errorList;
        }

        // @Valid, @Validated 으로 필드에 대한 검증결과 응답
        public static List<CustomFieldError> of(BindingResult bindingResult) {
            boolean isProd = EnvironmentUtil.isProduction();
            return bindingResult.getFieldErrors().stream()
                    .map(error -> new CustomFieldError(
                            error.getField(),
                            isProd ? "******" : error.getRejectedValue().toString(),
                            isProd ? "입력값에 문제가 발생했습니다. 다시 시도해 주세요" : error.getDefaultMessage()
                    )).collect(Collectors.toList());
        }

        // 객체에 대한 검증결과 응답
        public static List<CustomFieldError> of(Set<ConstraintViolation<?>> constraintViolation) {
            //List<ConstraintViolation<?>> errorList = new ArrayList<>(constraintViolation);
            final boolean isProd = EnvironmentUtil.isProduction();
            return constraintViolation.stream()
                    .map(error -> new CustomFieldError(
                            error.getPropertyPath().toString(),
                            isProd ? "잘못된 입력입니다. 다시 시도해 주세요" : error.getMessage()
                    )).collect(Collectors.toList());
        }

        // 메서드 파라미터타입이 기대한 타입과 다를때 발생
        public static List<CustomFieldError> of(final MethodArgumentTypeMismatchException e) {
            final boolean isProd = EnvironmentUtil.isProduction();
            return CustomFieldError.of(e.getName(), e.getValue().toString(), isProd ? "잘못된 경로입니다. 다시 시도해 주세요" : e.getErrorCode());
        }

        // URL에 쿼리 파라미터 누락시 발생
        public static List<CustomFieldError> of(final MissingServletRequestParameterException e) {
            final boolean isProd = EnvironmentUtil.isProduction();
            return CustomFieldError.of(isProd ? null: e.getParameterName(), e.getMessage());
        }
    }
}
