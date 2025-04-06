
import { Profile } from './types';
import { HelperCard } from './HelperCard';

interface HelpersSectionProps {
  helpers: Profile[];
  filteredHelpers: Profile[];
  loading: boolean;
  onInteraction: (id: string, type: 'video' | 'audio' | 'text') => void;
}

export const HelpersSection = ({
  filteredHelpers,
  loading,
  onInteraction
}: HelpersSectionProps) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading helpers...</p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Helpers</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHelpers.map((helper) => (
          <HelperCard
            key={helper.id}
            helper={helper}
            onInteraction={onInteraction}
          />
        ))}
      </div>
    </>
  );
};
