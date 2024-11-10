import React from 'react';
import { Label } from '@/components/ui/label';
import Select from 'react-select';

const customSelectStyles = (isDarkMode) => ({
    control: (base) => ({
        ...base,
        backgroundColor: isDarkMode ? '#2D3748' : '#fff',
        borderColor: isDarkMode ? '#4A5568' : '#CBD5E0',
        color: isDarkMode ? '#E2E8F0' : '#2D3748',
    }),
    option: (base, { isFocused, isSelected }) => ({
        ...base,
        backgroundColor: isFocused
            ? isDarkMode
                ? '#4A5568'
                : '#EDF2F7'
            : isSelected
            ? isDarkMode
                ? '#718096'
                : '#CBD5E0'
            : 'transparent',
        color: isDarkMode ? '#E2E8F0' : '#2D3748',
    }),
    multiValue: (base) => ({
        ...base,
        backgroundColor: isDarkMode ? '#4A5568' : '#EDF2F7',
        color: isDarkMode ? '#E2E8F0' : '#2D3748',
    }),
    multiValueLabel: (base) => ({
        ...base,
        color: isDarkMode ? '#E2E8F0' : '#2D3748',
    }),
    placeholder: (base) => ({
        ...base,
        color: isDarkMode ? '#A0AEC0' : '#718096',
    }),
});

export default customSelectStyles;
