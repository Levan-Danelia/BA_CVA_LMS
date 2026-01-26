/**
 * Assessment Store
 * Manages state for the BA-CVA knowledge assessment
 */

import { create } from 'zustand';
import type { Question, QuestionAnswer } from '../types/assessment';
import { getAssessmentQuestions, PASSING_SCORE, TOTAL_QUESTIONS } from '../data/questionBank';
import { scormAPI } from '../services/scormAPI';
import { useCourseStore } from './courseStore';

interface AssessmentStore {
    // State
    isActive: boolean;
    questions: Question[];
    currentQuestionIndex: number;
    answers: QuestionAnswer[];
    startTime: number;
    questionStartTime: number;

    // Results
    score: number;
    maxScore: number;
    passed: boolean;
    showResults: boolean;

    // Actions
    startAssessment: () => void;
    submitAnswer: (answer: string | number | boolean) => void;
    nextQuestion: () => void;
    previousQuestion: () => void;
    goToQuestion: (index: number) => void;
    finishAssessment: () => void;
    resetAssessment: () => void;

    // Getters
    getCurrentQuestion: () => Question | null;
    getAnswerForQuestion: (questionId: string) => QuestionAnswer | undefined;
    isLastQuestion: () => boolean;
    isFirstQuestion: () => boolean;
    canSubmit: () => boolean;
    getAnsweredCount: () => number;
}

/**
 * Check if an answer is correct based on question type
 */
function checkAnswer(question: Question, answer: string | number | boolean): boolean {
    switch (question.type) {
        case 'multiple-choice':
            return question.options.find(o => o.id === answer)?.isCorrect || false;
        case 'true-false':
            return answer === question.correctAnswer;
        case 'numeric-input': {
            const numAnswer = Number(answer);
            if (isNaN(numAnswer)) return false;
            return Math.abs(numAnswer - question.correctAnswer) <= question.tolerance;
        }
        case 'fill-in-blank': {
            const strAnswer = String(answer).trim();
            return question.correctAnswers.some(correct =>
                question.caseSensitive
                    ? correct === strAnswer
                    : correct.toLowerCase() === strAnswer.toLowerCase()
            );
        }
        default:
            return false;
    }
}

/**
 * Map question type to SCORM interaction type
 */
function mapQuestionTypeToSCORM(type: string): 'true-false' | 'choice' | 'fill-in' | 'numeric' | 'sequencing' | 'matching' {
    switch (type) {
        case 'multiple-choice': return 'choice';
        case 'true-false': return 'true-false';
        case 'numeric-input': return 'numeric';
        case 'fill-in-blank': return 'fill-in';
        default: return 'fill-in';
    }
}

/**
 * Get the correct answer as a string for SCORM logging
 */
function getCorrectAnswerString(question: Question): string {
    switch (question.type) {
        case 'multiple-choice':
            return question.options.find(o => o.isCorrect)?.id || '';
        case 'true-false':
            return String(question.correctAnswer);
        case 'numeric-input':
            return String(question.correctAnswer);
        case 'fill-in-blank':
            return question.correctAnswers[0];
        default:
            return '';
    }
}

export const useAssessmentStore = create<AssessmentStore>((set, get) => ({
    // Initial state
    isActive: false,
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    startTime: 0,
    questionStartTime: 0,
    score: 0,
    maxScore: 0,
    passed: false,
    showResults: false,

    // Actions
    startAssessment: () => {
        const questions = getAssessmentQuestions(TOTAL_QUESTIONS);
        const maxScore = questions.reduce((sum, q) => sum + q.points, 0);

        set({
            isActive: true,
            questions,
            currentQuestionIndex: 0,
            answers: [],
            startTime: Date.now(),
            questionStartTime: Date.now(),
            score: 0,
            maxScore,
            passed: false,
            showResults: false,
        });
    },

    submitAnswer: (answer) => {
        const { questions, currentQuestionIndex, answers, questionStartTime } = get();
        const question = questions[currentQuestionIndex];
        if (!question) return;

        const timeSpent = Date.now() - questionStartTime;
        const isCorrect = checkAnswer(question, answer);

        const questionAnswer: QuestionAnswer = {
            questionId: question.id,
            answer,
            isCorrect,
            timeSpent,
        };

        // Update or add answer
        const existingIndex = answers.findIndex(a => a.questionId === question.id);
        const newAnswers = [...answers];
        if (existingIndex >= 0) {
            newAnswers[existingIndex] = questionAnswer;
        } else {
            newAnswers.push(questionAnswer);
        }

        set({ answers: newAnswers });

        // Record interaction in SCORM
        if (scormAPI.isAvailable()) {
            const interactionIndex = existingIndex >= 0 ? existingIndex : newAnswers.length - 1;
            scormAPI.recordInteraction(
                interactionIndex,
                question.id,
                mapQuestionTypeToSCORM(question.type),
                String(answer),
                getCorrectAnswerString(question),
                isCorrect ? 'correct' : 'incorrect',
                timeSpent,
                question.question.substring(0, 250)
            );
        }
    },

    nextQuestion: () => {
        const { currentQuestionIndex, questions } = get();
        if (currentQuestionIndex < questions.length - 1) {
            set({
                currentQuestionIndex: currentQuestionIndex + 1,
                questionStartTime: Date.now(),
            });
        }
    },

    previousQuestion: () => {
        const { currentQuestionIndex } = get();
        if (currentQuestionIndex > 0) {
            set({
                currentQuestionIndex: currentQuestionIndex - 1,
                questionStartTime: Date.now(),
            });
        }
    },

    goToQuestion: (index) => {
        const { questions } = get();
        if (index >= 0 && index < questions.length) {
            set({
                currentQuestionIndex: index,
                questionStartTime: Date.now(),
            });
        }
    },

    finishAssessment: () => {
        const { questions, answers, maxScore } = get();

        // Calculate score
        let score = 0;
        questions.forEach(question => {
            const answer = answers.find(a => a.questionId === question.id);
            if (answer?.isCorrect) {
                score += question.points;
            }
        });

        const percentage = (score / maxScore) * 100;
        const passed = percentage >= PASSING_SCORE;

        set({
            score,
            passed,
            showResults: true,
            isActive: false,
        });

        // Update course store with assessment result
        useCourseStore.getState().setAssessmentResult({
            score,
            maxScore,
            passed,
            completedAt: Date.now(),
            answers: Object.fromEntries(answers.map(a => [a.questionId, a.answer])),
        });
    },

    resetAssessment: () => {
        set({
            isActive: false,
            questions: [],
            currentQuestionIndex: 0,
            answers: [],
            startTime: 0,
            questionStartTime: 0,
            score: 0,
            maxScore: 0,
            passed: false,
            showResults: false,
        });
    },

    // Getters
    getCurrentQuestion: () => {
        const { questions, currentQuestionIndex } = get();
        return questions[currentQuestionIndex] || null;
    },

    getAnswerForQuestion: (questionId) => {
        return get().answers.find(a => a.questionId === questionId);
    },

    isLastQuestion: () => {
        const { currentQuestionIndex, questions } = get();
        return currentQuestionIndex === questions.length - 1;
    },

    isFirstQuestion: () => {
        return get().currentQuestionIndex === 0;
    },

    canSubmit: () => {
        const { questions, answers } = get();
        return answers.length === questions.length;
    },

    getAnsweredCount: () => {
        return get().answers.length;
    },
}));
