
import { ConsultantData, ProfileConfig } from '@/components/interaction/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ConsultantHeroProps {
  consultant: ConsultantData;
  config: ProfileConfig['heroConfig'];
}

const ConsultantHero = ({ consultant, config }: ConsultantHeroProps) => {
  const getLayoutClasses = () => {
    switch (config.layout) {
      case 'left-image':
        return 'flex-row md:flex-row';
      case 'right-image':
        return 'flex-row md:flex-row-reverse';
      case 'centered':
        return 'flex-col items-center text-center';
      default:
        return 'flex-row md:flex-row';
    }
  };

  const getTextAlignmentClasses = (alignment: 'left' | 'center' | 'right') => {
    switch (alignment) {
      case 'left':
        return 'text-left';
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  const backgroundStyle = {
    backgroundColor: config.backgroundColor || '#f1f5f9',
    backgroundImage: config.backgroundImage ? `url(${config.backgroundImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  return (
    <section 
      className="py-16 md:py-24" 
      style={backgroundStyle}
    >
      <div className="container mx-auto px-4">
        <div className={`flex items-center gap-8 ${getLayoutClasses()}`}>
          {config.showImage && (
            <div className={`${config.layout === 'centered' ? 'mb-8' : 'w-full md:w-1/3'}`}>
              <Avatar className="w-32 h-32 md:w-56 md:h-56 mx-auto">
                <AvatarImage src={consultant.avatar_url || ''} alt={consultant.display_name} />
                <AvatarFallback className="bg-primary text-white text-2xl md:text-4xl">
                  {consultant.display_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          )}

          <div className={`${config.layout === 'centered' ? 'w-full' : 'w-full md:w-2/3'}`}>
            <h1 
              className={`text-4xl md:text-6xl font-bold mb-4 ${getTextAlignmentClasses(config.textAlignment)}`}
            >
              {config.intro}
            </h1>
            <p 
              className={`text-xl md:text-2xl text-gray-600 ${
                config.taglineAlignment 
                  ? getTextAlignmentClasses(config.taglineAlignment) 
                  : getTextAlignmentClasses(config.textAlignment)
              }`}
            >
              {config.tagline}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultantHero;
