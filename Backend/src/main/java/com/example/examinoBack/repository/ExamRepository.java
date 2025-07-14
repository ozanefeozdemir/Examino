package com.example.examinoBack.repository;


import com.example.examinoBack.model.Exam;
import com.example.examinoBack.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByTeacher(User teacher);

    List<Exam> findByTeacherId(Long id);


    @Query("select e.teacher.fullName from Exam e where e.id = :examId")
    String findTeacherByExamId(@Param("examId") Long examId);
}