
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Database } from '@/integrations/supabase/types';

type Availability = Database['public']['Enums']['availability_status'];

interface ConsultantSectionProps {
  isConsultant: boolean;
  hourlyRate: string;
  availability: Availability;
  setIsConsultant: (value: boolean) => void;
  setHourlyRate: (value: string) => void;
  setAvailability: (value: Availability) => void;
}

const ConsultantSection: React.FC<ConsultantSectionProps> = ({
  isConsultant,
  hourlyRate,
  availability,
  setIsConsultant,
  setHourlyRate,
  setAvailability
}) => {
  return (
    <div className="pt-4 border-t">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Register as Consultant</h3>
          <p className="text-sm text-gray-500">Make yourself available to help others</p>
        </div>
        <Switch
          checked={isConsultant}
          onCheckedChange={setIsConsultant}
        />
      </div>

      {isConsultant && (
        <>
          <div className="space-y-2 mt-4">
            <Label htmlFor="hourlyRate">Hourly Rate (USD)</Label>
            <Input
              id="hourlyRate"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
            />
          </div>
          
          <div className="space-y-2 mt-4">
            <Label htmlFor="availability">Availability</Label>
            <Select 
              value={availability} 
              onValueChange={(value) => setAvailability(value as Availability)}
            >
              <SelectTrigger id="availability">
                <SelectValue placeholder="Set your availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );
};

export default ConsultantSection;
