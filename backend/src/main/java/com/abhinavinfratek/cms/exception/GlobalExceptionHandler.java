package com.abhinavinfratek.cms.exception;

import com.abhinavinfratek.cms.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException exception,
            HttpServletRequest request
    ) {
        Map<String, String> errors = new LinkedHashMap<>();
        for (FieldError fieldError : exception.getBindingResult().getFieldErrors()) {
            errors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(buildError(HttpStatus.BAD_REQUEST, "Validation failed", request.getRequestURI(), errors));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(
            AuthenticationException exception,
            HttpServletRequest request
    ) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(buildError(HttpStatus.UNAUTHORIZED, exception.getMessage(), request.getRequestURI(), null));
    }

    @ExceptionHandler(AdminAccountException.class)
    public ResponseEntity<ErrorResponse> handleAdminAccountException(
            AdminAccountException exception,
            HttpServletRequest request
    ) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(buildError(HttpStatus.BAD_REQUEST, exception.getMessage(), request.getRequestURI(), null));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
            ResourceNotFoundException exception,
            HttpServletRequest request
    ) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(buildError(HttpStatus.NOT_FOUND, exception.getMessage(), request.getRequestURI(), null));
    }

    @ExceptionHandler(ImageUploadException.class)
    public ResponseEntity<ErrorResponse> handleImageUploadException(
            ImageUploadException exception,
            HttpServletRequest request
    ) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(buildError(HttpStatus.BAD_REQUEST, exception.getMessage(), request.getRequestURI(), null));
    }

    @SuppressWarnings("deprecation")
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorResponse> handleMaxUploadSizeExceededException(
            MaxUploadSizeExceededException exception,
            HttpServletRequest request
    ) {
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                .body(buildError(
                        HttpStatus.PAYLOAD_TOO_LARGE,
                        "Maximum allowed file size is 5 MB.",
                        request.getRequestURI(),
                        null
                ));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolationException(
            DataIntegrityViolationException exception,
            HttpServletRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(buildError(HttpStatus.CONFLICT, exception.getMessage(), request.getRequestURI(), null));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception exception, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(buildError(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred", request.getRequestURI(), null));
    }

    private ErrorResponse buildError(
            HttpStatus status,
            String message,
            String path,
            Map<String, String> validationErrors
    ) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .path(path)
                .validationErrors(validationErrors)
                .build();
    }
}
