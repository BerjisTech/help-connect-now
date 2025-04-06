
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';

const NotFoundState = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Interaction Not Found</CardTitle>
        <CardDescription>
          The interaction you're looking for doesn't exist or you don't have access to it.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild>
          <a href="/browse">Find a Consultant</a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NotFoundState;
