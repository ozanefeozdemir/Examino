package com.example.examinoBack.service;


import com.example.examinoBack.dto.AutoExamRequest;
import com.example.examinoBack.model.*;
import com.example.examinoBack.repository.ExamAssignmentRepository;
import com.example.examinoBack.repository.ExamRepository;
import com.example.examinoBack.repository.QuestionRepository;
import com.example.examinoBack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamService {

    private final ExamRepository examRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final ExamAssignmentRepository examAssignmentRepository;

    public Exam createExam(Exam exam, String teacherEmail) {
        User teacher = userRepository.findByEmail(teacherEmail)
                .orElseThrow(() -> new RuntimeException("Teacher not found email: " + teacherEmail));

        if (teacher.getRole() != Role.TEACHER) {
            throw new RuntimeException("Only teachers can create exams");
        }

        exam.setTeacher(teacher);
        System.out.println(exam.getDuration());
        return examRepository.save(exam);
    }

    @Transactional
    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    public List<Exam> getAssignedExamsByEmail(String email) {
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Öğrenci bulunamadı"));

        List<ExamAssignment> assignments = examAssignmentRepository.findByStudentIdAndCompletedFalse(student.getId());

        return assignments.stream()
                .map(ExamAssignment::getExam)
                .collect(Collectors.toList());
    }


    public List<Exam> getExamsByTeacher(String teacherEmail) {
        User teacher = userRepository.findByEmail(teacherEmail)
                .orElseThrow(() -> new RuntimeException("Teacher not found email " + teacherEmail));

        return examRepository.findByTeacherId(teacher.getId());
    }

    public void deleteExam(Long examId, String teacherEmail) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        if (!exam.getTeacher().getEmail().equals(teacherEmail)) {
            throw new RuntimeException("You can only delete your own exams");
        }

        examRepository.delete(exam);
    }

    public Exam getExamById(Long examId) {
        return examRepository.findById(examId).orElseThrow(() -> new RuntimeException("Exam not found"));
    }

    public String getTeacherFromExam(Long examId) {
        return examRepository.findTeacherByExamId(examId);
    }

    public Exam updateExam(Long id, Exam exam){
        Exam updateExam = examRepository.findById(id).orElseThrow(() -> new RuntimeException("Exam not found"));
        updateExam.setId(exam.getId());
        updateExam.setDuration(exam.getDuration());
        updateExam.setStartTime(exam.getStartTime());
        updateExam.setEndTime(exam.getEndTime());
        updateExam.setQuestions(exam.getQuestions());
        updateExam.setTitle(exam.getTitle());
        return examRepository.save(updateExam);
    }

    public Exam createExamWithAutoQuestions(AutoExamRequest request, String teacherEmail) {
        User teacher = userRepository.findByEmail(teacherEmail)
                .orElseThrow(() -> new RuntimeException("Öğretmen bulunamadı"));

        int total = request.getQuestionCount();
        Map<String, Integer> percentages = request.getDifficultyPercentages();

        // Zorluk seviyelerine göre kaç soru alınacak
        Map<String, Integer> difficultyCounts = new HashMap<>();
        for (Map.Entry<String, Integer> entry : percentages.entrySet()) {
            int count = (int) Math.round(entry.getValue() * total / 100.0);
            difficultyCounts.put(entry.getKey(), count);
        }

        List<Question> selectedQuestions = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : difficultyCounts.entrySet()) {
            String difficulty = entry.getKey();
            int count = entry.getValue();

            List<Question> questions = questionRepository.findByDifficulty(difficulty);
            Collections.shuffle(questions);

            if (questions.size() < count) {
                throw new RuntimeException("Yeterli '" + difficulty + "' seviyesinde soru yok");
            }

            selectedQuestions.addAll(questions.subList(0, count));
        }

        Exam exam = new Exam();
        exam.setTitle(request.getTitle());
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        LocalDateTime startTime = LocalDateTime.parse(request.getStartTime(), formatter);
        exam.setEndTime(startTime.plusMinutes(Long.parseLong(request.getDuration())));
        exam.setStartTime(startTime);
        exam.setDuration(request.getDuration());
        exam.setTeacher(teacher);
        exam.setQuestions(selectedQuestions);

        return examRepository.save(exam);
    }

    public void assignExamToStudent(Long examId, Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found id: " + studentId));

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        ExamAssignment assignment = new ExamAssignment();
        assignment.setStudent(student);
        assignment.setExam(exam);
        examAssignmentRepository.save(assignment);
    }

    public List<Exam> getAssignedExamsForStudent(Long studentId) {
        List<ExamAssignment> assignments = examAssignmentRepository.findByStudentIdAndCompletedFalse(studentId);
        return assignments.stream()
                .map(ExamAssignment::getExam)
                .collect(Collectors.toList());
    }

    public void markExamAsCompleted(Long examId, Long studentId) {
        ExamAssignment assignment = examAssignmentRepository.findByExamIdAndStudentId(examId, studentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        assignment.setCompleted(true);
        examAssignmentRepository.save(assignment);
    }

}