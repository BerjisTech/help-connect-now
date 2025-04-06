
import { ProfileConfig } from '@/components/interaction/types';

interface ConsultantTrustProps {
  config: ProfileConfig['trustConfig'];
}

const ConsultantTrust = ({ config }: ConsultantTrustProps) => {
  const { companyClients = 0, individualClients = 0 } = config;
  
  const hasCompanyClients = companyClients > 0;
  const hasIndividualClients = individualClients > 0;

  return (
    <section className="py-10 bg-gray-50 dark:bg-indigo-950/50">
      <div className="container mx-auto px-4 text-center">
        {(hasCompanyClients && hasIndividualClients) ? (
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
            Trusted by <span className="font-bold">{companyClients}</span> companies and <span className="font-bold">{individualClients}</span> individual clients
          </p>
        ) : hasCompanyClients ? (
          <p className="text-lg md:text-xl text-gray-700">
            Trusted by <span className="font-bold">{companyClients}</span> companies
          </p>
        ) : hasIndividualClients ? (
          <p className="text-lg md:text-xl text-gray-700">
            <span className="font-bold">{individualClients}</span> clients trust me
          </p>
        ) : (
          <p className="text-lg md:text-xl text-gray-700">
            Ready to work with you
          </p>
        )}
      </div>
    </section>
  );
};

export default ConsultantTrust;
