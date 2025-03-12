
import { Briefcase, FileText, Clock, User, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/jobs/ui/card";
import { Badge } from "@/components/jobs/ui/badge";
import { JobData, Candidate } from "@/lib/types";

interface JobOverviewCardProps {
  job: JobData;
  candidates: Candidate[];
}

const JobOverviewCard = ({ job, candidates }: JobOverviewCardProps) => {
  return (
    <Card className="md:col-span-1">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-lg font-semibold text-green-700 flex items-center">
          <Briefcase className="mr-2" size={18} />
          Job Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <ul className="space-y-3">
          <li className="flex items-start justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <FileText size={16} className="mr-2 text-blue-500" />
              <span>Job Title:</span>
            </div>
            <span className="font-medium text-right">{job.title}</span>
          </li>
          <li className="flex items-start justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Briefcase size={16} className="mr-2 text-purple-500" />
              <span>Job ID:</span>
            </div>
            <span className="font-medium text-right">{job.jobId}</span>
          </li>
          <li className="flex items-start justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Clock size={16} className="mr-2 text-amber-500" />
              <span>Hiring Mode:</span>
            </div>
            <span className="font-medium text-right">{job.hiringMode}</span>
          </li>
          <li className="flex items-start justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <User size={16} className="mr-2 text-indigo-500" />
              <span>Job Type:</span>
            </div>
            <span className="font-medium text-right">{job.type}</span>
          </li>
          <li className="flex items-start justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Briefcase size={16} className="mr-2 text-emerald-500" />
              <span>Client Name:</span>
            </div>
            <span className="font-medium text-right">{job.clientDetails?.clientName || job.clientOwner}</span>
          </li>
          <li className="flex items-start justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <MapPin size={16} className="mr-2 text-red-500" />
              <span>Job Location:</span>
            </div>
            <div className="text-right">
              {job.location && job.location.length > 0 ? (
                <Badge variant="outline" className="bg-blue-50">
                  {job.location.join(", ")}
                </Badge>
              ) : (
                <span className="font-medium">Remote</span>
              )}
            </div>
          </li>
          <li className="flex items-start justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Users size={16} className="mr-2 text-cyan-500" />
              <span>Candidates Required:</span>
            </div>
            <Badge>{candidates.length}</Badge>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default JobOverviewCard;
