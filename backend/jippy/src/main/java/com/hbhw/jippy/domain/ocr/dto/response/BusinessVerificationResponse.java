package com.hbhw.jippy.domain.ocr.dto.response;

import lombok.Data;
import java.util.List;

@Data
public class BusinessVerificationResponse {
    private Integer requestCnt;
    private Integer statusCode;
    private String message;
    private List<BusinessStatus> data;

    @Data
    public static class BusinessStatus {
        private String b_no;           // 사업자등록번호
        private String b_stt;          // 납세자상태(명칭)
        private String b_stt_cd;       // 납세자상태(코드)
        private String tax_type;       // 과세유형
        private String tax_type_cd;    // 과세유형(코드)
    }
}