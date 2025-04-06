
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ConsultationTimer from './ConsultationTimer';
import { InteractionData, ConsultantData } from './types';

interface InteractionDetailsProps {
  interaction: InteractionData;
  consultant: ConsultantData | null;
  timerRunning: boolean;
  sessionStartTime: string | null;
  showVideoCall: boolean;
  startVideoCall: (role: 'consultant' | 'user') => void;
  endCallConfirmOpen: boolean;
  setEndCallConfirmOpen: (open: boolean) => void;
  confirmEndCall: () => void;
}

const InteractionDetails = ({
  interaction,
  consultant,
  timerRunning,
  sessionStartTime,
  showVideoCall,
  startVideoCall,
  endCallConfirmOpen,
  setEndCallConfirmOpen,
  confirmEndCall,
}: InteractionDetailsProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Interaction Details</CardTitle>
            <CardDescription>
              {interaction.interaction_type.toUpperCase()} Consultation
            </CardDescription>
          </div>
          <ConsultationTimer 
            isRunning={timerRunning}
            startTime={sessionStartTime}
            className="bg-secondary/40 px-2 py-1 rounded-md"
          />
        </div>
      </CardHeader>
      <CardContent>
        {consultant ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={consultant.avatar_url || ''} />
                <AvatarFallback>
                  {consultant.display_name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{consultant.display_name}</h3>
                <p className="text-sm text-muted-foreground">{consultant.industry || 'Consultant'}</p>
              </div>
            </div>
            
            {consultant.bio && (
              <div>
                <h4 className="text-sm font-medium mb-1">About</h4>
                <p className="text-sm text-muted-foreground">{consultant.bio}</p>
              </div>
            )}
            
            {consultant.expertise && consultant.expertise.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Expertise</h4>
                <div className="flex flex-wrap gap-1">
                  {consultant.expertise.map((skill, index) => (
                    <span key={index} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Consultant information not available</p>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium mb-1">Consultation Topic</h4>
          <p className="text-sm">{interaction.description || 'No description provided'}</p>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-1">Status</h4>
          <div className="flex items-center">
            <span className={`h-2 w-2 rounded-full mr-2 ${
              interaction.status === 'active' ? 'bg-green-500' : 
              interaction.status === 'pending' ? 'bg-amber-500' : 
              'bg-gray-400'
            }`} />
            <span className="text-sm capitalize">{interaction.status}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 items-stretch">
        {interaction.interaction_type === 'video' && !showVideoCall && (
          <div className="flex flex-col gap-2">
            <Button className="w-full" onClick={() => startVideoCall('user')}>
              Join as User
            </Button>
            <Button className="w-full" variant="outline" onClick={() => startVideoCall('consultant')}>
              Join as Consultant
            </Button>
          </div>
        )}
        
        {interaction.interaction_type === 'audio' && (
          <Button className="w-full">
            Start Audio Call
          </Button>
        )}
        
        <Dialog open={endCallConfirmOpen} onOpenChange={setEndCallConfirmOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              End Interaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>End this consultation?</DialogTitle>
              <DialogDescription>
                This will stop the timer and close the current interaction. You will be redirected to the browse page.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEndCallConfirmOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={confirmEndCall}>End Consultation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default InteractionDetails;
