package com.hbhw.jippy.domain.store_user.dto.response;

import com.hbhw.jippy.domain.store_user.entity.StoreUserStaff;
import com.hbhw.jippy.domain.user.enums.StaffType;
import lombok.Getter;

@Getter
public class StaffListResponse {
    private Integer staffId;
    private String staffName;
    private StaffType staffType;

    public StaffListResponse(StoreUserStaff storeUserStaff) {
        this.staffId = storeUserStaff.getUserStaff().getId();
        this.staffName = storeUserStaff.getUserStaff().getName();
        this.staffType = storeUserStaff.getStaffType();
    }
}
