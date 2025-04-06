
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent
} from '@/components/ui/card';

interface ProblemCardProps {
  description: string;
}

export const ProblemCard = ({ description }: ProblemCardProps) => {
  if (!description) return null;
  
  return (
    <Card className="mb-6 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-lg">Your Problem Description</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
    </Card>
  );
};
