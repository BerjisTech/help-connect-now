
import { useState } from 'react';
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
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img 
                src="/lovable-uploads/58958b46-1379-46a1-9e28-8f3c7133bc7a.png" 
                alt="Expert consultants" 
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-primary leading-tight">
                Connect with Expert Consultants in Minutes
              </h1>
              <p className="text-xl text-gray-700">
                Find specialized consultants from all industries ready to help solve your problems through video, audio, or text chat.
              </p>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Describe what you need help with..."
                  className="text-lg py-6"
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                />
                <div className="flex flex-col sm:flex-row gap-4">
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
          </div>
        </div>
      </section>

      {/* Featured Consultants Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Top Consultants Ready to Help</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform connects you with verified experts across industries
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {consultants.map((consultant) => (
              <div 
                key={consultant.id} 
                className="relative h-96 rounded-xl overflow-hidden shadow-lg group transition-all duration-300 hover:-translate-y-2"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center z-0" 
                  style={{ backgroundImage: `url(${consultant.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                  <div className="flex items-center mb-1">
                    <span className="flex items-center text-yellow-400 mr-1">
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
                  <Button size="sm" className="w-full group-hover:bg-primary">
                    Connect Now <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg">
              <a href="/browse">View All Consultants</a>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get expert help in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <SearchIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Find a Consultant</h3>
              <p className="text-gray-600">
                Browse our marketplace of experts and find the right match for your needs
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Choose Communication</h3>
              <p className="text-gray-600">
                Select your preferred method: video, audio, or text chat
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <PhoneCall className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Get Instant Help</h3>
              <p className="text-gray-600">
                Connect immediately and receive personalized assistance for your problem
              </p>
            </div>
          </div>
          
          <div className="mt-16 bg-white p-8 rounded-xl shadow-sm max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold mb-3">Ready to supercharge your career or business?</h3>
                <p className="text-gray-600 mb-4">
                  Our consultants are online now and ready to help you overcome any challenge.
                </p>
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center text-sm">
                    <Video className="w-4 h-4 mr-1 text-primary" />
                    <span>Video Chat</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <PhoneCall className="w-4 h-4 mr-1 text-primary" />
                    <span>Audio Call</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MessageSquare className="w-4 h-4 mr-1 text-primary" />
                    <span>Text Chat</span>
                  </div>
                </div>
              </div>
              <div className="md:w-1/3">
                <Button asChild size="lg" className="w-full">
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
              <h2 className="text-3xl font-bold mb-6 text-primary">About Us</h2>
              <p className="text-gray-600 mb-4">
                Help Connect Now was founded with a simple mission: to connect people with the right expertise at the moment they need it most.
              </p>
              <p className="text-gray-600 mb-4">
                Our platform brings together industry experts, professionals, and specialists who are passionate about sharing their knowledge and helping others succeed.
              </p>
              <p className="text-gray-600">
                Whether you're facing a technical challenge, need business advice, or require specialized guidance, our consultants are ready to provide personalized assistance through convenient video, audio, or text communication.
              </p>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-6 text-primary">Contact Us</h2>
              <p className="text-gray-600 mb-6">
                Have questions about our platform or need assistance? Our team is here to help.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600">support@helpconnectnow.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <PhoneCall className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-gray-600">+1 (800) 555-0123</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Headquarters</h3>
                    <p className="text-gray-600">123 Innovation Way, Tech City, CA 94103</p>
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
