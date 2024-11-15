// components/ui/DatePicker.js
import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePicker = ({ selected, onChange, placeholder = "Select date" }) => {
    return (
        <ReactDatePicker
            selected={selected}
            onChange={onChange}
            placeholderText={placeholder}
            className="input-class-name" // Use appropriate Shadcn styling here
            dateFormat="yyyy-MM-dd"
        />
    );
};

export default DatePicker;
