package com.example.examinoBack.controller;

import com.example.examinoBack.model.Exam;
import com.example.examinoBack.model.Result;
import com.example.examinoBack.service.ResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
public class ResultController {

    private final ResultService resultService;

    @GetMapping("/student") // SONRA TEST EDİLECEK
    @PreAuthorize("hasAuthority('STUDENT')")
    public ResponseEntity<List<Result>> getStudentResults() {
        System.out.println("Rol alınıyor...");
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(resultService.getResultsForStudent(email));
    }

    @GetMapping("/{examId}")
    public ResponseEntity<List<String>> getStudentFromResult(@PathVariable Long examId) {
        return ResponseEntity.ok(resultService.getStudentFromExam(examId));
    }

    @GetMapping("/teacher") // SONRA TEST EDİLECEK
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<List<Result>> getTeacherResults() {
        System.out.println("Rol alınıyor...");
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(resultService.getResultsForTeacher(email));
    }

    @GetMapping("/getExam")
    public ResponseEntity<Exam> getExamFromResult(@RequestParam Long resultId) {
        return ResponseEntity.ok(resultService.getExamFromResult(resultId));
    }
}
