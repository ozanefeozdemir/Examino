package com.example.examinoBack.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Data
@Setter
public class QuestionRequest {
    private String text;
    //private List<String> options;
}
