
import React from 'react';
import { useTheme } from '../hooks/useTheme';

const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">Theme</span>
      <button
        onClick={toggleTheme}
        className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-[--accent-green]/50"
      >
        <span
          className={`${
            theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
          } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
        />
      </button>
    </div>
  );
};

export default ThemeSwitcher;
