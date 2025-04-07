
import { ConsultantCard } from './ConsultantCard';
import { ConsultantData } from '../interaction/types';

interface ConsultantsGridProps {
  consultants: ConsultantData[];
  onInteraction: (id: string, type: 'video' | 'audio' | 'text') => void;
}

export const ConsultantsGrid = ({ consultants, onInteraction }: ConsultantsGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {consultants.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500">No consultants found matching your criteria.</p>
        </div>
      ) : (
        consultants.map((consultant) => (
          <ConsultantCard 
            key={consultant.id.toString()} 
            consultant={consultant} 
            onInteraction={onInteraction} 
          />
        ))
      )}
    </div>
  );
};
