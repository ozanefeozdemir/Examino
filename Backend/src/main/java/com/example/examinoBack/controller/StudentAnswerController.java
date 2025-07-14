package com.example.examinoBack.controller;

import com.example.examinoBack.dto.StudentAnswerRequest;
import com.example.examinoBack.model.StudentAnswer;
import com.example.examinoBack.repository.UserRepository;
import com.example.examinoBack.service.ExamService;
import com.example.examinoBack.service.StudentAnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student-answers")
@RequiredArgsConstructor
public class StudentAnswerController {

    private final StudentAnswerService studentAnswerService;
    private final ExamService examService;
    private final UserRepository userRepository;

    @PostMapping("/{examId}") // SONRA KONTROL EDİLECEK
    @PreAuthorize("hasAuthority('STUDENT')")
    public ResponseEntity<Void> submitAnswers(@PathVariable Long examId, @RequestBody List<StudentAnswerRequest> answers) {
        String studentEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        examService.markExamAsCompleted(examId, userRepository.findIdByEmail(studentEmail).getId());
        studentAnswerService.saveAnswers(answers, studentEmail, examId);
        return ResponseEntity.noContent().build();
    }


    @GetMapping
    public ResponseEntity<List<StudentAnswer>> getAnswers(@RequestParam Long studentId, @RequestParam Long examId ) {
        return ResponseEntity.ok(studentAnswerService.getAnswers(studentId, examId));
    }


}
