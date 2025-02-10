package com.hbhw.jippy.domain.store.service;

import com.hbhw.jippy.domain.store.dto.request.StoreCreateRequest;
import com.hbhw.jippy.domain.store.dto.request.StoreUpdateRequest;
import com.hbhw.jippy.domain.store.dto.response.StoreResponse;
import com.hbhw.jippy.domain.store.entity.Store;
import com.hbhw.jippy.domain.store.repository.StoreRepository;
import com.hbhw.jippy.domain.user.entity.UserOwner;
import com.hbhw.jippy.domain.user.repository.UserOwnerRepository; // 예시
import com.hbhw.jippy.global.code.CommonErrorCode;
import com.hbhw.jippy.global.error.BusinessException;
import lombok.Builder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class StoreService {

    private final StoreRepository storeRepository;
    private final UserOwnerRepository userOwnerRepository; // 점주 조회용 (예시)

    @Builder
    public StoreService(StoreRepository storeRepository, UserOwnerRepository userOwnerRepository) {
        this.storeRepository = storeRepository;
        this.userOwnerRepository = userOwnerRepository;
    }

    @Transactional
    public StoreResponse createStore(StoreCreateRequest request) {
        // UserOwner 조회
        UserOwner userOwner = userOwnerRepository.findById(request.getUserOwnerId())
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 점주입니다."));

        // 엔티티 빌드
        Store store = Store.builder()
                .userOwner(userOwner)
                .name(request.getName())
                .address(request.getAddress())
                .openingDate(request.getOpeningDate())
                .totalCash(request.getTotalCash())
                .businessRegistrationNumber(request.getBusinessRegistrationNumber())
                .build();

        // 저장
        Store saved = storeRepository.save(store);
        return toResponse(saved);
    }


    @Transactional
    public StoreResponse updateStore(Integer storeId, StoreUpdateRequest request) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new BusinessException(CommonErrorCode.NOT_FOUND, "해당 매장은 존재하지 않습니다."));

        store.setName(request.getName());
        store.setAddress(request.getAddress());
        store.setOpeningDate(request.getOpeningDate());
        store.setTotalCash(request.getTotalCash());

        // 변경 사항 자동 감지(더티 체크)로 업데이트
        return toResponse(store);
    }

    @Transactional(readOnly = true)
    public List<StoreResponse> getStores() {
        List<Store> storeList = storeRepository.findAll();
        return storeList.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }


    @Transactional(readOnly = true)
    public StoreResponse getStore(Integer storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new BusinessException(CommonErrorCode.NOT_FOUND, "해당 매장은 존재하지 않습니다."));
        return toResponse(store);
    }

    public Store getStoreEntity(Integer storeId) {
        return storeRepository.findById(storeId)
                .orElseThrow(() -> new BusinessException(CommonErrorCode.NOT_FOUND, "해당 매장은 존재하지 않습니다."));
    }


    @Transactional
    public void deleteStore(Integer storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new BusinessException(CommonErrorCode.NOT_FOUND, "해당 매장은 존재하지 않습니다."));
        storeRepository.delete(store);
    }

    /**
     * 엔티티 -> 응답 DTO 변환
     */
    private StoreResponse toResponse(Store store) {
        return StoreResponse.builder()
                .id(store.getId())
                .userOwnerId(store.getUserOwner().getId()) // UserOwner의 PK
                .name(store.getName())
                .address(store.getAddress())
                .openingDate(store.getOpeningDate())
                .totalCash(store.getTotalCash())
                .businessRegistrationNumber(store.getBusinessRegistrationNumber())
                .build();
    }
}
