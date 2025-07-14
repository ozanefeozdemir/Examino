package com.example.examinoBack.controller;


import com.example.examinoBack.model.Question;
import com.example.examinoBack.service.QuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin(origins = "http://localhost:4200") // Angular dev sunucusu
@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @PostMapping("/add") // OK
    public ResponseEntity<Question> createQuestion(@RequestBody Question question) {
        return ResponseEntity.ok(questionService.createQuestion(question));
    }

    @PostMapping("/addAll")
    public ResponseEntity<List<Question>> createQuestions(@RequestBody List<Question> questions) {
        return ResponseEntity.ok(questionService.createQuestions(questions));
    }


    @PostMapping("/add/{examId}") // OK
    public ResponseEntity<Question> addQuestion(@PathVariable Long examId, @RequestBody Question question) {
        return ResponseEntity.ok(questionService.addQuestion(examId, question));
    }

    @GetMapping("/exam/{examId}") // OK
    public ResponseEntity<List<Question>> getQuestionsByExam(@PathVariable Long examId) {
        return ResponseEntity.ok(questionService.getQuestionsByExam(examId));
    }

    @GetMapping
    public ResponseEntity<List<Question>> getAllQuestions() {
        return ResponseEntity.ok(questionService.getAllQuestions());
    }

    @DeleteMapping("/{questionId}") // OK
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long questionId) {
        questionService.deleteQuestion(questionId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long id, @RequestBody Question question) {
        return ResponseEntity.ok(questionService.updateQuestion(id, question));
    }
}