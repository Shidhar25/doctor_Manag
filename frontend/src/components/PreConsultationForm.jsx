import React, { useState } from 'react';

const PreConsultationForm = ({ onSubmit, onClose }) => {
    const [answers, setAnswers] = useState({
        chestPain: '',
        breathing: '',
        fever: '',
        consciousness: '',
        bleeding: '',
        pain: ''
    });

    const questions = [
        {
            id: 'chestPain',
            text: 'Are you experiencing chest pain?',
            options: ['Yes', 'Sometimes', 'No']
        },
        {
            id: 'breathing',
            text: 'Do you have difficulty breathing?',
            options: ['Yes', 'Sometimes', 'No']
        },
        {
            id: 'fever',
            text: 'Do you have fever?',
            options: ['High Fever (>102°F)', 'Mild Fever (99-102°F)', 'No Fever']
        },
        {
            id: 'consciousness',
            text: 'Have you experienced any dizziness or loss of consciousness?',
            options: ['Yes', 'Sometimes', 'No']
        },
        {
            id: 'bleeding',
            text: 'Is there any bleeding or severe injury?',
            options: ['Yes', 'Minor', 'No']
        },
        {
            id: 'pain',
            text: 'Rate your pain level (if any)',
            options: ['Severe (8-10)', 'Moderate (4-7)', 'Mild/No Pain (0-3)']
        }
    ];

    const calculateSeverity = () => {
        let score = 0;
        Object.entries(answers).forEach(([key, value]) => {
            if (value === 'Yes' || value === 'High Fever (>102°F)' || value === 'Severe (8-10)') {
                score += 2;
            } else if (value === 'Sometimes' || value === 'Mild Fever (99-102°F)' || 
                       value === 'Moderate (4-7)' || value === 'Minor') {
                score += 1;
            }
        });
        return score;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const score = calculateSeverity();
        let severity;
        if (score >= 5) {
            severity = 'serious';
        } else if (score >= 3) {
            severity = 'moderate';
        } else {
            severity = 'non-serious';
        }
        onSubmit({ answers, score, severity });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Pre-Consultation Assessment</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {questions.map((question) => (
                            <div key={question.id} className="border-b pb-4">
                                <p className="font-medium text-gray-700 mb-3">{question.text}</p>
                                <div className="flex flex-wrap gap-4">
                                    {question.options.map((option) => (
                                        <label key={option} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name={question.id}
                                                value={option}
                                                checked={answers[question.id] === option}
                                                onChange={(e) => setAnswers({
                                                    ...answers,
                                                    [question.id]: e.target.value
                                                })}
                                                required
                                                className="text-blue-500 focus:ring-blue-500"
                                            />
                                            <span className="text-gray-700">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-4 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Submit Assessment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PreConsultationForm; 