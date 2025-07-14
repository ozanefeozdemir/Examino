package com.example.examinoBack.dto;

import lombok.*;

import java.util.Map;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AutoExamRequest {
    private String title;
    private String startTime;  // ISO string formatında gönderilecek (Angular'dan)
    private String duration;      // dakika
    private Integer questionCount;

    // örnek: {"çok kolay": 10, "orta": 50, "zor": 40}
    private Map<String, Integer> difficultyPercentages;
}
