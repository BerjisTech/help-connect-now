
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  PhoneCall,
  MessageSquare,
  Video
} from 'lucide-react';
import { SearchIcon } from './Icons';

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-indigo-50/50 dark:bg-indigo-950 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/80 dark:from-indigo-500/80 to-white/60"></div>
      <div className="absolute w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiIGZpbGw9InJnYmEoOTksMTAyLDI0MSwwLjA1KSI+PC9jaXJjbGU+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIj48L3JlY3Q+PC9zdmc+')] opacity-50"></div>
      <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-300/10 rounded-full filter blur-3xl animate-pulse-soft"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-300/10 rounded-full filter blur-3xl animate-pulse-soft animation-delay-2000"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-600 dark:text-indigo-950 mb-4">How It Works</h2>
          <p className="text-xl text-indigo-900/70 dark:text-indigo-950 max-w-3xl mx-auto">
            Get expert help in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-950/80 backdrop-blur-sm bg-white/80 dark:bg-indigo-950/80">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-950 rounded-full flex items-center justify-center mx-auto mb-6">
              <SearchIcon className="w-8 h-8 text-indigo-600 " />
            </div>
            <h3 className="text-xl font-bold mb-3 text-indigo-900 dark:text-indigo-500">1. Find a Consultant</h3>
            <p className="text-indigo-800/70 dark:text-indigo-300">
              Browse our marketplace of experts and find the right match for your needs
            </p>
          </div>

          <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-950/80 backdrop-blur-sm bg-white/80 dark:bg-indigo-950/80">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-950 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-indigo-900 dark:text-indigo-500">2. Choose Communication</h3>
            <p className="text-indigo-800/70 dark:text-indigo-300">
              Select your preferred method: video, audio, or text chat
            </p>
          </div>

          <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-950/80 backdrop-blur-sm bg-white/80 dark:bg-indigo-950/80">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-950 rounded-full flex items-center justify-center mx-auto mb-6">
              <PhoneCall className="w-8 h-8 text-indigo-600 dark:text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-indigo-900 dark:text-indigo-500">3. Get Instant Help</h3>
            <p className="text-indigo-800/70 dark:text-indigo-300">
              Connect immediately and receive personalized assistance for your problem
            </p>
          </div>
        </div>

        <div className="mt-16 bg-white p-8 rounded-xl shadow-sm border border-indigo-100  dark:border-indigo-950/80 backdrop-blur-sm bg-white/90 dark:bg-indigo-950/80 max-w-3xl  mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold mb-3 text-indigo-900 dark:text-indigo-500">Ready to supercharge your career or business?</h3>
              <p className="text-indigo-800/70 dark:text-indigo-300 mb-4">
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
  );
};

export default HowItWorksSection;
