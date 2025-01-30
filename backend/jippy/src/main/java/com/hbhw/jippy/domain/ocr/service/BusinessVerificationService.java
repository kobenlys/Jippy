package com.hbhw.jippy.domain.ocr.service;

import com.hbhw.jippy.domain.ocr.dto.response.BusinessVerificationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BusinessVerificationService {

    private final RestTemplate restTemplate;

    @Value("${api.nts.service-key}")
    private String serviceKey;

    @Value("${api.nts.url}")
    private String ntsApiUrl;

    public BusinessVerificationResponse verifyBusinessNumber(String businessNumber) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("b_no", Collections.singletonList(businessNumber));

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        String url = ntsApiUrl + "?serviceKey=" + serviceKey;

        return restTemplate.postForObject(url, requestEntity, BusinessVerificationResponse.class);
    }
}