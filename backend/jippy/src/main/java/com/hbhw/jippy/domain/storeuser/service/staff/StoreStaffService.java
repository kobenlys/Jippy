package com.hbhw.jippy.domain.storeuser.service.staff;

import com.hbhw.jippy.domain.store.entity.Store;
import com.hbhw.jippy.domain.store.repository.StoreRepository;
import com.hbhw.jippy.domain.storeuser.dto.request.staff.UpdateStaffRequest;
import com.hbhw.jippy.domain.storeuser.dto.response.staff.StaffResponse;
import com.hbhw.jippy.domain.storeuser.entity.staff.StoreUserStaff;
import com.hbhw.jippy.domain.storeuser.repository.staff.StoreStaffRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class StoreStaffService {
    private final StoreStaffRepository storeStaffRepository;
    private final StoreRepository storeRepository;

    @Transactional(readOnly = true)
    public List<StaffResponse> getStaffList(Integer storeId) {
        validateStore(storeId);

        return storeStaffRepository.findAllByStoreIdWithUserStaff(storeId).stream()
                .map(StaffResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StaffResponse getStaff(Integer storeId, Integer staffId) {
        validateStore(storeId);
        StoreUserStaff staff = findStoreStaff(storeId, staffId);
        return new StaffResponse(staff);
    }

    public StaffResponse updateStaff(Integer storeId, Integer staffId, UpdateStaffRequest request) {
        validateStore(storeId);
        StoreUserStaff staff = findStoreStaff(storeId, staffId);
        updateStaffInfo(staff, request);
        return new StaffResponse(staff);
    }

    public void deleteStaff(Integer storeId, Integer staffId) {
        validateStore(storeId);
        StoreUserStaff staff = findStoreStaff(storeId, staffId);
        storeStaffRepository.delete(staff);
    }

    /**
     * 매장 존재 여부 확인 메서드
     */
    private void validateStore(Integer storeId) {
        storeRepository.findById(storeId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 매장입니다."));
    }

    /**
     * 매장 직원 찾는 메서드
     */
    private StoreUserStaff findStoreStaff(Integer storeId, Integer storeUserStaffId) {
        StoreUserStaff staff = storeStaffRepository.findById(storeUserStaffId)
                .orElseThrow(() -> new EntityNotFoundException("해당 직원을 찾을 수 없습니다."));

        if (!staff.getStore().getId().equals(storeId)) {
            throw new IllegalArgumentException("해당 직원은 이 매장에 소속되어 있지 않습니다.");
        }

        return staff;
    }

    /**
     * 정보 수정 메서드
     */
    private void updateStaffInfo(StoreUserStaff staff, UpdateStaffRequest request) {
        if (request.getStaffType() != null) {
            staff.updateStaffType(request.getStaffType());
        }

        if (request.getStaffSalary() != null) {
            staff.updateStaffSalary(request.getStaffSalary());
        }

        if (request.getStaffSalaryType() != null) {
            staff.updateStaffSalaryType(request.getStaffSalaryType());
        }
    }

    /**
     * 그룹 채팅 멤버들에게 알림 전송을 위한 FCM 토큰 목록을 조회
     * 여기서는 매장 소속 직원과 매장 사장님(UserOwner)의 fcmToken을 모두 포함
     */
    public List<String> getAllChatMemberFcmTokens(Integer storeId) {
        // 1. 직원의 fcmToken 조회
        List<String> fcmTokens = storeStaffRepository.findByStoreId(storeId).stream()
                .map(staff -> staff.getUserStaff().getFcmToken())
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        // 2. 매장 사장님 fcmToken 조회
        Optional<Store> storeOpt = storeRepository.findById(storeId);
        if (storeOpt.isPresent() && storeOpt.get().getUserOwner() != null) {
            String ownerToken = storeOpt.get().getUserOwner().getFcmToken();
            if (ownerToken != null && !ownerToken.isEmpty()) {
                fcmTokens.add(ownerToken);
            }
        }

        return fcmTokens;
    }
}
