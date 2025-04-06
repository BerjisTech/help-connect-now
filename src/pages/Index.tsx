
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, ArrowRight, CheckCircle, PhoneCall, MessageSquare, Video } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

const consultants = [
  {
    id: 1,
    name: 'Sarah Johnson',
    industry: 'Marketing',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    expertise: ['Digital Marketing', 'Brand Strategy']
  },
  {
    id: 2,
    name: 'Michael Chen',
    industry: 'Finance',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    expertise: ['Investment', 'Financial Planning']
  },
  {
    id: 3,
    name: 'Priya Patel',
    industry: 'Technology',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    expertise: ['Software Development', 'UX Design']
  },
  {
    id: 4,
    name: 'James Wilson',
    industry: 'Business',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    expertise: ['Strategy', 'Operations']
  }
];

// Array of ambient background gradient styles
const backgroundStyles = [
  'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400',
  'bg-gradient-to-r from-indigo-600 via-indigo-400 to-purple-500',
  'bg-gradient-to-r from-purple-600 via-indigo-500 to-indigo-400',
  'bg-gradient-to-r from-indigo-500 via-purple-400 to-pink-400',
  'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500',
];

const Index = () => {
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
    <Layout>
      {/* Hero Section with Dynamic Animated Background */}
      <section className="py-24 relative overflow-hidden">
        <div className={`absolute inset-0 ${backgroundStyles[currentBgIndex]} opacity-10 transition-all duration-3000 animate-gradient-x`}></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSg5OSwxMDIsMjQxLDAuMDMpIj48L3JlY3Q+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIj48L3JlY3Q+PC9zdmc+')] opacity-30"></div>
        
        <div className="absolute w-64 h-64 rounded-full bg-indigo-300/20 -top-10 -left-10 blur-3xl animate-pulse-soft"></div>
        <div className="absolute w-96 h-96 rounded-full bg-indigo-500/10 bottom-0 right-0 blur-3xl animate-pulse-soft animation-delay-2000"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-end"> {/* Changed to items-end for right alignment */}
            <div className="max-w-3xl text-right space-y-8 mb-10"> {/* Changed to text-right */}
              <h1 className="text-5xl md:text-6xl font-bold text-primary leading-tight">
                Connect with Expert Consultants in Minutes
              </h1>
              <p className="text-xl text-indigo-900/80">
                Find specialized consultants from all industries ready to help solve your problems through video, audio, or text chat.
              </p>
            </div>
            
            <div className="w-full max-w-2xl ml-auto space-y-6 pt-4"> {/* Added ml-auto to align to right */}
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

      {/* Featured Consultants Section with Staggered Heights */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-right mb-12"> {/* Changed to text-right */}
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-600 mb-4">Top Consultants Ready to Help</h2>
            <p className="text-xl text-indigo-900/70 max-w-3xl ml-auto"> {/* Added ml-auto to align to right */}
              Our platform connects you with verified experts across industries
            </p>
          </div>
          
          {/* Consultant cards with staggered heights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16"> {/* Added margin-top for staggered effect */}
            {consultants.map((consultant, index) => (
              <div 
                key={consultant.id} 
                className={`relative h-96 rounded-xl overflow-hidden shadow-lg group transition-all duration-300 hover:-translate-y-2 ${
                  // Apply different top margins based on index to create staggered heights
                  index === 0 ? '-mt-16' : 
                  index === 1 ? '-mt-8' : 
                  index === 2 ? 'mt-0' : 
                  'mt-8'
                }`}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center z-0" 
                  style={{ backgroundImage: `url(${consultant.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-800/50 to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                  <div className="flex items-center mb-1">
                    <span className="flex items-center text-yellow-300 mr-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="ml-1">{consultant.rating}</span>
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{consultant.name}</h3>
                  <p className="text-white/80 mb-3">{consultant.industry}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {consultant.expertise.map((skill, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-white/20 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <Button size="sm" className="w-full bg-indigo-500 hover:bg-indigo-600 group-hover:bg-indigo-500">
                    Connect Now <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg" className="border-indigo-300 text-indigo-700 hover:bg-indigo-50">
              <a href="/browse">View All Consultants</a>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-indigo-50/50 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/80 to-white/60"></div>
        <div className="absolute w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiIGZpbGw9InJnYmEoOTksMTAyLDI0MSwwLjA1KSI+PC9jaXJjbGU+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIj48L3JlY3Q+PC9zdmc+')] opacity-50"></div>
        <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-300/10 rounded-full filter blur-3xl animate-pulse-soft"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-300/10 rounded-full filter blur-3xl animate-pulse-soft animation-delay-2000"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-600 mb-4">How It Works</h2>
            <p className="text-xl text-indigo-900/70 max-w-3xl mx-auto">
              Get expert help in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-indigo-100 backdrop-blur-sm bg-white/80">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <SearchIcon className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-indigo-900">1. Find a Consultant</h3>
              <p className="text-indigo-800/70">
                Browse our marketplace of experts and find the right match for your needs
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-indigo-100 backdrop-blur-sm bg-white/80">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-indigo-900">2. Choose Communication</h3>
              <p className="text-indigo-800/70">
                Select your preferred method: video, audio, or text chat
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-indigo-100 backdrop-blur-sm bg-white/80">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <PhoneCall className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-indigo-900">3. Get Instant Help</h3>
              <p className="text-indigo-800/70">
                Connect immediately and receive personalized assistance for your problem
              </p>
            </div>
          </div>
          
          <div className="mt-16 bg-white p-8 rounded-xl shadow-sm border border-indigo-100 backdrop-blur-sm bg-white/90 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold mb-3 text-indigo-900">Ready to supercharge your career or business?</h3>
                <p className="text-indigo-800/70 mb-4">
                  Our consultants are online now and ready to help you overcome any challenge.
                </p>
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center text-sm text-indigo-600">
                    <Video className="w-4 h-4 mr-1" />
                    <span>Video Chat</span>
                  </div>
                  <div className="flex items-center text-sm text-indigo-600">
                    <PhoneCall className="w-4 h-4 mr-1" />
                    <span>Audio Call</span>
                  </div>
                  <div className="flex items-center text-sm text-indigo-600">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    <span>Text Chat</span>
                  </div>
                </div>
              </div>
              <div className="md:w-1/3">
                <Button asChild size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700">
                  <a href="/browse">Find Consultants</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About & Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-indigo-600">About Us</h2>
              <p className="text-indigo-900/70 mb-4">
                Help Connect Now was founded with a simple mission: to connect people with the right expertise at the moment they need it most.
              </p>
              <p className="text-indigo-900/70 mb-4">
                Our platform brings together industry experts, professionals, and specialists who are passionate about sharing their knowledge and helping others succeed.
              </p>
              <p className="text-indigo-900/70">
                Whether you're facing a technical challenge, need business advice, or require specialized guidance, our consultants are ready to provide personalized assistance through convenient video, audio, or text communication.
              </p>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-6 text-indigo-600">Contact Us</h2>
              <p className="text-indigo-900/70 mb-6">
                Have questions about our platform or need assistance? Our team is here to help.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                    <Mail className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-indigo-900">Email</h3>
                    <p className="text-indigo-900/70">support@helpconnectnow.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                    <PhoneCall className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-indigo-900">Phone</h3>
                    <p className="text-indigo-900/70">+1 (800) 555-0123</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                    <Globe className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-indigo-900">Headquarters</h3>
                    <p className="text-indigo-900/70">123 Innovation Way, Tech City, CA 94103</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

// Missing icon components
const SearchIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.3-4.3"></path>
  </svg>
);

const Mail = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

const Globe = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    <path d="M2 12h20"></path>
  </svg>
);

export default Index;
