import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getJobById } from "@/services/jobService";
import { getCandidatesByJobId } from "@/services/candidateService";
import JobDetailView from "@/components/jobs/job/JobDetailView";
import { Candidate } from "@/lib/types";
import AddCandidateDrawer from "@/components/jobs/job/candidate/AddCandidateDrawer";

const JobView = () => {
  const { id } = useParams<{ id: string }>();
  
  // Fetch job data
  const { 
    data: job, 
    isLoading: jobLoading, 
    error: jobError,
    refetch: refetchJob
  } = useQuery({
    queryKey: ['job', id],
    queryFn: () => getJobById(id || ""),
    enabled: !!id,
  });
  
  // Fetch candidates
  const { 
    data: candidatesData = [],
    refetch: refetchCandidates
  } = useQuery({
    queryKey: ['job-candidates', id],
    queryFn: () => getCandidatesByJobId(id || ""),
    enabled: !!id,
  });

  // Convert CandidateData to Candidate type
  const candidates: Candidate[] = candidatesData.map(candidate => ({
    id: parseInt(candidate.id) || 0, // Convert string id to number
    name: candidate.name,
    status: candidate.status,
    experience: candidate.experience,
    matchScore: candidate.matchScore,
    appliedDate: candidate.appliedDate,
    skills: candidate.skills || []
  }));

  // Listen for real-time changes to job data
  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel('job-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'hr_jobs',
          filter: `id=eq.${id}`
        },
        () => {
          // Refetch job data when it changes
          refetchJob();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, refetchJob]);

  // Listen for real-time changes to job candidates
  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel('candidate-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'hr_job_candidates',
          filter: `job_id=eq.${id}`
        },
        () => {
          // Refetch candidates when they change
          refetchCandidates();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, refetchCandidates]);

  const handleCandidateAdded = () => {
    refetchCandidates();
    toast.success("Candidate added successfully");
  };
  
  if (jobLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (jobError || !job) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h2 className="text-2xl font-bold mb-4">Job not found</h2>
        <p className="text-gray-500 mb-6">The job you're looking for doesn't exist or has been removed.</p>
        <Link to="/jobs">
          <Button className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Jobs
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Link to="/jobs" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-semibold">{job.title}</h1>
        </div>
        
        <div className="flex gap-2">
          <Link to={`/jobs/${job.id}/description`}>
            <Button variant="outline" className="flex items-center gap-2">
              <FileText size={16} />
              <span className="hidden sm:inline">Job Description</span>
              <span className="sm:hidden">JD</span>
            </Button>
          </Link>
          <AddCandidateDrawer job={job} onCandidateAdded={handleCandidateAdded} />
        </div>
      </div>

      <JobDetailView 
        job={job} 
        candidates={candidates} 
        onCandidateAdded={handleCandidateAdded} 
      />
    </div>
  );
};

export default JobView;
