
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface ExpertiseSectionProps {
  expertise: string[];
  expertiseInput: string;
  setExpertiseInput: (value: string) => void;
  onAddExpertise: () => void;
  onRemoveExpertise: (index: number) => void;
}

const ExpertiseSection: React.FC<ExpertiseSectionProps> = ({
  expertise,
  expertiseInput,
  setExpertiseInput,
  onAddExpertise,
  onRemoveExpertise
}) => {
  return (
    <div className="space-y-3 dark:text-gray-300">
      <Label>Expertise</Label>
      <div className="flex gap-2">
        <Input
          placeholder="Add area of expertise..."
          className="w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300"
          value={expertiseInput}
          onChange={(e) => setExpertiseInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onAddExpertise();
            }
          }}
        />
        <Button type="button" onClick={onAddExpertise}>
          Add
        </Button>
      </div>
      
      {expertise.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {expertise.map((exp, index) => (
            <div 
              key={index} 
              className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center"
            >
              {exp}
              <button 
                type="button"
                className="ml-2 text-gray-500 hover:text-gray-700"
                onClick={() => onRemoveExpertise(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpertiseSection;
