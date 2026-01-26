/**
 * Question Bank for BA-CVA Learning Module Assessment
 * Contains questions covering all modules of the course
 */

import type { Question } from '../types/assessment';

export const QUESTION_BANK: Question[] = [
    // ============================================
    // SCVA Questions
    // ============================================
    {
        id: 'scva-001',
        type: 'multiple-choice',
        module: 'scva',
        question: 'What is the standard alpha value for non-pension counterparties in the BA-CVA framework?',
        options: [
            { id: 'a', text: '1.0', isCorrect: false },
            { id: 'b', text: '1.2', isCorrect: false },
            { id: 'c', text: '1.4', isCorrect: true },
            { id: 'd', text: '1.5', isCorrect: false },
        ],
        explanation: 'The standard alpha value is 1.4 for all counterparties except pension funds, which use alpha = 1.0.',
        points: 10,
    },
    {
        id: 'scva-002',
        type: 'true-false',
        module: 'scva',
        question: 'For counterparties using the IMM approach, the discount factor (DF) is always set to 1.0.',
        correctAnswer: true,
        explanation: 'IMM firms already incorporate time-weighting in their exposure models, so the supervisory DF is set to 1.0 to avoid double-counting.',
        points: 10,
    },
    {
        id: 'scva-003',
        type: 'numeric-input',
        module: 'scva',
        question: 'Calculate the discount factor for a maturity of 5 years using the formula DF = [1 - exp(-0.05 x M)] / (0.05 x M). Round to 4 decimal places.',
        correctAnswer: 0.8847,
        tolerance: 0.001,
        explanation: 'DF = [1 - exp(-0.05 x 5)] / (0.05 x 5) = [1 - exp(-0.25)] / 0.25 = [1 - 0.7788] / 0.25 = 0.8847',
        points: 15,
    },
    {
        id: 'scva-004',
        type: 'multiple-choice',
        module: 'scva',
        question: 'Which sector has the highest risk weight for Investment Grade counterparties?',
        options: [
            { id: 'a', text: 'Financials (FIN)', isCorrect: true },
            { id: 'b', text: 'Industrials (IND)', isCorrect: false },
            { id: 'c', text: 'Technology (TEC)', isCorrect: false },
            { id: 'd', text: 'Healthcare (HLT)', isCorrect: false },
        ],
        explanation: 'Financial sector counterparties have a 5% risk weight for IG, which is the highest among major sectors (IND: 3%, TEC: 2%, HLT: 1.5%).',
        points: 10,
    },

    // ============================================
    // SNH Questions
    // ============================================
    {
        id: 'snh-001',
        type: 'multiple-choice',
        module: 'snh',
        question: 'What is the supervisory correlation (r_hc) for a direct-match single name hedge?',
        options: [
            { id: 'a', text: '50%', isCorrect: false },
            { id: 'b', text: '80%', isCorrect: false },
            { id: 'c', text: '100%', isCorrect: true },
            { id: 'd', text: '70%', isCorrect: false },
        ],
        explanation: 'Direct-match hedges (same reference entity) receive 100% correlation. Legally related entities receive 80%, and sector/region proxies receive 50%.',
        points: 10,
    },
    {
        id: 'snh-002',
        type: 'multiple-choice',
        module: 'snh',
        question: 'A hedge referencing a parent company of the counterparty would be classified as:',
        options: [
            { id: 'a', text: 'Direct match', isCorrect: false },
            { id: 'b', text: 'Legally related', isCorrect: true },
            { id: 'c', text: 'Sector/region proxy', isCorrect: false },
            { id: 'd', text: 'Index hedge', isCorrect: false },
        ],
        explanation: 'Parent companies, subsidiaries, and affiliates are considered "legally related" and receive an 80% correlation factor.',
        points: 10,
    },
    {
        id: 'snh-003',
        type: 'numeric-input',
        module: 'snh',
        question: 'What is the supervisory correlation for a sector/region proxy hedge? Enter as a decimal (e.g., 0.50).',
        correctAnswer: 0.50,
        tolerance: 0.001,
        explanation: 'Sector/region proxy hedges receive a 50% (0.50) correlation factor.',
        points: 10,
    },

    // ============================================
    // HMA Questions
    // ============================================
    {
        id: 'hma-001',
        type: 'true-false',
        module: 'hma',
        question: 'A direct-match hedge (r_hc = 100%) produces zero HMA add-on.',
        correctAnswer: true,
        explanation: 'HMA factor = (1 - r_hc squared). For direct match: 1 - 1 squared = 0, so no HMA add-on.',
        points: 10,
    },
    {
        id: 'hma-002',
        type: 'numeric-input',
        module: 'hma',
        question: 'Calculate the HMA factor for a legally related hedge (r_hc = 80%). Enter as a decimal.',
        correctAnswer: 0.36,
        tolerance: 0.01,
        explanation: 'HMA factor = 1 - r_hc squared = 1 - 0.8 squared = 1 - 0.64 = 0.36',
        points: 10,
    },
    {
        id: 'hma-003',
        type: 'numeric-input',
        module: 'hma',
        question: 'What is the HMA factor for a sector/region proxy hedge (r_hc = 50%)? Enter as a decimal.',
        correctAnswer: 0.75,
        tolerance: 0.01,
        explanation: 'HMA factor = 1 - r_hc squared = 1 - 0.5 squared = 1 - 0.25 = 0.75',
        points: 10,
    },

    // ============================================
    // IH Questions
    // ============================================
    {
        id: 'ih-001',
        type: 'multiple-choice',
        module: 'ih',
        question: 'What scalar is applied to the weighted average risk weight when calculating index hedge risk weights?',
        options: [
            { id: 'a', text: '0.50', isCorrect: false },
            { id: 'b', text: '0.65', isCorrect: false },
            { id: 'c', text: '0.70', isCorrect: true },
            { id: 'd', text: '0.80', isCorrect: false },
        ],
        explanation: 'The 0.70 scalar reflects the diversification benefit inherent in an index versus a single name.',
        points: 10,
    },
    {
        id: 'ih-002',
        type: 'true-false',
        module: 'ih',
        question: 'Index hedges provide relief in the systematic component of K Hedged, not the idiosyncratic component.',
        correctAnswer: true,
        explanation: 'Index hedges (IH) are subtracted from the systematic component only: (rho x sum of net exposures - IH) squared.',
        points: 10,
    },

    // ============================================
    // K Reduced Questions
    // ============================================
    {
        id: 'kreduced-001',
        type: 'multiple-choice',
        module: 'k_reduced',
        question: 'What is the supervisory correlation parameter (rho) used in the K Reduced aggregation?',
        options: [
            { id: 'a', text: '0.25', isCorrect: false },
            { id: 'b', text: '0.50', isCorrect: true },
            { id: 'c', text: '0.65', isCorrect: false },
            { id: 'd', text: '0.75', isCorrect: false },
        ],
        explanation: 'The correlation parameter rho = 0.50 determines the split between systematic and idiosyncratic components.',
        points: 10,
    },
    {
        id: 'kreduced-002',
        type: 'fill-in-blank',
        module: 'k_reduced',
        question: 'In the K Reduced formula, the systematic component uses "sum then _____" logic.',
        correctAnswers: ['square', 'squared'],
        caseSensitive: false,
        explanation: 'The systematic component sums all SCVA values first, then squares: (rho x sum of SCVA) squared',
        points: 10,
    },
    {
        id: 'kreduced-003',
        type: 'numeric-input',
        module: 'k_reduced',
        question: 'What is the value of (1 - rho squared) when rho = 0.50?',
        correctAnswer: 0.75,
        tolerance: 0.001,
        explanation: '(1 - rho squared) = 1 - 0.50 squared = 1 - 0.25 = 0.75',
        points: 10,
    },

    // ============================================
    // K Hedged Questions
    // ============================================
    {
        id: 'khedged-001',
        type: 'true-false',
        module: 'k_hedged',
        question: 'HMA (Hedge Mismatch Adjustment) is added inside the square root when calculating K Hedged.',
        correctAnswer: true,
        explanation: 'HMA sits alongside the systematic and idiosyncratic variance terms inside the square root.',
        points: 10,
    },
    {
        id: 'khedged-002',
        type: 'multiple-choice',
        module: 'k_hedged',
        question: 'In K Hedged, what is subtracted from each counterparty SCVA before aggregation?',
        options: [
            { id: 'a', text: 'Index hedge benefit', isCorrect: false },
            { id: 'b', text: 'Single name hedge benefit (SNH)', isCorrect: true },
            { id: 'c', text: 'HMA add-on', isCorrect: false },
            { id: 'd', text: 'Beta weight', isCorrect: false },
        ],
        explanation: 'Net exposure = SCVA - SNH for each counterparty. Index hedges are subtracted at the portfolio level.',
        points: 10,
    },

    // ============================================
    // K Full Questions
    // ============================================
    {
        id: 'kfull-001',
        type: 'numeric-input',
        module: 'k_full',
        question: 'What is the value of beta in the K Full blending formula?',
        correctAnswer: 0.25,
        tolerance: 0.001,
        explanation: 'Beta = 0.25, ensuring 25% weight on K Reduced (unhedged) and 75% weight on K Hedged.',
        points: 10,
    },
    {
        id: 'kfull-002',
        type: 'numeric-input',
        module: 'k_full',
        question: 'What is the discount scalar (DS_BA-CVA) applied to K Full to get K Final?',
        correctAnswer: 0.65,
        tolerance: 0.001,
        explanation: 'DS_BA-CVA = 0.65 is a calibration adjustment to reduce conservatism in the standardised framework.',
        points: 10,
    },
    {
        id: 'kfull-003',
        type: 'multiple-choice',
        module: 'k_full',
        question: 'What percentage weight does K Hedged receive in the K Full formula?',
        options: [
            { id: 'a', text: '25%', isCorrect: false },
            { id: 'b', text: '50%', isCorrect: false },
            { id: 'c', text: '65%', isCorrect: false },
            { id: 'd', text: '75%', isCorrect: true },
        ],
        explanation: 'K Full = beta x K Reduced + (1 - beta) x K Hedged. With beta = 0.25, K Hedged receives 75% weight.',
        points: 10,
    },

    // ============================================
    // Practical Calculation Questions
    // ============================================
    {
        id: 'calc-001',
        type: 'numeric-input',
        module: 'practice',
        question: 'Calculate SCVA for a counterparty with: alpha=1.4, RW=5%, M=3 years, EAD=1000, DF=0.9277. Round to 2 decimal places.',
        correctAnswer: 99.39,
        tolerance: 1.0,
        explanation: 'SCVA = (1/1.4) x 0.05 x 3 x 1000 x 0.9277 = 0.7143 x 0.05 x 3 x 1000 x 0.9277 = 99.39',
        points: 20,
    },
    {
        id: 'calc-002',
        type: 'numeric-input',
        module: 'practice',
        question: 'If K Reduced = 500 and K Hedged = 300, what is K Full? (Use beta = 0.25)',
        correctAnswer: 350,
        tolerance: 1.0,
        explanation: 'K Full = 0.25 x 500 + 0.75 x 300 = 125 + 225 = 350',
        points: 15,
    },
    {
        id: 'calc-003',
        type: 'numeric-input',
        module: 'practice',
        question: 'If K Full = 400, what is K Final after applying DS_BA-CVA = 0.65?',
        correctAnswer: 260,
        tolerance: 1.0,
        explanation: 'K Final = 0.65 x 400 = 260',
        points: 15,
    },
];

