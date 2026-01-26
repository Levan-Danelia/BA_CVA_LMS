/**
 * Assessment Types for BA-CVA Learning Module
 * Supports multiple question types for SCORM-compliant assessments
 */

export type QuestionType =
  | 'multiple-choice'
  | 'true-false'
  | 'numeric-input'
  | 'fill-in-blank';

export interface QuestionOption {
    id: string;
    text: string;
    isCorrect: boolean;
}

export interface BaseQuestion {
    id: string;
    type: QuestionType;
    question: string;
    explanation: string;
    points: number;
    module: string; // Which module this question relates to
}

export interface MultipleChoiceQuestion extends BaseQuestion {
    type: 'multiple-choice';
    options: QuestionOption[];
}

export interface TrueFalseQuestion extends BaseQuestion {
    type: 'true-false';
    correctAnswer: boolean;
}

export interface NumericInputQuestion extends BaseQuestion {
    type: 'numeric-input';
    correctAnswer: number;
    tolerance: number; // Acceptable error margin (e.g., 0.01 for 1%)
    unit?: string;
}

export interface FillInBlankQuestion extends BaseQuestion {
    type: 'fill-in-blank';
    correctAnswers: string[]; // Multiple acceptable answers
    caseSensitive: boolean;
}

export type Question =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | NumericInputQuestion
  | FillInBlankQuestion;

export interface QuestionAnswer {
    questionId: string;
    answer: string | number | boolean;
    isCorrect: boolean;
    timeSpent: number; // milliseconds
}

export interface AssessmentState {
    questions: Question[];
    currentQuestionIndex: number;
    answers: QuestionAnswer[];
    startTime: number;
    endTime?: number;
    score: number;
    maxScore: number;
    passed: boolean;
    passingScore: number; // percentage (e.g., 70)
}
