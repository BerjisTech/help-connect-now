import { useState } from 'react';
import Layout from '@/components/Layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('active');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Summary */}
          <div className="lg:w-1/3">
            <Card>
              <CardHeader>
                <CardTitle>Profile Summary</CardTitle>
                <CardDescription>Your account details at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Add profile information here */}
                <p>Display Name: John Doe</p>
                <p>Email: john.doe@example.com</p>
                {/* More details can be added */}
              </CardContent>
              <CardFooter>
                {/* Add actions like "Edit Profile" */}
              </CardFooter>
            </Card>
          </div>
          
          {/* Interactions List */}
          <div className="lg:w-2/3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Your Interactions</CardTitle>
                  <Select 
                    value={activeTab} 
                    onValueChange={setActiveTab}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="all">All Interactions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>

              <CardContent>
                {/* List of interactions based on the activeTab */}
                <ul>
                  <li>Interaction 1 - Status: {activeTab}</li>
                  <li>Interaction 2 - Status: {activeTab}</li>
                  {/* More interactions can be added */}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
