package com.example.examinoBack.controller;

import com.example.examinoBack.dto.AutoExamRequest;
import com.example.examinoBack.model.Exam;
import com.example.examinoBack.service.ExamService;
import com.example.examinoBack.service.StudentAnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;
    private final StudentAnswerService studentAnswerService;

    @PostMapping// OK
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<Exam> createExam(@RequestBody Exam exam) {
        System.out.println("Rol alınıyor..");
        String teacherEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("Teacher email: "+ teacherEmail);
        System.out.println("Authorities: " + SecurityContextHolder.getContext().getAuthentication().getAuthorities());

        return ResponseEntity.ok(examService.createExam(exam, teacherEmail));
    }

    @GetMapping // OK
    public ResponseEntity<List<Exam>> getAllExams() {
        return ResponseEntity.ok(examService.getAllExams());
    }
    @GetMapping("/a/{examId}")
    public ResponseEntity<String> getTeacherFromResult(@PathVariable Long examId) {
        return ResponseEntity.ok(examService.getTeacherFromExam(examId));
    }
    @GetMapping("/{examId}")
    public ResponseEntity<Exam> getExamById(@PathVariable Long examId) {
        return ResponseEntity.ok(examService.getExamById(examId));
    }
    @PreAuthorize("hasAuthority('TEACHER')")
    @GetMapping("/my")// OK
    public ResponseEntity<List<Exam>> getMyExams() {
        String teacherEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(examService.getExamsByTeacher(teacherEmail));
    }

    @PreAuthorize("hasAuthority('TEACHER')")
    @PutMapping("/{id}")
    public ResponseEntity<Exam> updateExam(@PathVariable Long id, @RequestBody Exam exam) {
        return ResponseEntity.ok(examService.updateExam(id, exam));
    }




    @GetMapping("/{examId}/can-take")
    public ResponseEntity<Boolean> canTakeExam(@PathVariable Long examId, @RequestParam String studentEmail) {
        boolean alreadyTaken = studentAnswerService.hasStudentTakenExam(examId, studentEmail);
        return ResponseEntity.ok(!alreadyTaken);
    }

    @PreAuthorize("hasAuthority('TEACHER')")
    @DeleteMapping("/{id}") // OK
    public ResponseEntity<?> deleteExam(@PathVariable Long id) {
        String teacherEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        examService.deleteExam(id, teacherEmail);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/auto")
    public ResponseEntity<?> createExamAuto(@RequestBody AutoExamRequest request,
                                            @RequestParam String teacherEmail) {
        try {
            System.out.println("StartTime Raw: " + request.getStartTime());
            System.out.println("Full Request: " + request);

            Exam exam = examService.createExamWithAutoQuestions(request, teacherEmail);
            return ResponseEntity.ok(exam);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PostMapping("/assign")
    public ResponseEntity<Void> assignExamToStudent(@RequestParam Long examId, @RequestParam Long studentId) {
        examService.assignExamToStudent(examId, studentId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/assigned")
    public ResponseEntity<List<Exam>> getAssignedExams(@RequestParam Long studentId) {
        return ResponseEntity.ok(examService.getAssignedExamsForStudent(studentId));
    }

}

