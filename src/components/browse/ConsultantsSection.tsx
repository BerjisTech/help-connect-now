
import { Consultant } from './types';
import { ConsultantsGrid } from './ConsultantsGrid';
import { ConsultantsTable } from './ConsultantsTable';

interface ConsultantsSectionProps {
  consultants: Consultant[];
  filteredConsultants: Consultant[];
  viewMode: 'grid' | 'table';
  loading: boolean;
  onInteraction: (id: string, type: 'video' | 'audio' | 'text') => void;
}

export const ConsultantsSection = ({
  filteredConsultants,
  viewMode,
  loading,
  onInteraction
}: ConsultantsSectionProps) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading consultants...</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Consultants</h2>
      
      {viewMode === 'grid' ? (
        <ConsultantsGrid 
          consultants={filteredConsultants} 
          onInteraction={onInteraction} 
        />
      ) : (
        <ConsultantsTable 
          consultants={filteredConsultants} 
          onInteraction={onInteraction} 
        />
      )}
    </div>
  );
};
