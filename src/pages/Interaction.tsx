
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import LoadingState from '@/components/interaction/LoadingState';
import NotFoundState from '@/components/interaction/NotFoundState';
import InteractionDetails from '@/components/interaction/InteractionDetails';
import ChatInterface from '@/components/interaction/ChatInterface';
import { useInteractionData } from '@/components/interaction/useInteractionData';

const InteractionPage = () => {
  const [searchParams] = useSearchParams();
  const interactionId = searchParams.get('id');
  
  const {
    interaction,
    consultant,
    loading,
    messages,
    showVideoCall,
    joinAs,
    endCallConfirmOpen,
    timerRunning,
    sessionStartTime,
    setEndCallConfirmOpen,
    startVideoCall,
    endVideoCall,
    confirmEndCall,
    sendMessage,
  } = useInteractionData(interactionId);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <LoadingState />
        </div>
      </Layout>
    );
  }

  if (!interaction) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <NotFoundState />
        </div>
      </Layout>
    );
  }

  // Determine correct join role based on URL and user type
  const isConsultantView = searchParams.get('view') === 'consultant';
  const effectiveJoinAs = isConsultantView ? 'consultant' : 'user';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <InteractionDetails
              interaction={interaction}
              consultant={consultant}
              timerRunning={timerRunning}
              sessionStartTime={sessionStartTime}
              showVideoCall={showVideoCall}
              startVideoCall={() => startVideoCall(effectiveJoinAs)}
              endCallConfirmOpen={endCallConfirmOpen}
              setEndCallConfirmOpen={setEndCallConfirmOpen}
              confirmEndCall={confirmEndCall}
            />
          </div>
          
          <div className="lg:col-span-2">
            <ChatInterface
              showVideoCall={showVideoCall}
              interactionId={interaction.id}
              participantId={consultant?.id ? consultant.id.toString() : undefined}
              joinAs={effectiveJoinAs}
              messages={messages}
              helperId={interaction.helper_id}
              onEndVideoCall={endVideoCall}
              onSendMessage={sendMessage}
              startVideoCall={() => startVideoCall(effectiveJoinAs)}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InteractionPage;
