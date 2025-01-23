package com.hbhw.jippy.domain.user.converter;

import com.hbhw.jippy.domain.user.enumeration.StaffType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Optional;

@Converter(autoApply = true)
public class StaffTypeConverter implements AttributeConverter<StaffType, Integer> {
    @Override
    public Integer convertToDatabaseColumn(StaffType type) {
        return Optional.ofNullable(type)
                .map(StaffType::getCode)
                .orElseThrow(() -> new IllegalArgumentException("StaffType cannot be null"));
    }

    @Override
    public StaffType convertToEntityAttribute(Integer code) {
        if (code == null) {
            throw new IllegalArgumentException("StaffType code cannot be null");
        }
        return StaffType.ofLegacyCode(code);
    }
}
