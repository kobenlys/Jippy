package com.hbhw.jippy.domain.cash.service;

import com.hbhw.jippy.domain.cash.dto.request.CashRequest;
import com.hbhw.jippy.domain.cash.dto.response.CashResponse;
import com.hbhw.jippy.domain.cash.entity.Cash;
import com.hbhw.jippy.domain.cash.repository.CashRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CashService {

    private final CashRepository cashRepository;

    @Transactional
    public CashResponse createCash(Integer storeId, CashRequest request) {
        if (cashRepository.existsByStoreId(storeId)) {
            throw new IllegalArgumentException("이미 해당 매장의 시재 정보가 존재합니다");
        }

        Cash cash = Cash.builder()
                .storeId(storeId)
                .fiftyThousandWon(request.getFiftyThousandWon())
                .fiveThousandWon(request.getFiveThousandWon())
                .tenThousandWon(request.getTenThousandWon())
                .oneThousandWon(request.getOneThousandWon())
                .fiveHundredWon(request.getFiveHundredWon())
                .oneHundredWon(request.getOneHundredWon())
                .fiftyWon(request.getFiftyWon())
                .tenWon(request.getTenWon())
                .build();

        Cash savedCash = cashRepository.save(cash);

        return CashResponse.builder()
                .id(savedCash.getId())
                .storeId(savedCash.getStoreId())
                .fiftyThousandWon(savedCash.getFiftyThousandWon())
                .fiveThousandWon(savedCash.getFiveThousandWon())
                .tenThousandWon(savedCash.getTenThousandWon())
                .oneThousandWon(request.getOneThousandWon())
                .fiveHundedWon(savedCash.getFiveHundredWon())
                .oneHundredWon(savedCash.getOneHundredWon())
                .fiftyWon(savedCash.getFiftyWon())
                .tenWon(savedCash.getTenWon())
                .build();
    }

    @Transactional
    public CashResponse updateCash(Integer storeId, CashRequest request) {

        Cash cash = cashRepository.findByStoreId(storeId)
                .orElseThrow(() -> new IllegalStateException("해당 매장의 시재 정보가 존재하지 않습니다"));

        cash.setFiftyThousandWon(request.getFiftyThousandWon());
        cash.setTenThousandWon(request.getTenThousandWon());
        cash.setFiveThousandWon(request.getFiveThousandWon());
        cash.setOneThousandWon(request.getOneThousandWon());
        cash.setFiveHundredWon(request.getFiveHundredWon());
        cash.setOneHundredWon(request.getOneHundredWon());
        cash.setFiftyWon(request.getFiftyWon());
        cash.setTenWon(request.getTenWon());

        Cash updatedCash = cashRepository.save(cash);

        return CashResponse.builder()
                .id(updatedCash.getId())
                .storeId(updatedCash.getStoreId())
                .fiftyThousandWon(updatedCash.getFiftyThousandWon())
                .tenThousandWon(updatedCash.getTenThousandWon())
                .fiveThousandWon(updatedCash.getFiveThousandWon())
                .oneThousandWon(updatedCash.getOneThousandWon())
                .fiveHundedWon(updatedCash.getFiveHundredWon())
                .oneHundredWon(updatedCash.getOneHundredWon())
                .fiftyWon(updatedCash.getFiftyWon())
                .tenWon(updatedCash.getTenWon())
                .build();
    }
}
