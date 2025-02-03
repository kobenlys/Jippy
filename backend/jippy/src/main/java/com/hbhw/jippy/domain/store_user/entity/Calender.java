package com.hbhw.jippy.domain.store_user.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "calender")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Calender {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_user_staff_id", nullable = false)
    private StoreUserStaff storeUserStaff;

    /**
     * @Column(name = "day_of_week")
     * @Convert(converter = DayOfWeekConverter.class)
     * private DayOfWeek dayOfWeek;
     */

    @Column(name = "start_time", nullable = false, length = 20)
    private String startTime;

    @Column(name = "end_time", nullable = false, length = 20)
    private String endTime;
}
