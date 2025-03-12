
import { Link } from "react-router-dom";
import { ArrowLeft, Edit, Eye, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JobData } from "@/lib/types";
import { useState } from "react";
import ViewJDModal from "@/components/jobs/job/ViewJDModal";

interface JobHeaderSectionProps {
  job: JobData;
  onEditJob: () => void;
}

const JobHeaderSection = ({ job, onEditJob }: JobHeaderSectionProps) => {
  const [isJDModalOpen, setIsJDModalOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-2">
        <Link to="/jobs" className="text-gray-500 hover:text-gray-700">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge
              variant="outline"
              className={`
                ${job.status === "Active" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                ${job.status === "Pending" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" : ""}
                ${job.status === "Completed" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" : ""}
              `}
            >
              {job.status}
            </Badge>
            <span className="text-sm text-gray-500">
              Due: {job.dueDate}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 w-full sm:w-auto">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 flex-1 sm:flex-initial"
          onClick={() => setIsJDModalOpen(true)}
        >
          <Eye size={16} />
          <span className="hidden sm:inline">View JD</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2 flex-1 sm:flex-initial"
        >
          <Share size={16} />
          <span className="hidden sm:inline">Share</span>
        </Button>
        
        <Button 
          className="flex items-center gap-2 flex-1 sm:flex-initial"
          onClick={onEditJob}
        >
          <Edit size={16} />
          <span className="hidden sm:inline">Edit Job</span>
        </Button>
      </div>
      
      {/* View JD Modal */}
      <ViewJDModal 
        job={job}
        open={isJDModalOpen}
        onOpenChange={setIsJDModalOpen}
      />
    </div>
  );
};

export default JobHeaderSection;
