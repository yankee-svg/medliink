"use client";

import React, { MutableRefObject } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  inputRef?: MutableRefObject<HTMLInputElement | null>;
  required?: boolean;
  variant?: "default" | "search" | "textarea";
  label?: string;
}

const Input = ({
  className,
  inputRef,
  required = true,
  variant = "default",
  label,
  ...others
}: InputProps) => {
  const baseClasses = "neu-input w-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 placeholder:text-base-content placeholder:opacity-50";
  
  const variantClasses = {
    default: "h-12",
    search: "h-12 pl-12",
    textarea: "h-24 resize-none"
  };

  const renderInput = () => {
    const inputElement = (
      <input
        ref={inputRef}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        {...others}
        required={required}
      />
    );

    if (variant === "search") {
      return (
        <div className="relative">
          <input
            ref={inputRef}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            {...others}
            required={required}
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg 
              className="h-5 w-5 text-base-content opacity-50" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
        </div>
      );
    }

    return inputElement;
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block neu-text-primary text-sm font-medium mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      {renderInput()}
    </div>
  );
};

export default Input;
