import React from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = ({ isDark, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300 focus:outline-none"
    >
      {/* Track */}
      <div 
        className={`absolute inset-y-1 start-1 end-1 flex items-center justify-between px-1 ${
          isDark ? 'text-white' : 'text-gray-600'
        }`}
      >
        <Moon size={14} />
        <Sun size={14} />
      </div>
      
      {/* Thumb */}
      <div
        className={`${
          isDark ? 'translate-x-[1.5rem]' : 'translate-x-0'
        } pointer-events-none h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out mx-1`}
      />
    </button>
  );
};

export default ThemeToggle;