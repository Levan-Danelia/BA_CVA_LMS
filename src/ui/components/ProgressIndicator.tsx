import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useCourseStore, TOTAL_CONTENT_MODULES } from '../../store/courseStore';

export const ProgressIndicator: React.FC = () => {
    const { getProgressPercentage, getCompletedModulesCount, assessmentResult } = useCourseStore();

    const percentage = getProgressPercentage();
    const completed = getCompletedModulesCount();

    return (
        <div className="progress-indicator">
            <div className="progress-header">
                <CheckCircle className="progress-icon" size={14} />
                <span className="progress-text">
                    {completed} of {TOTAL_CONTENT_MODULES} modules
                </span>
            </div>
            <div className="progress-bar-container">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="progress-footer">
                <span className="progress-percentage">{Math.round(percentage)}%</span>
                {assessmentResult && (
                    <span className={`assessment-badge ${assessmentResult.passed ? 'passed' : 'failed'}`}>
                        {assessmentResult.passed ? 'Passed' : 'Not Passed'}
                    </span>
                )}
            </div>
        </div>
    );
};
