
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
      <h3 className="font-medium mb-2 dark:text-gray-200">Theme Settings</h3>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium dark:text-white">Light Mode</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Use light theme</p>
          </div>
          <Switch
            checked={theme === 'light'}
            onCheckedChange={() => setTheme('light')}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium dark:text-white">Dark Mode</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Use dark theme</p>
          </div>
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={() => setTheme('dark')}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium dark:text-white">Use System Settings</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Follow your system's theme settings</p>
          </div>
          <Switch
            checked={theme === 'system'}
            onCheckedChange={() => setTheme('system')}
          />
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
