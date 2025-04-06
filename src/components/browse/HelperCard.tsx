
import { StarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Profile } from './types';

interface HelperCardProps {
  helper: Profile;
  onInteraction: (id: string, type: 'video' | 'audio' | 'text') => void;
}

export const HelperCard = ({ helper, onInteraction }: HelperCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={helper.avatar_url || ''} />
              <AvatarFallback className="bg-primary text-white">
                {helper.display_name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{helper.display_name}</CardTitle>
              <CardDescription>{helper.industry || 'General'}</CardDescription>
            </div>
          </div>
          
          <div className="flex items-center">
            <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">
              {helper.rating?.toFixed(1) || 'New'}{' '}
              {helper.review_count ? `(${helper.review_count})` : ''}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2">
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
          {helper.bio || 'No bio provided'}
        </p>
        
        {helper.expertise && helper.expertise.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {helper.expertise.slice(0, 3).map((exp, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {exp}
              </Badge>
            ))}
            {helper.expertise.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{helper.expertise.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex items-center mt-1">
          <div className={`h-2 w-2 rounded-full mr-2 ${
            helper.availability === 'available' ? 'bg-green-500' : 
            helper.availability === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
          }`} />
          <span className="text-xs text-gray-600 capitalize">{helper.availability}</span>
          
          {helper.hourly_rate && (
            <div className="ml-auto">
              <span className="text-sm font-medium">${helper.hourly_rate}/hr</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2 pt-2">
        <Button 
          size="sm" 
          variant="default"
          className="flex-1"
          onClick={() => onInteraction(helper.id, 'video')}
          disabled={helper.availability === 'offline'}
        >
          Video Call
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          className="flex-1"
          onClick={() => onInteraction(helper.id, 'text')}
          disabled={helper.availability === 'offline'}
        >
          Chat
        </Button>
      </CardFooter>
    </Card>
  );
};
