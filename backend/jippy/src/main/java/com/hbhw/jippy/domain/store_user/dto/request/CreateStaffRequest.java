package com.hbhw.jippy.domain.store_user.dto.request;

import com.hbhw.jippy.domain.store_user.enums.StaffSalaryType;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CreateStaffRequest {
    @NotNull(message = "급여를 입력해주세요.")
    private Integer staffSalary;

    @NotNull(message = "급여 타입을 입력해주세요.")
    private StaffSalaryType staffSalaryType;
}
