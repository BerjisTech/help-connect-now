import { PricingModel } from '@/components/interaction/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
interface ConsultantPricingProps {
  models: PricingModel[];
}
const ConsultantPricing = ({
  models
}: ConsultantPricingProps) => {
  return <section className="py-16 bg-gray-50 dark:bg-indigo-950">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center">Pricing</h2>
        
        <div className="gap-8 flex flex-wrap items-center justify-center max-w-6xl mx-auto">
          {models.map(model => <Card key={model.id} className={`min-w-[300px] min-h-[400px] dark:bg-indigo-700/70 dark:border-indigo-700/70 border overflow-hidden h-full flex flex-col ${model.isHighlighted ? 'shadow-lg ring-2 ring-primary' : 'shadow-sm'}`}>
              {model.isHighlighted && <div className="bg-primary dark:bg-indigo-950 text-primary-foreground py-1 text-center text-sm font-medium">
                  Recommended
                </div>}
              <CardHeader>
                <CardTitle className="text-xl">{model.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    {model.currency === 'USD' ? '$' : ''}
                    {model.price}
                  </span>
                  {model.period && <span className="text-gray-500 ml-1">
                      {model.period}
                    </span>}
                </div>
                
                <ul className="space-y-3">
                  {model.features.map((feature, index) => <li key={index} className="flex items-start dark:text-accent">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>)}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Book Now</Button>
              </CardFooter>
            </Card>)}
        </div>
      </div>
    </section>;
};
export default ConsultantPricing;