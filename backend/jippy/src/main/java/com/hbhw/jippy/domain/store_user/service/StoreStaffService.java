package com.hbhw.jippy.domain.store_user.service;

import com.hbhw.jippy.domain.store_user.dto.request.CreateStaffRequest;
import com.hbhw.jippy.domain.store_user.dto.response.StaffListResponse;
import com.hbhw.jippy.domain.store_user.entity.StoreUserStaff;
import com.hbhw.jippy.domain.store_user.repository.StoreStaffRepository;
import com.hbhw.jippy.domain.user.entity.UserStaff;
import com.hbhw.jippy.domain.user.enums.StaffType;
import com.hbhw.jippy.domain.user.repository.UserStaffRepository;
import com.hbhw.jippy.global.auth.UserPrincipal;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class StoreStaffService {
    private final UserStaffRepository userStaffRepository;
    private final StoreStaffRepository storeStaffRepository;

    public void createStaff(Integer storeId, CreateStaffRequest request) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        UserStaff staff = userStaffRepository.findById(principal.getId())
                .orElseThrow(() -> new EntityNotFoundException("유저를 찾을 수 없습니다."));

        if (storeStaffRepository.existsByStoreIdAndUserStaff(storeId, staff)) {
            throw new IllegalArgumentException("이미 등록된 직원입니다.");
        }

        StoreUserStaff storeUserStaff = StoreUserStaff.builder()
                .userStaff(staff)
                .storeId(storeId)
                .staffType(StaffType.직원)
                .staffSalary(request.getStaffSalary())
                .staffSalaryType(request.getStaffSalaryType())
                .build();

        storeStaffRepository.save(storeUserStaff);
    }

    @Transactional(readOnly = true)
    public List<StaffListResponse> getStaffList(Integer storeId) {
        List<StoreUserStaff> staffList = storeStaffRepository.findAllByStoreIdWithUserStaff(storeId);
        return staffList.stream()
                .map(StaffListResponse::new)
                .collect(Collectors.toList());
    }

    public void updateStaffInfo(Integer storeId, Integer staffId) {
        StoreUserStaff storeUserStaff = findStoreStaff(storeId, staffId);
        storeUserStaff.updateStaffType(StaffType.매니저);
    }

    public void deleteStaff(Integer storeId, Integer staffId) {
        StoreUserStaff storeUserStaff = findStoreStaff(storeId, staffId);
        storeStaffRepository.delete(storeUserStaff);
    }

    private StoreUserStaff findStoreStaff(Integer storeId, Integer staffId) {
        return storeStaffRepository.findByStoreIdAndUserStaffId(storeId, staffId)
                .orElseThrow(() -> new EntityNotFoundException("해당 직원을 찾을 수 없습니다."));
    }
}
