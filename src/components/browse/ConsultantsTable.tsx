
import { StarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Consultant } from './types';

interface ConsultantsTableProps {
  consultants: Consultant[];
  onInteraction: (id: string, type: 'video' | 'audio' | 'text') => void;
}

export const ConsultantsTable = ({ consultants, onInteraction }: ConsultantsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Expertise</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consultants.map((consultant) => (
            <TableRow key={consultant.id.toString()}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={consultant.image} />
                    <AvatarFallback>{consultant.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {consultant.name}
                </div>
              </TableCell>
              <TableCell>{consultant.industry}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {consultant.expertise.slice(0, 2).map((exp, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {exp}
                    </Badge>
                  ))}
                  {consultant.expertise.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{consultant.expertise.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                  {consultant.rating.toFixed(1)}
                </div>
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                  consultant.availability === 'available' ? 'bg-green-100 text-green-800' :
                  consultant.availability === 'busy' ? 'bg-amber-100 text-amber-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full mr-1 ${
                    consultant.availability === 'available' ? 'bg-green-500' :
                    consultant.availability === 'busy' ? 'bg-amber-500' :
                    'bg-gray-500'
                  }`} />
                  {consultant.availability?.charAt(0).toUpperCase() + consultant.availability?.slice(1)}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="default"
                    onClick={() => onInteraction(consultant.id.toString(), 'video')}
                    disabled={consultant.availability === 'offline'}
                  >
                    Video
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onInteraction(consultant.id.toString(), 'text')}
                    disabled={consultant.availability === 'offline'}
                  >
                    Chat
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
