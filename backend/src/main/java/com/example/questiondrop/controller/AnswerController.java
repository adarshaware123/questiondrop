package com.example.questiondrop.controller;

import com.example.questiondrop.entity.Answer;
import com.example.questiondrop.service.AnswerService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class AnswerController {

    private final AnswerService answerService;

    public AnswerController(AnswerService answerService) {
        this.answerService = answerService;
    }

    @PostMapping("/{questionId}/answers")
    public Answer createAnswer(
            @PathVariable Long questionId,
            @Valid @RequestBody Answer answer) {

        return answerService.createAnswer(questionId, answer);
    }

    @GetMapping("/{questionId}/answers")
    public List<Answer> getAnswersByQuestionId(
            @PathVariable Long questionId) {

        return answerService.getAnswersByQuestionId(questionId);
    }
}