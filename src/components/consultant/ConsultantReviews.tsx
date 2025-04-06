
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import LoadingState from '@/components/interaction/LoadingState';

interface Review {
  id: string;
  rating: number;
  comment: string;
  reviewer_name?: string;
  created_at: string;
}

interface ConsultantReviewsProps {
  consultantId: string;
}

const ConsultantReviews = ({ consultantId }: ConsultantReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('id, rating, comment, created_at, reviewer_id, anonymous_reviewer_id')
          .eq('reviewed_user_id', consultantId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Fetch reviewer names where possible
        const reviewsWithNames = await Promise.all((data || []).map(async (review) => {
          if (review.reviewer_id) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('display_name')
              .eq('id', review.reviewer_id)
              .single();
            
            return {
              ...review,
              reviewer_name: profileData?.display_name || 'Anonymous Client'
            };
          }
          
          return {
            ...review,
            reviewer_name: review.anonymous_reviewer_id ? 'Anonymous Client' : 'Client'
          };
        }));

        setReviews(reviewsWithNames);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [consultantId]);

  if (loading) {
    return <LoadingState />;
  }

  if (reviews.length === 0) {
    return (
      <section className="py-16 bg-white dark:bg-indigo-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Client Reviews</h2>
          <p className="text-gray-600">No reviews yet. Be the first to work with me!</p>
        </div>
      </section>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <section className="py-16 bg-white dark:bg-indigo-950">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Client Reviews</h2>
        
        <Carousel className="w-full max-w-4xl mx-auto">
          <CarouselContent>
            {reviews.map((review) => (
              <CarouselItem key={review.id} className="md:basis-1/1 lg:basis-1/1">
                <Card className="border rounded-lg overflow-hidden shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex mb-3">
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-gray-700 mb-4 italic">"{review.comment}"</p>
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">{review.reviewer_name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-4 gap-2">
            <CarouselPrevious className="relative static transform-none" />
            <CarouselNext className="relative static transform-none" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default ConsultantReviews;
