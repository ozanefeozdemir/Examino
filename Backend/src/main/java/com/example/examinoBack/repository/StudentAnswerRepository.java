package com.example.examinoBack.repository;

import com.example.examinoBack.dto.StudentAnswerRequest;
import com.example.examinoBack.model.StudentAnswer;
import com.example.examinoBack.model.User;
import com.example.examinoBack.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface StudentAnswerRepository extends JpaRepository<StudentAnswer, Long> {
    List<StudentAnswer> findByStudent(User student);
    List<StudentAnswer> findByStudentId(Long studentId);
    Optional<StudentAnswer> findByStudentAndQuestion(User student, Question question);

    //@Query("select StudentAnswer from StudentAnswer where exam.id = :examId and student.id = :studentId")
    List<StudentAnswer> findByStudentIdAndExamId(Long studentId, Long examId);

    List<StudentAnswer> findByExamId(Long examId);

    List<StudentAnswer> findByStudentEmailAndExamId(String email, Long examId);

    Boolean existsByExamIdAndStudentId(Long examId, Long studentId);

}
