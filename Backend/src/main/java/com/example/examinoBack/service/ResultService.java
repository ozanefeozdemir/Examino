package com.example.examinoBack.service;

import com.example.examinoBack.model.Exam;
import com.example.examinoBack.model.Result;
import com.example.examinoBack.repository.ResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResultService {

    private final ResultRepository resultRepository;

    public List<Result> getResultsForStudent(String studentEmail) {
        return resultRepository.findByStudentEmail(studentEmail);
    }

    public List<Result> getResultsForTeacher(String teacherEmail) {
        return resultRepository.findByExamTeacherEmail(teacherEmail);
    }

    public List<String> getStudentFromExam(Long examId){
        return resultRepository.findStudentByExamId(examId);
    }



    public void saveResult(Result result) {
        resultRepository.save(result);
    }


    public Exam getExamFromResult(Long resultId) {
        return resultRepository.findExamByResultId(resultId);
    }
}
