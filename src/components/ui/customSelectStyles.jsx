import * as React from "react"

const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'var(--select-bg)',
      color: 'var(--foreground)',
      borderColor: 'var(--border)',
      '&:hover': {
        borderColor: 'var(--border)',
      },
    }),
    input: (provided) => ({
      ...provided,
      color: 'var(--foreground)',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'var(--muted-foreground)',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'var(--foreground)',
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: 'var(--muted)',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'var(--foreground)',
    }),
    option: (provided, { isFocused, isSelected }) => ({
      ...provided,
      backgroundColor: isSelected
        ? 'var(--accent)'
        : isFocused
        ? 'var(--input)'
        : 'var(--select-bg)',
      color: isSelected ? 'var(--accent-foreground)' : 'var(--foreground)',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'var(--select-bg)',
    }),
  };

  export default customSelectStyles;