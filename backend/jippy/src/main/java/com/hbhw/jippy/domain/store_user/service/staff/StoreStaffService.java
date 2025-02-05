package com.hbhw.jippy.domain.store_user.service.staff;

import com.hbhw.jippy.domain.store.repository.StoreRepository;
import com.hbhw.jippy.domain.store_user.dto.request.staff.UpdateStaffRequest;
import com.hbhw.jippy.domain.store_user.dto.response.staff.StaffResponse;
import com.hbhw.jippy.domain.store_user.entity.staff.StoreUserStaff;
import com.hbhw.jippy.domain.store_user.repository.staff.StoreStaffRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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
    private StoreUserStaff findStoreStaff(Integer storeId, Integer staffId) {
        return storeStaffRepository.findByStoreIdAndUserStaffId(storeId, staffId)
                .orElseThrow(() -> new EntityNotFoundException("해당 직원을 찾을 수 없습니다."));
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
}
