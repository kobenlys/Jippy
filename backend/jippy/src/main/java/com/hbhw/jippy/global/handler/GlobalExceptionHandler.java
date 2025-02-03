package com.hbhw.jippy.global.handler;

import com.hbhw.jippy.global.code.CommonErrorCode;
import com.hbhw.jippy.global.response.ErrorResponse;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.NoSuchElementException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<ErrorResponse> handlerMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        final ErrorResponse errorResponse = ErrorResponse.of(CommonErrorCode.INVALID_INPUT_VALUE, e.getBindingResult());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BindException.class)
    protected ResponseEntity<ErrorResponse> hanlderBindException(BindException e) {
        final ErrorResponse errorResponse = ErrorResponse.of(CommonErrorCode.INVALID_INPUT_VALUE, e.getBindingResult());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    protected ResponseEntity<ErrorResponse> handlerConstraintViolationException(ConstraintViolationException e) {
        final ErrorResponse errorResponse = ErrorResponse.of(CommonErrorCode.INVALID_INPUT_VALUE, e.getConstraintViolations());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(NullPointerException.class)
    protected ResponseEntity<ErrorResponse> handlerNullPointerException(NullPointerException e) {
        final ErrorResponse errorResponse = ErrorResponse.of(CommonErrorCode.NULL_POINT, e.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    protected ResponseEntity<ErrorResponse> handlerMissingServletRequestParameterException(MissingServletRequestParameterException e) {
        final ErrorResponse errorResponse = ErrorResponse.of(CommonErrorCode.MISSING_REQUEST_PARAMS, e);
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    protected ResponseEntity<ErrorResponse> handlerMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException e) {
        final ErrorResponse errorResponse = ErrorResponse.of(CommonErrorCode.TYPE_MISMATCH, e);
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    protected ResponseEntity<ErrorResponse> handlerNoResourceFoundException(NoResourceFoundException e) {
        final ErrorResponse errorResponse = ErrorResponse.of(CommonErrorCode.NOT_FOUND, e);
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(NoSuchElementException.class)
    protected ResponseEntity<ErrorResponse> handlerNoSuchElementException(NoSuchElementException e) {
        final ErrorResponse errorResponse = ErrorResponse.of(CommonErrorCode.NOT_FOUND, e);
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    protected ResponseEntity<ErrorResponse> handlerException(Exception e) {
        final ErrorResponse errorResponse = ErrorResponse.of(CommonErrorCode.INTERNAL_SERVER_ERROR, e.getMessage());
        log.error(e.getClass().getName());
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
