package com.example.examinoBack.repository;

import com.example.examinoBack.model.Result;
import com.example.examinoBack.model.Exam;
import com.example.examinoBack.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ResultRepository extends JpaRepository<Result, Long> {
    Optional<Result> findByStudentAndExam(User student, Exam exam);
    List<Result> findByStudentId(Long id);
    List<Result> findByExamId(Long id);

    List<Result> findByStudentEmail(String studentEmail);

    List<Result> findByExamTeacherEmail(String teacherEmail);


    @Query("SELECT r.student.fullName FROM Result r WHERE r.exam.id = :examId")
    List<String> findStudentByExamId(Long examId);

    @Query("select r.exam from Result r where r.id = :resultId")
    Exam findExamByResultId(@Param("resultId") Long resultId);
}