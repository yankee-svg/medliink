import React from "react";

interface ButtonProps {
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = ({ 
  className, 
  children, 
  disabled, 
  onClick, 
  variant = "primary",
  size = "md",
  ...others 
}: ButtonProps) => {
  const getButtonStyles = () => {
    if (variant === "primary") {
      return `bg-[#3B82F6] text-white font-medium px-6 py-3 rounded-2xl transition-all duration-200 hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${className || ''}`;
    }
    
    if (variant === "secondary") {
      return `bg-base-200 neu-text-primary font-medium px-6 py-3 rounded-2xl transition-all duration-200 hover:bg-base-200/80 focus:outline-none focus:ring-2 focus:ring-base-200 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed neu-raised ${className || ''}`;
    }
    
    if (variant === "accent") {
      return `bg-[#93C5FD] text-white font-medium px-6 py-3 rounded-2xl transition-all duration-200 hover:bg-[#60A5FA] focus:outline-none focus:ring-2 focus:ring-[#93C5FD] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${className || ''}`;
    }
    
    // ghost variant
    return `bg-transparent text-[#3B82F6] font-medium px-6 py-3 rounded-2xl transition-all duration-200 hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed ${className || ''}`;
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={getButtonStyles()}
      {...others}
    >
      {children}
    </button>
  );
};

export default Button;
