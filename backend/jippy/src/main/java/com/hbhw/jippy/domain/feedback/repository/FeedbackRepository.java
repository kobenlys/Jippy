package com.hbhw.jippy.domain.feedback.repository;

import com.hbhw.jippy.domain.feedback.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {



}
