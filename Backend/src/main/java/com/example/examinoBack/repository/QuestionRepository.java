package com.example.examinoBack.repository;

import com.example.examinoBack.model.Question;
import com.example.examinoBack.model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByDifficulty(String difficulty);
}
