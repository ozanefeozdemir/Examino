package com.example.examinoBack.repository;

import com.example.examinoBack.model.ExamAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExamAssignmentRepository extends JpaRepository<ExamAssignment, Long> {


    List<ExamAssignment> findByStudentIdAndCompletedFalse(Long studentId);

    List<ExamAssignment> findByExamId(Long examId);
    Optional<ExamAssignment> findByExamIdAndStudentId(Long examId, Long studentId);
}