export const PASSING_SCORE = 70; // 70% to pass
export const TOTAL_QUESTIONS = 10; // Number of questions per assessment attempt

/**
 * Get a randomized set of questions for an assessment
 * Ensures coverage across different modules
 */
export function getAssessmentQuestions(count: number = TOTAL_QUESTIONS): Question[] {
    // Group questions by module
    const byModule: Record<string, Question[]> = {};
    QUESTION_BANK.forEach(q => {
        if (!byModule[q.module]) byModule[q.module] = [];
        byModule[q.module].push(q);
    });

    const modules = Object.keys(byModule);
    const selected: Question[] = [];

    // First pass: try to get at least one question from each module
    modules.forEach(module => {
        const moduleQuestions = byModule[module];
        if (moduleQuestions.length > 0 && selected.length < count) {
            const randomIndex = Math.floor(Math.random() * moduleQuestions.length);
            selected.push(moduleQuestions[randomIndex]);
            moduleQuestions.splice(randomIndex, 1);
        }
    });

    // Second pass: fill remaining slots with random questions
    const remaining = QUESTION_BANK.filter(q => !selected.includes(q));
    const shuffledRemaining = remaining.sort(() => Math.random() - 0.5);

    while (selected.length < count && shuffledRemaining.length > 0) {
        selected.push(shuffledRemaining.pop()!);
    }

    // Shuffle final selection
    return selected.sort(() => Math.random() - 0.5);
}

/**
 * Get all questions for a specific module
 */
export function getQuestionsByModule(module: string): Question[] {
    return QUESTION_BANK.filter(q => q.module === module);
}
