package com.hbhw.jippy.domain.ocr.service;

import com.hbhw.jippy.domain.ocr.dto.response.OcrResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class OcrService {

    private final RestTemplate restTemplate;

    @Value("${api.upstage.key}")
    private String apiKey;

    @Value("${api.upstage.url}")
    private String upstageApiUrl;

    public OcrResponse performOcr(MultipartFile file) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.set("Authorization", "Bearer " + apiKey);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        };
        // Changed from 'image' to 'document' to match the API specification
        body.add("document", fileResource);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<OcrResponse> response = restTemplate.postForEntity(
                upstageApiUrl,
                requestEntity,
                OcrResponse.class
        );

        return response.getBody();
    }
}