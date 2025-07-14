package com.example.examinoBack.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Data
@Setter
public class ExamRequest {

    private String title;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String duration;
    private List<QuestionRequest> questions;
}
