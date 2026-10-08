package com.example.questiondrop.service;
import com.example.questiondrop.entity.Answer;
import com.example.questiondrop.entity.Question;
import com.example.questiondrop.repository.QuestionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.example.questiondrop.repository.AnswerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnswerService {

    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;

    public AnswerService(
            AnswerRepository answerRepository,
            QuestionRepository questionRepository) {

        this.answerRepository = answerRepository;
        this.questionRepository = questionRepository;
    }

    public Answer createAnswer(Long questionId, Answer answer) {

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Question not found"
                        )
                );

        answer.setQuestion(question);

        return answerRepository.save(answer);


    }

    public List<Answer> getAnswersByQuestionId(Long questionId) {

        if (!questionRepository.existsById(questionId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Question not found"
            );
        }

        return answerRepository.findByQuestionId(questionId);
    }


}