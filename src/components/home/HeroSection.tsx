
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

// Array of ambient background gradient styles
const backgroundStyles = [
  'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400',
  'bg-gradient-to-r from-indigo-600 via-indigo-400 to-purple-500',
  'bg-gradient-to-r from-purple-600 via-indigo-500 to-indigo-400',
  'bg-gradient-to-r from-indigo-500 via-purple-400 to-pink-400',
  'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500',
];

export const HeroSection = () => {
  const [problemDescription, setProblemDescription] = useState('');
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const navigate = useNavigate();

  // Effect for changing background at random intervals
  useEffect(() => {
    const changeBackground = () => {
      setCurrentBgIndex(prev => (prev + 1) % backgroundStyles.length);
      
      // Random interval between 5-12 seconds
      const nextInterval = Math.floor(Math.random() * (12000 - 5000) + 5000);
      setTimeout(changeBackground, nextInterval);
    };
    
    const initialTimeout = setTimeout(changeBackground, 7000); // Initial change after 7 seconds
    
    return () => clearTimeout(initialTimeout);
  }, []);

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
    <section className="py-24 relative overflow-hidden">
      <div className={`absolute inset-0 ${backgroundStyles[currentBgIndex]} opacity-10 transition-all duration-3000 animate-gradient-x`}></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSg5OSwxMDIsMjQxLDAuMDMpIj48L3JlY3Q+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIj48L3JlY3Q+PC9zdmc+')] opacity-30"></div>
      
      <div className="absolute w-64 h-64 rounded-full bg-indigo-300/20 -top-10 -left-10 blur-3xl animate-pulse-soft"></div>
      <div className="absolute w-96 h-96 rounded-full bg-indigo-500/10 bottom-0 right-0 blur-3xl animate-pulse-soft animation-delay-2000"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-end">
          <div className="max-w-3xl text-right space-y-8 mb-10">
            <h1 className="text-5xl md:text-6xl font-bold text-primary leading-tight">
              Connect with Expert Consultants in Minutes
            </h1>
            <p className="text-xl text-indigo-900/80">
              Find specialized consultants from all industries ready to help solve your problems through video, audio, or text chat.
            </p>
          </div>
          
          <div className="w-full max-w-2xl ml-auto space-y-6 pt-4">
            <Input
              placeholder="Describe what you need help with..."
              className="text-lg py-6 border-indigo-200 focus:border-indigo-500 shadow-sm"
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                <a href="/auth?tab=signup">Sign Up & Get Help</a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1 border-indigo-300 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800"
                onClick={handleAnonymousHelp}
              >
                Continue Anonymously
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
