package com.example.examinoBack.dto;


import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class StudentAnswerRequest {
    private Long questionId;
    private String answerText;
}
