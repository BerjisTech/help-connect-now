
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

const Index = () => {
  const [problemDescription, setProblemDescription] = useState('');
  const navigate = useNavigate();

  const handleAnonymousHelp = async () => {
    if (!problemDescription.trim()) {
      toast.error('Please describe your problem first');
      return;
    }

    try {
      // Generate anonymous ID
      const anonymousId = uuidv4();
      
      // Store in localStorage for session persistence
      localStorage.setItem('anonymousId', anonymousId);
      
      // Navigate to browse page with the problem description
      navigate(`/browse?anonymous=${anonymousId}&description=${encodeURIComponent(problemDescription)}`);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <Layout>
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
            Connect with Professionals for Immediate Help
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Get personalized assistance from industry experts through video, audio, or text chat.
            Solve your problems quickly with the right professional guidance.
          </p>
          
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <Input
                placeholder="Describe what you need help with..."
                className="text-lg py-6"
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="flex-1">
                <a href="/auth?tab=signup">Sign Up & Get Help</a>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="flex-1"
                onClick={handleAnonymousHelp}
              >
                Continue Anonymously
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Describe Your Problem</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Clearly explain what you need help with so we can match you with the right professional.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Connect with an Expert</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Browse through available professionals and connect instantly via video, audio, or text chat.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Get Personalized Help</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Receive one-on-one guidance from industry professionals to solve your problem.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Give or Receive Help?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button asChild size="lg" className="flex-1">
              <a href="/auth?tab=signup">Sign Up Now</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1">
              <a href="/browse">Browse Helpers</a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
