"use client";

import React, { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { FiSun, FiMoon, FiCloud } from "react-icons/fi";
import Text from "./Text";

interface ThemeSwitcherProps {
  className?: string;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className = "" }) => {
  const { theme, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const getIcon = (themeValue: string) => {
    switch (themeValue) {
      case "light":
        return <FiSun className="w-5 h-5" />;
      case "dark":
        return <FiMoon className="w-5 h-5" />;
      case "silver":
        return <FiCloud className="w-5 h-5" />;
      default:
        return <FiSun className="w-5 h-5" />;
    }
  };

  const getThemeColor = (themeValue: string) => {
    switch (themeValue) {
      case "light":
        return "bg-yellow-100 text-yellow-800";
      case "dark":
        return "bg-gray-800 text-gray-200";
      case "silver":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 border border-gray-300"
        aria-label="Theme Switcher"
      >
        {getIcon(theme)}
        <Text className="capitalize text-sm font-medium">{theme}</Text>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Theme Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 neu-soft">
            <div className="p-2">
              <Text className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Choose Theme
              </Text>
              
              {availableThemes.map((themeOption) => (
                <button
                  key={themeOption.value}
                  onClick={() => {
                    setTheme(themeOption.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ${
                    theme === themeOption.value
                      ? `${getThemeColor(themeOption.value)} shadow-sm`
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {getIcon(themeOption.value)}
                  <div className="flex-1 text-left">
                    <Text className="font-medium">{themeOption.label}</Text>
                    <Text className="text-xs opacity-75">
                      {themeOption.value === "light" && "Bright & clean"}
                      {themeOption.value === "silver" && "Professional silver"}
                      {themeOption.value === "dark" && "Easy on eyes"}
                    </Text>
                  </div>
                  {theme === themeOption.value && (
                    <div className="w-2 h-2 rounded-full bg-current opacity-60" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSwitcher;