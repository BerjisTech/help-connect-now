
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

const ReviewPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const interactionId = searchParams.get('interaction');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [interactionData, setInteractionData] = useState<any>(null);
  const [consultantData, setConsultantData] = useState<any>(null);

  useEffect(() => {
    const fetchInteractionData = async () => {
      if (!interactionId) {
        toast.error('No interaction ID provided');
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        
        // Get interaction details
        const { data: interaction, error: interactionError } = await supabase
          .from('interactions')
          .select('*, metadata')
          .eq('id', interactionId)
          .single();
          
        if (interactionError) {
          throw interactionError;
        }
        
        if (!interaction) {
          toast.error('Interaction not found');
          navigate('/');
          return;
        }
        
        setInteractionData(interaction);
        
        // Get consultant details if available
        if (interaction.metadata && typeof interaction.metadata === 'object' && 'consultant_id' in interaction.metadata) {
          const consultantId = String(interaction.metadata.consultant_id);
          
          const { data: consultant, error: consultantError } = await supabase
            .from('consultants')
            .select('*')
            .eq('id', consultantId)
            .single();
            
          if (!consultantError && consultant) {
            setConsultantData(consultant);
          }
        }
      } catch (error) {
        console.error('Error fetching interaction data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchInteractionData();
  }, [interactionId, navigate]);

  const handleSubmitReview = async () => {
    if (!interactionId || !interactionData) return;
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Get current user (if authenticated)
      const { data: { user } } = await supabase.auth.getUser();
      
      // Prepare review data
      const reviewData: any = {
        interaction_id: interactionId,
        rating,
        comment,
        reviewed_user_id: consultantData?.id || interactionData.helper_id,
      };
      
      // Set sender ID based on authentication status
      if (user) {
        reviewData.reviewer_id = user.id;
      } else if (interactionData.anonymous_seeker_id) {
        reviewData.anonymous_reviewer_id = interactionData.anonymous_seeker_id;
      } else {
        // If no user and no anonymous ID, create a new anonymous ID
        const anonymousId = localStorage.getItem('anonymousId') || 
                           Math.random().toString(36).substring(2, 15);
        reviewData.anonymous_reviewer_id = anonymousId;
        localStorage.setItem('anonymousId', anonymousId);
      }
      
      // Insert review
      const { error } = await supabase
        .from('reviews')
        .insert(reviewData);
        
      if (error) throw error;
      
      toast.success('Review submitted successfully');
      navigate('/');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Rate Your Experience</CardTitle>
            <CardDescription>
              {consultantData ? `How was your consultation with ${consultantData.display_name}?` : 'How was your consultation?'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      rating >= star
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            
            <div>
              <Textarea
                placeholder="Share your experience (optional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="h-32"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/')}>
              Skip
            </Button>
            <Button 
              onClick={handleSubmitReview} 
              disabled={submitting || rating === 0}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default ReviewPage;
