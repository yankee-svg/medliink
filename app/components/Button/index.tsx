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
  const baseClasses = "neu-button capitalize font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "text-white",
    secondary: "neu-text-primary",
    accent: "text-white",
    ghost: "bg-transparent shadow-none hover:bg-base-200"
  };
  
  const sizeClasses = {
    sm: "px-3 py-2 text-sm rounded-xl",
    md: "px-6 py-3 text-base rounded-2xl",
    lg: "px-8 py-4 text-lg rounded-2xl"
  };
  
  const backgroundClasses = {
    primary: "bg-primary",
    secondary: "bg-base-200",
    accent: "bg-accent",
    ghost: ""
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${backgroundClasses[variant]} ${className}`}
      {...others}
    >
      {children}
    </button>
  );
};

export default Button;
