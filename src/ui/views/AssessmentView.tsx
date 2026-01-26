import React, { useState, useEffect } from 'react';
import { ClipboardCheck, ArrowLeft, ArrowRight, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { useAssessmentStore } from '../../store/assessmentStore';
import { useCourseStore } from '../../store/courseStore';
import { NavigationButtons } from '../components/NavigationButtons';
import { PASSING_SCORE } from '../../data/questionBank';

// ============================================
// Question Renderer Component
// ============================================
const QuestionRenderer: React.FC = () => {
    const { getCurrentQuestion, getAnswerForQuestion, submitAnswer } = useAssessmentStore();
    const question = getCurrentQuestion();
    const [localAnswer, setLocalAnswer] = useState<string>('');

    // Reset local answer when question changes
    useEffect(() => {
        if (question) {
            const existingAnswer = getAnswerForQuestion(question.id);
            if (existingAnswer) {
                setLocalAnswer(String(existingAnswer.answer));
            } else {
                setLocalAnswer('');
            }
        }
    }, [question?.id]);

    if (!question) return null;

    const existingAnswer = getAnswerForQuestion(question.id);

    switch (question.type) {
        case 'multiple-choice':
            return (
                <div className="question-options">
                    {question.options.map(option => (
                        <button
                            key={option.id}
                            className={`option-button ${existingAnswer?.answer === option.id ? 'selected' : ''}`}
                            onClick={() => submitAnswer(option.id)}
                        >
                            <span className="option-letter">{option.id.toUpperCase()}</span>
                            <span className="option-text">{option.text}</span>
                        </button>
                    ))}
                </div>
            );

        case 'true-false':
            return (
                <div className="question-options true-false">
                    <button
                        className={`option-button ${existingAnswer?.answer === true ? 'selected' : ''}`}
                        onClick={() => submitAnswer(true)}
                    >
                        <CheckCircle size={20} />
                        <span>True</span>
                    </button>
                    <button
                        className={`option-button ${existingAnswer?.answer === false ? 'selected' : ''}`}
                        onClick={() => submitAnswer(false)}
                    >
                        <XCircle size={20} />
                        <span>False</span>
                    </button>
                </div>
            );

        case 'numeric-input':
            return (
                <div className="question-input">
                    <input
                        type="number"
                        step="any"
                        placeholder="Enter your answer"
                        value={localAnswer}
                        onChange={(e) => setLocalAnswer(e.target.value)}
                        onBlur={(e) => {
                            const val = parseFloat(e.target.value);
                            if (!isNaN(val)) {
                                submitAnswer(val);
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const val = parseFloat(localAnswer);
                                if (!isNaN(val)) {
                                    submitAnswer(val);
                                }
                            }
                        }}
                        className="numeric-input"
                    />
                    {question.unit && <span className="input-unit">{question.unit}</span>}
                    <p className="input-hint">Press Enter or click outside to submit</p>
                </div>
            );

        case 'fill-in-blank':
            return (
                <div className="question-input">
                    <input
                        type="text"
                        placeholder="Enter your answer"
                        value={localAnswer}
                        onChange={(e) => setLocalAnswer(e.target.value)}
                        onBlur={(e) => {
                            if (e.target.value.trim()) {
                                submitAnswer(e.target.value.trim());
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && localAnswer.trim()) {
                                submitAnswer(localAnswer.trim());
                            }
                        }}
                        className="text-input"
                    />
                    <p className="input-hint">Press Enter or click outside to submit</p>
                </div>
            );

        default:
            return null;
    }
};

// ============================================
// Progress Dots Component
// ============================================
const ProgressDots: React.FC = () => {
    const { questions, currentQuestionIndex, answers, goToQuestion } = useAssessmentStore();

    return (
        <div className="assessment-progress">
            {questions.map((q, idx) => {
                const isAnswered = answers.some(a => a.questionId === q.id);
                const isCurrent = idx === currentQuestionIndex;

                return (
                    <button
                        key={q.id}
                        className={`progress-dot ${isCurrent ? 'current' : ''} ${isAnswered ? 'answered' : ''}`}
                        onClick={() => goToQuestion(idx)}
                        title={`Question ${idx + 1}${isAnswered ? ' (answered)' : ''}`}
                    >
                        {idx + 1}
                    </button>
                );
            })}
        </div>
    );
};

// ============================================
// Results Component
// ============================================
const AssessmentResults: React.FC = () => {
    const { score, maxScore, passed, questions, answers, resetAssessment } = useAssessmentStore();
    const percentage = Math.round((score / maxScore) * 100);

    return (
        <div className="assessment-results">
            <div className={`result-header ${passed ? 'passed' : 'failed'}`}>
                {passed ? (
                    <>
                        <CheckCircle size={48} />
                        <h2>Congratulations!</h2>
                        <p>You passed the assessment</p>
                    </>
                ) : (
                    <>
                        <XCircle size={48} />
                        <h2>Not Quite</h2>
                        <p>You need {PASSING_SCORE}% to pass</p>
                    </>
                )}
            </div>

            <div className="result-score">
                <div className="score-circle">
                    <span className="score-value">{percentage}%</span>
                    <span className="score-label">{score} / {maxScore} points</span>
                </div>
            </div>

            <div className="result-breakdown">
                <h3>Question Review</h3>
                <div className="review-list">
                    {questions.map((question, idx) => {
                        const answer = answers.find(a => a.questionId === question.id);
                        return (
                            <div key={question.id} className={`review-item ${answer?.isCorrect ? 'correct' : 'incorrect'}`}>
                                <span className="review-number">Q{idx + 1}</span>
                                <span className="review-module">{question.module.toUpperCase()}</span>
                                <span className="review-status">
                                    {answer?.isCorrect ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                </span>
                                <span className="review-points">
                                    {answer?.isCorrect ? question.points : 0} / {question.points} pts
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {!passed && (
                <button className="retry-button" onClick={resetAssessment}>
                    <RotateCcw size={18} />
                    Try Again
                </button>
            )}

            {passed && (
                <div className="completion-message">
                    <p>You have successfully completed the BA-CVA Learning Module!</p>
                </div>
            )}
        </div>
    );
};

// ============================================
// Start Screen Component
// ============================================
const AssessmentStart: React.FC = () => {
    const { startAssessment } = useAssessmentStore();
    const { assessmentResult } = useCourseStore();

    return (
        <section className="view-section">
            <div className="assessment-intro">
                <h2>Knowledge Assessment</h2>

                {assessmentResult && (
                    <div className={`previous-result ${assessmentResult.passed ? 'passed' : 'failed'}`}>
                        <p>
                            Previous attempt: {Math.round((assessmentResult.score / assessmentResult.maxScore) * 100)}%
                            {assessmentResult.passed ? ' (Passed)' : ' (Not passed)'}
                        </p>
                    </div>
                )}

                <p className="intro-text">
                    This assessment will test your knowledge of the BA-CVA framework
                    covered in this course. You will be asked 10 questions
                    covering all topics.
                </p>

                <ul className="assessment-info">
                    <li>Questions cover: SCVA, SNH, HMA, IH, K Reduced, K Hedged, K Full</li>
                    <li>Passing score: {PASSING_SCORE}%</li>
                    <li>You can navigate between questions before submitting</li>
                    <li>Your progress is saved automatically</li>
                </ul>

                <button className="start-assessment-button" onClick={startAssessment}>
                    <ClipboardCheck size={20} />
                    {assessmentResult ? 'Retake Assessment' : 'Start Assessment'}
                </button>
            </div>
        </section>
    );
};

// ============================================
// Active Assessment Component
// ============================================
const ActiveAssessment: React.FC = () => {
    const {
        questions,
        currentQuestionIndex,
        answers,
        nextQuestion,
        previousQuestion,
        finishAssessment,
        isLastQuestion,
        isFirstQuestion,
        getCurrentQuestion,
        getAnsweredCount,
    } = useAssessmentStore();

    const question = getCurrentQuestion();
    const currentAnswer = question ? answers.find(a => a.questionId === question.id) : null;
    const allAnswered = getAnsweredCount() === questions.length;

    return (
        <section className="view-section">
            <ProgressDots />

            <div className="question-container">
                <div className="question-header">
                    <span className="question-number">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                    <span className="question-module">
                        Module: {question?.module.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="question-points">
                        {question?.points} points
                    </span>
                </div>

                <h2 className="question-text">{question?.question}</h2>

                <QuestionRenderer />

                {currentAnswer && (
                    <div className="answer-saved">
                        Answer saved
                    </div>
                )}
            </div>

            <div className="assessment-navigation">
                <button
                    className="nav-button prev"
                    onClick={previousQuestion}
                    disabled={isFirstQuestion()}
                >
                    <ArrowLeft size={16} />
                    Previous
                </button>

                <span className="answer-count">
                    {getAnsweredCount()} of {questions.length} answered
                </span>

                {isLastQuestion() ? (
                    <button
                        className="nav-button submit"
                        onClick={finishAssessment}
                        disabled={!allAnswered}
                        title={!allAnswered ? 'Answer all questions first' : 'Submit assessment'}
                    >
                        Submit Assessment
                    </button>
                ) : (
                    <button
                        className="nav-button next"
                        onClick={nextQuestion}
                    >
                        Next
                        <ArrowRight size={16} />
                    </button>
                )}
            </div>
        </section>
    );
};

// ============================================
// Main Assessment View
// ============================================
export const AssessmentView: React.FC = () => {
    const { isActive, showResults } = useAssessmentStore();

    // Determine which content to show
    let content: React.ReactNode;
    let title: string;

    if (showResults) {
        content = <AssessmentResults />;
        title = 'Assessment Results';
    } else if (isActive) {
        content = <ActiveAssessment />;
        title = 'Knowledge Assessment';
    } else {
        content = <AssessmentStart />;
        title = 'Knowledge Assessment';
    }

    return (
        <div className="view-container">
            <header className="view-header">
                <div className="view-header-content">
                    <ClipboardCheck className="view-header-icon" />
                    <h1 className="view-header-title">{title}</h1>
                </div>
            </header>

            <div className="view-content">
                <div className="content-wrapper">
                    {content}
                    {!isActive && <NavigationButtons />}
                </div>
            </div>
        </div>
    );
};
