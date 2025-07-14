package com.example.examinoBack.service;


import com.example.examinoBack.dto.StudentAnswerRequest;
import com.example.examinoBack.model.*;
import com.example.examinoBack.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentAnswerService {

    private final StudentAnswerRepository answerRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final ExamRepository examRepository;
    private final ResultService resultService;
    private final StudentAnswerRepository studentAnswerRepository;

    public void saveAnswers(List<StudentAnswerRequest> answers, String studentEmail, Long examId) {
        int correctCount = 0;
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Öğrenci bulunamadı"));
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Sınav bulunamadı"));

        for (StudentAnswerRequest answerRequest : answers) {
            Question question = questionRepository.findById(answerRequest.getQuestionId())
                    .orElseThrow(() -> new RuntimeException("Soru bulunamadı"));

            String correctAnswer = question.getOptions().get(question.getCorrectOptionIndex());
            if (correctAnswer.equals(answerRequest.getAnswerText())) {
                correctCount++;
            }

            StudentAnswer answer = StudentAnswer.builder()
                    .student(student)
                    .question(question)
                    .exam(exam)
                    .answerText(answerRequest.getAnswerText())
                    .build();

            answerRepository.save(answer); // her soruyu ayrı ayrı kaydet
        }

        Result result = Result.builder()
                .correctAnswers(correctCount)
                .score(((double) correctCount / exam.getQuestions().size()) * 100)
                .student(student)
                .exam(exam)
                .solveDate(new Date())
                .totalQuestions(exam.getQuestions().size())
                .build();

        resultService.saveResult(result);
    }

    public List<StudentAnswer> getAnswers(Long studentId, Long examId) {
        System.out.println(studentAnswerRepository.findByStudentIdAndExamId(studentId, examId));
        return studentAnswerRepository.findByStudentIdAndExamId(studentId,examId );
    }
    public boolean hasStudentTakenExam(Long examId, String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        return studentAnswerRepository.existsByExamIdAndStudentId(examId, student.getId());
    }



}