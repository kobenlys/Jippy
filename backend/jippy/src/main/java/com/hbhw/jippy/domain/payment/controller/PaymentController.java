package com.hbhw.jippy.domain.payment.controller;

import com.hbhw.jippy.domain.payment.dto.request.ConfirmCashPaymentRequest;
import com.hbhw.jippy.domain.payment.service.PaymentService;
import com.hbhw.jippy.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("api/payment")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/cash/confirm")
    public ApiResponse<?> confirmCashPayment(@RequestBody ConfirmCashPaymentRequest confirmCashPaymentRequest) {
        log.info("confirmCashPayment : {}", confirmCashPaymentRequest);
        paymentService.CashPaymentConfirm(confirmCashPaymentRequest);
        return ApiResponse.success(HttpStatus.CREATED);
    }


}
