
import { Users, CheckCircle2, FileText, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/jobs/ui/card";
import { Badge } from "@/components/jobs/ui/badge";
import { JobData, Candidate } from "@/lib/types";

interface SubmissionOverviewCardProps {
  job: JobData;
  candidates: Candidate[];
}

const SubmissionOverviewCard = ({ job, candidates }: SubmissionOverviewCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "OPEN":
        return "bg-green-100 text-green-800";
      case "HOLD":
        return "bg-orange-100 text-orange-800";
      case "CLOSE":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="md:col-span-1">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-lg font-semibold text-amber-600 flex items-center">
          <FileText className="mr-2" size={18} />
          Submission Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <ul className="space-y-3">
          <li className="flex items-start justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Users size={16} className="mr-2 text-blue-500" />
              <span>Internal Submission:</span>
            </div>
            <Badge variant="outline" className="bg-blue-50">
              {candidates.filter(c => c.status === "Screening").length}
            </Badge>
          </li>
          <li className="flex items-start justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Users size={16} className="mr-2 text-green-500" />
              <span>Client Submission:</span>
            </div>
            <Badge variant="outline" className="bg-green-50">
              {candidates.filter(c => c.status === "Interviewing").length}
            </Badge>
          </li>
          <li className="flex items-start justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <CheckCircle2 size={16} className="mr-2 text-amber-500" />
              <span>Interviewed:</span>
            </div>
            <Badge variant="outline" className="bg-amber-50">0</Badge>
          </li>
          <li className="flex items-start justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Users size={16} className="mr-2 text-indigo-500" />
              <span>Joined:</span>
            </div>
            <Badge variant="outline" className="bg-indigo-50">
              {candidates.filter(c => c.status === "Selected").length}
            </Badge>
          </li>
          <li className="flex items-start justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <FileText size={16} className="mr-2 text-emerald-500" />
              <span>Offer:</span>
            </div>
            <Badge variant="outline" className="bg-emerald-50">0</Badge>
          </li>
          <li className="flex items-start justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar size={16} className="mr-2 text-red-500" />
              <span>Posted Date:</span>
            </div>
            <span className="font-medium">{job.postedDate}</span>
          </li>
          <li className="flex items-start justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar size={16} className="mr-2 text-purple-500" />
              <span>Job Status:</span>
            </div>
            <Badge className={getStatusColor(job.status)}>
              {job.status}
            </Badge>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default SubmissionOverviewCard;
