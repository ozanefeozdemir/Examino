/*CREATE TABLE user
(
    id        BIGINT AUTO_INCREMENT NOT NULL,
    email     VARCHAR(255) NULL,
    password  VARCHAR(255) NULL,
    full_name VARCHAR(255) NULL,
    `role`    VARCHAR(255) NULL,
    CONSTRAINT pk_user PRIMARY KEY (id)
);
CREATE TABLE student_answer
(
    id                    BIGINT AUTO_INCREMENT NOT NULL,
    student_id            BIGINT                NULL,
    question_id           BIGINT                NULL,
    selected_option_index INT                   NOT NULL,
    CONSTRAINT pk_studentanswer PRIMARY KEY (id)
);

CREATE TABLE result
(
    id              BIGINT AUTO_INCREMENT NOT NULL,
    student_id      BIGINT                NULL,
    exam_id         BIGINT                NULL,
    correct_answers INT                   NOT NULL,
    total_questions INT                   NOT NULL,
    score           DOUBLE                NOT NULL,
    CONSTRAINT pk_result PRIMARY KEY (id)
);

CREATE TABLE question
(
    id                   BIGINT AUTO_INCREMENT NOT NULL,
    text                 VARCHAR(255)          NULL,
    exam_id              BIGINT                NULL,
    correct_option_index INT                   NULL,
    CONSTRAINT `pk_questıon` PRIMARY KEY (id)
);
CREATE TABLE question_options
(
    question_id BIGINT       NOT NULL,
    `option`      VARCHAR(255) NULL
);
CREATE TABLE exam
(
    id         BIGINT AUTO_INCREMENT NOT NULL,
    title      VARCHAR(255)          NULL,
    start_time datetime              NULL,
    end_time   datetime              NULL,
    teacher_id BIGINT                NULL,
    CONSTRAINT pk_exam PRIMARY KEY (id)
);

ALTER TABLE exam
    ADD CONSTRAINT FK_EXAM_ON_TEACHER FOREIGN KEY (teacher_id) REFERENCES user (id);
ALTER TABLE student_answer
    ADD CONSTRAINT FK_STUDENTANSWER_ON_QUESTION FOREIGN KEY (question_id) REFERENCES question (id);

ALTER TABLE student_answer
    ADD CONSTRAINT FK_STUDENTANSWER_ON_STUDENT FOREIGN KEY (student_id) REFERENCES user (id);
ALTER TABLE question
    ADD CONSTRAINT FK_QUESTION_ON_EXAM FOREIGN KEY (exam_id) REFERENCES exam (id);

ALTER TABLE question_options
    ADD CONSTRAINT `fk_questıon_optıons_on_questıon` FOREIGN KEY (question_id) REFERENCES question (id);
ALTER TABLE result
    ADD CONSTRAINT FK_RESULT_ON_EXAM FOREIGN KEY (exam_id) REFERENCES exam (id);

ALTER TABLE result
    ADD CONSTRAINT FK_RESULT_ON_STUDENT FOREIGN KEY (student_id) REFERENCES user (id);
ALTER TABLE student_answer
    ADD answer_text VARCHAR(255) NULL;

ALTER TABLE student_answer
    ADD exam_id BIGINT NULL;

ALTER TABLE student_answer
    ADD CONSTRAINT FK_STUDENT_ANSWER_ON_EXAM FOREIGN KEY (exam_id) REFERENCES exam (id);

ALTER TABLE student_answer
    DROP COLUMN selected_option_index;
ALTER TABLE question
    DROP FOREIGN KEY FK_QUESTION_ON_EXAM;

ALTER TABLE question
    DROP COLUMN exam_id;
CREATE TABLE exam_question
(
    exam_id     BIGINT NOT NULL,
    question_id BIGINT NOT NULL
);

ALTER TABLE exam_question
    ADD CONSTRAINT fk_exaque_on_exam FOREIGN KEY (exam_id) REFERENCES exam (id);

ALTER TABLE exam_question
    ADD CONSTRAINT `fk_exaque_on_questıon` FOREIGN KEY (question_id) REFERENCES question (id);*/
ALTER TABLE exam
    ADD duration BIGINT NULL;
ALTER TABLE exam
    DROP COLUMN duration;

ALTER TABLE exam
    ADD duration VARCHAR(255) NULL;
alter table question
    drop difficulity
CREATE TABLE exam_assignment
(
    id         BIGINT AUTO_INCREMENT NOT NULL,
    student_id BIGINT                NULL,
    exam_id    BIGINT                NULL,
    completed  BIT(1)                NOT NULL,
    CONSTRAINT `pk_examassıgnment` PRIMARY KEY (id)
);

ALTER TABLE exam_assignment
    ADD CONSTRAINT FK_EXAMASSIGNMENT_ON_EXAM FOREIGN KEY (exam_id) REFERENCES exam (id);

ALTER TABLE exam_assignment
    ADD CONSTRAINT FK_EXAMASSIGNMENT_ON_STUDENT FOREIGN KEY (student_id) REFERENCES user (id);
ALTER TABLE result
    ADD solve_date datetime NULL;