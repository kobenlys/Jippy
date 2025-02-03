package com.hbhw.jippy.domain.ocr.controller;

import com.hbhw.jippy.domain.ocr.dto.response.OcrExtractedData;
import com.hbhw.jippy.domain.ocr.service.OcrService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/ocr")
@RequiredArgsConstructor
public class OcrController {

    private final OcrService ocrService;

    @PostMapping
    public ResponseEntity<OcrExtractedData> performOcr(@RequestParam("document") MultipartFile image) {
        try {
            // OCR 수행 후, 필요한 4가지 정보가 담긴 DTO 반환
            OcrExtractedData extractedData = ocrService.performOcr(image);
            return ResponseEntity.ok(extractedData);

        } catch (Exception e) {
            // 에러 처리
            return ResponseEntity.internalServerError().build();
        }
    }

}
