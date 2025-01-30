package com.hbhw.jippy.domain.ocr.controller;

import com.hbhw.jippy.domain.ocr.dto.response.BusinessVerificationResponse;
import com.hbhw.jippy.domain.ocr.dto.response.OcrResponse;
import com.hbhw.jippy.domain.ocr.service.BusinessVerificationService;
import com.hbhw.jippy.domain.ocr.service.OcrService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/business")
@RequiredArgsConstructor
public class BusinessRegistrationController {

    private final OcrService ocrService;
    private final BusinessVerificationService verificationService;

    @PostMapping("/verify")
    public ResponseEntity<?> verifyBusinessRegistration(@RequestParam("document") MultipartFile image) {
        try {
            // Perform OCR
            OcrResponse ocrResponse = ocrService.performOcr(image);

            // Extract business registration number
            String businessNumber = extractBusinessNumber(ocrResponse);
            if (businessNumber == null) {
                return ResponseEntity.badRequest().body("Business registration number not found in the image");
            }

            // Verify the business number
            BusinessVerificationResponse verificationResponse = verificationService.verifyBusinessNumber(businessNumber);

            return ResponseEntity.ok(verificationResponse);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing request: " + e.getMessage());
        }
    }

    private String extractBusinessNumber(OcrResponse ocrResponse) {
        // Combine all text from OCR response
        String combinedText = String.join(" ", ocrResponse.getPages().stream()
                .flatMap(page -> page.getWords().stream())
                .map(word -> word.getText())
                .toList());

        // Pattern for business registration number (XXX-XX-XXXXX)
        Pattern pattern = Pattern.compile("\\b(\\d{3}-\\d{2}-\\d{5})\\b");
        Matcher matcher = pattern.matcher(combinedText);

        if (matcher.find()) {
            return matcher.group(1).replaceAll("-", "");
        }
        return null;
    }
}