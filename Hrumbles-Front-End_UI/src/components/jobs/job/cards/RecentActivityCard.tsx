
import { Clock, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/jobs/ui/card";
import { Button } from "@/components/jobs/ui/button";
import { Candidate } from "@/lib/types";

interface RecentActivityCardProps {
  candidates: Candidate[];
  onAddCandidate: () => void;
}

const RecentActivityCard = ({ candidates, onAddCandidate }: RecentActivityCardProps) => {
  return (
    <Card className="md:col-span-1">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
          <Clock className="mr-2" size={18} />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {candidates.length > 0 ? (
          <div className="space-y-4">
            {candidates.slice(0, 3).map((candidate, index) => (
              <div key={index} className="border-l-2 border-blue-400 pl-4 py-1">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-gray-500">14 days ago</span>
                </div>
                <h3 className="font-medium">{candidate.name}</h3>
                <p className="text-sm text-gray-500">
                  Current Status: {candidate.status}
                </p>
                <p className="text-xs text-gray-400">
                  {candidate.appliedDate}
                </p>
                <p className="text-xs text-gray-400">
                  Submitted by HR
                </p>
              </div>
            ))}
            
            {candidates.length === 0 && (
              <p className="text-gray-500 text-center py-6">No recent activity</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40">
            <p className="text-gray-500 mb-4">No candidates added yet</p>
            <Button 
              size="sm" 
              id="add-candidate-btn"
              onClick={onAddCandidate}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Candidate
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
