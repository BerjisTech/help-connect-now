
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Consultant {
  id: number;
  name: string;
  industry: string;
  rating: number;
  image: string;
  expertise: string[];
}

interface ConsultantCardProps {
  consultant: Consultant;
  staggerIndex: number;
}

const ConsultantCard = ({ consultant, staggerIndex }: ConsultantCardProps) => {
  // Apply different top margins based on index to create staggered heights
  const staggerClass = 
    staggerIndex === 0 ? '-mt-16' : 
    staggerIndex === 1 ? '-mt-8' : 
    staggerIndex === 2 ? 'mt-0' : 
    'mt-8';

  return (
    <div 
      className={`relative h-96 rounded-xl overflow-hidden shadow-lg group transition-all duration-300 hover:-translate-y-2 ${staggerClass}`}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ backgroundImage: `url(${consultant.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-800/50 to-transparent z-10" />
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
        <div className="flex items-center mb-1">
          <span className="flex items-center text-yellow-300 mr-1">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1">{consultant.rating}</span>
          </span>
        </div>
        <h3 className="text-xl font-bold mb-1">{consultant.name}</h3>
        <p className="text-white/80 mb-3">{consultant.industry}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {consultant.expertise.map((skill, index) => (
            <span 
              key={index} 
              className="px-2 py-1 bg-white/20 rounded-full text-xs"
            >
              {skill}
            </span>
          ))}
        </div>
        <Button size="sm" className="w-full bg-indigo-500 hover:bg-indigo-600 group-hover:bg-indigo-500">
          Connect Now <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default ConsultantCard;
