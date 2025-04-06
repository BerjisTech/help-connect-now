
import { FAQItem } from '@/components/interaction/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ConsultantFAQProps {
  questions: FAQItem[];
}

const ConsultantFAQ = ({ questions }: ConsultantFAQProps) => {
  if (questions.length === 0) {
    return null;
  }
  
  return (
    <section className="py-16 bg-white dark:bg-indigo-950 dark:text-accent">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
        
        <Accordion type="single" collapsible className="w-full">
          {questions.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default ConsultantFAQ;
