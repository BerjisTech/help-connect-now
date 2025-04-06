import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import VideoCall from '@/components/interaction/VideoCall';
import ConsultationTimer from '@/components/interaction/ConsultationTimer';

interface InteractionData {
  id: string;
  created_at: string;
  status: string;
  interaction_type: 'video' | 'audio' | 'text';
  description: string;
  metadata: any;
  seeker_id?: string;
  helper_id?: string;
  anonymous_seeker_id?: string;
  ended_at?: string;
  is_active?: boolean;
  updated_at?: string;
}

interface ConsultantData {
  id: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  industry?: string;
  expertise?: string[];
}

const InteractionPage = () => {
  const [searchParams] = useSearchParams();
  const interactionId = searchParams.get('id');
  
  const [interaction, setInteraction] = useState<InteractionData | null>(null);
  const [consultant, setConsultant] = useState<ConsultantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [joinAs, setJoinAs] = useState<'consultant' | 'user'>('user');
  const [endCallConfirmOpen, setEndCallConfirmOpen] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<string | null>(null);

  useEffect(() => {
    if (interactionId) {
      fetchInteractionData();
    }
  }, [interactionId]);

  const fetchInteractionData = async () => {
    try {
      setLoading(true);
      const { data: interactionData, error: interactionError } = await supabase
        .from('interactions')
        .select('*')
        .eq('id', interactionId)
        .single();

      if (interactionError) throw interactionError;
      
      const safeInteractionData: InteractionData = {
        ...interactionData,
        metadata: interactionData.metadata || {}
      };
      
      setInteraction(safeInteractionData);

      if (safeInteractionData?.metadata?.consultant_id) {
        const { data: consultantData, error: consultantError } = await supabase
          .from('consultants')
          .select('*')
          .eq('id', safeInteractionData.metadata.consultant_id)
          .single();

        if (consultantError) {
          console.error('Error fetching consultant:', consultantError);
          toast.error('Could not load consultant information');
        } else {
          setConsultant(consultantData);
        }
      }

      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('interaction_id', interactionId)
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        toast.error('Could not load messages');
      } else {
        setMessages(messagesData || []);
      }
    } catch (error) {
      console.error('Error loading interaction data:', error);
      toast.error('Failed to load interaction data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (interaction && interaction.status === 'active') {
      if (!timerRunning) {
        setTimerRunning(true);
        
        if (!sessionStartTime) {
          const now = new Date().toISOString();
          setSessionStartTime(now);
          
          updateInteractionStartTime(now);
        }
      }
    }
  }, [interaction, timerRunning, sessionStartTime]);

  const updateInteractionStartTime = async (startTime: string) => {
    if (!interactionId) return;
    
    try {
      await supabase
        .from('interactions')
        .update({
          metadata: {
            ...interaction?.metadata,
            session_start_time: startTime
          }
        })
        .eq('id', interactionId);
    } catch (error) {
      console.error('Error updating interaction start time:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !interactionId) return;

    try {
      setSendingMessage(true);
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;

      const messageData: any = {
        interaction_id: interactionId,
        content: newMessage.trim(),
      };

      if (userId) {
        messageData.sender_id = userId;
      } else if (interaction?.anonymous_seeker_id) {
        messageData.anonymous_sender_id = interaction.anonymous_seeker_id;
      }

      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();

      if (error) throw error;
      
      setMessages([...messages, data]);
      setNewMessage('');
      toast.success('Message sent');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const startVideoCall = (role: 'consultant' | 'user' = 'user') => {
    if (interaction?.interaction_type !== 'video') {
      toast.error('This interaction is not set up for video calls');
      return;
    }
    setJoinAs(role);
    setShowVideoCall(true);
  };

  const endVideoCall = () => {
    setEndCallConfirmOpen(true);
  };

  const confirmEndCall = async () => {
    setShowVideoCall(false);
    setEndCallConfirmOpen(false);
    setTimerRunning(false);
    toast.success('Video call ended');
    
    if (interaction?.id) {
      try {
        await supabase
          .from('interactions')
          .update({ 
            status: 'completed',
            ended_at: new Date().toISOString(),
            metadata: {
              ...interaction.metadata,
              session_end_time: new Date().toISOString()
            }
          })
          .eq('id', interaction.id);
      } catch (error) {
        console.error('Error updating interaction status:', error);
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg">Loading interaction data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!interaction) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Interaction Not Found</CardTitle>
              <CardDescription>
                The interaction you're looking for doesn't exist or you don't have access to it.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <a href="/browse">Find a Consultant</a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
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
                    startTime={interaction.metadata?.session_start_time || sessionStartTime}
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
                        This will stop the timer and close the current interaction. You can leave feedback and rate your consultant afterward.
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
          </div>
          
          <div className="lg:col-span-2">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>
                  {showVideoCall ? 'Video Call' : 
                   interaction.interaction_type === 'text' ? 'Chat' : 'Messages'}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                {showVideoCall ? (
                  <div className="h-[400px]">
                    <VideoCall
                      interactionId={interaction.id}
                      participantId={consultant?.id}
                      isInitiator={joinAs === 'user'}
                      onEndCall={() => setShowVideoCall(false)}
                      joinAs={joinAs}
                    />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.sender_id === interaction.helper_id ? 'justify-start' : 'justify-end'}`}
                      >
                        <div 
                          className={`rounded-lg px-4 py-2 max-w-[80%] ${
                            message.sender_id === interaction.helper_id 
                              ? 'bg-secondary text-secondary-foreground' 
                              : 'bg-primary text-primary-foreground'
                          }`}
                        >
                          <p>{message.content}</p>
                          <span className="text-xs opacity-70">
                            {new Date(message.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              
              {!showVideoCall && (
                <CardFooter className="pt-2">
                  <div className="flex w-full gap-2">
                    <Textarea 
                      placeholder="Type your message here..." 
                      className="flex-1"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <Button 
                      className="self-end" 
                      onClick={sendMessage}
                      disabled={sendingMessage || !newMessage.trim()}
                    >
                      {sendingMessage ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InteractionPage;
