package com.example.questiondrop.repository;

import com.example.questiondrop.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long> {
}