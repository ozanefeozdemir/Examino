package com.example.examinoBack.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ExamAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User student;

    @ManyToOne
    private Exam exam;

    private boolean completed = false; // öğrenci sınavı çözdü mü
}
