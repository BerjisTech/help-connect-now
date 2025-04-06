
import { Mail, PhoneCall, Globe } from 'lucide-react';

const AboutContactSection = () => {
  return (
    <section className="py-20 bg-white dark:bg-indigo-950">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-indigo-600">About Us</h2>
            <p className="text-indigo-900/70 dark:text-indigo-300 mb-4">
              Help Connect Now was founded with a simple mission: to connect people with the right expertise at the moment they need it most.
            </p>
            <p className="text-indigo-900/70 dark:text-indigo-300 mb-4">
              Our platform brings together industry experts, professionals, and specialists who are passionate about sharing their knowledge and helping others succeed.
            </p>
            <p className="text-indigo-900/70 dark:text-indigo-300">
              Whether you're facing a technical challenge, need business advice, or require specialized guidance, our consultants are ready to provide personalized assistance through convenient video, audio, or text communication.
            </p>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold mb-6 text-indigo-600">Contact Us</h2>
            <p className="text-indigo-900/70  dark:text-indigo-600 mb-6">
              Have questions about our platform or need assistance? Our team is here to help.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <Mail className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-indigo-900 dark:text-indigo-600">Email</h3>
                  <p className="text-indigo-900/70 dark:text-indigo-300">support@helpconnectnow.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <PhoneCall className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-indigo-900 dark:text-indigo-600">Phone</h3>
                  <p className="text-indigo-900/70 dark:text-indigo-300">+1 (800) 555-0123</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <Globe className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-indigo-900 dark:text-indigo-600">Headquarters</h3>
                  <p className="text-indigo-900/70 dark:text-indigo-300">123 Innovation Way, Tech City, CA 94103</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutContactSection;
