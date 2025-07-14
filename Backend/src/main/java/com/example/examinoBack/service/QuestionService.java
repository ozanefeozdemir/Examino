package com.example.examinoBack.service;


import com.example.examinoBack.model.Exam;
import com.example.examinoBack.model.Question;
import com.example.examinoBack.model.User;
import com.example.examinoBack.repository.ExamRepository;
import com.example.examinoBack.repository.QuestionRepository;
import com.example.examinoBack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final ExamRepository examRepository;
    private final UserRepository userRepository;

    public Question createQuestion(Question question) {
        return questionRepository.save(question);
    }
    public List<Question> createQuestions(List<Question> questions) {
        return questionRepository.saveAll(questions);
    }



    public Question addQuestion(Long examId, Question question) {
        String teacherEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        User teacher = userRepository.findByEmail(teacherEmail)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        // Sadece sınavın öğretmeni soru ekleyebilir
        if (!exam.getTeacher().getId().equals(teacher.getId())) {
            throw new RuntimeException("You are not authorized to add questions to this exam");
        }
        System.out.println(exam.getQuestions());

        exam.getQuestions().add(question);
        examRepository.save(exam);
        Question question_ = Question.builder()
                .text(question.getText())
                .correctOptionIndex(question.getCorrectOptionIndex())
                .options(question.getOptions())
                .build();
        System.out.println(exam.getQuestions());
        return questionRepository.save(question_);
    }

    public List<Question> getQuestionsByExam(Long examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        return exam.getQuestions();
    }

    public void deleteQuestion(Long questionId) {
        questionRepository.deleteById(questionId);
    }


    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Question updateQuestion(Long id, Question question) {
        System.out.println(question);
        Question q = questionRepository.findById(id).orElseThrow(() -> new RuntimeException("Question not found"));
        q.setText(question.getText());
        q.setCorrectOptionIndex(question.getCorrectOptionIndex());
        q.setOptions(question.getOptions());
        q.setDifficulty(question.getDifficulty());
        q.setId(id);
        return questionRepository.save(q);
    }
}