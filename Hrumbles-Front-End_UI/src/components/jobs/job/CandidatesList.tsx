
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getCandidatesByJobId, updateCandidateStatus } from "@/services/candidateService";
import { Candidate, CandidateStatus } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/jobs/ui/table";
import StatusSelector from "./candidate/StatusSelector";
import ValidateResumeButton from "./candidate/ValidateResumeButton";
import ActionButtons from "./candidate/ActionButtons";
import StageProgress from "./candidate/StageProgress";
import EmptyState from "./candidate/EmptyState";

interface CandidatesListProps {
  jobId: string;
  statusFilter?: string;
  onAddCandidate?: () => void;
}

const CandidatesList = ({ jobId, statusFilter, onAddCandidate }: CandidatesListProps) => {
  const { data: candidatesData = [], isLoading, refetch } = useQuery({
    queryKey: ['job-candidates', jobId],
    queryFn: () => getCandidatesByJobId(jobId),
  });

  // Recruitment stages
  const recruitmentStages = ["New", "InReview", "Engaged", "Available", "Offered", "Hired"];

  // Convert CandidateData to Candidate type with additional fields for UI
  const candidates: Candidate[] = candidatesData.map(candidate => {
    // Map older status values to new ones
    let statusValue: CandidateStatus = "New";
    
    // If we have the old status format, map it to the new one
    if (candidate.status === "Screening") statusValue = "New";
    else if (candidate.status === "Interviewing") statusValue = "InReview";
    else if (candidate.status === "Selected") statusValue = "Hired";
    else if (candidate.status === "Rejected") statusValue = "Rejected";
    else statusValue = candidate.status as CandidateStatus;

    // Find the stage index for visualization
    const stageIndex = recruitmentStages.indexOf(statusValue);
    const currentStage = statusValue === "Rejected" ? "Rejected" : recruitmentStages[stageIndex >= 0 ? stageIndex : 0];
    
    return {
      id: parseInt(candidate.id) || 0,
      name: candidate.name,
      status: statusValue,
      experience: candidate.experience,
      matchScore: candidate.matchScore,
      appliedDate: candidate.appliedDate,
      skills: candidate.skills || [],
      // Add mock data for the new UI fields
      owner: "John Doe",
      profit: "$2,500",
      currentStage,
      completedStages: recruitmentStages.slice(0, stageIndex),
      hasValidatedResume: Math.random() > 0.5
    };
  });

  // Filter candidates based on statusFilter prop
  const filteredCandidates = statusFilter 
    ? candidates.filter(c => c.status === statusFilter)
    : candidates;

  const handleStatusChange = async (candidateId: number, newStatus: CandidateStatus) => {
    try {
      await updateCandidateStatus(candidateId.toString(), newStatus);
      toast.success(`Candidate status updated to ${newStatus}`);
      refetch(); // Refresh the data
    } catch (error) {
      toast.error("Failed to update candidate status");
      console.error("Error updating status:", error);
    }
  };

  const handleValidateResume = (candidateId: number) => {
    toast.success("Resume validated successfully");
    // In real implementation, this would update the candidate in the database
  };

  const handleViewResume = (candidateId: number) => {
    toast.info("Viewing resume");
    // In real implementation, this would open the resume in a new tab or modal
  };

  const handleScheduleInterview = (candidateId: number) => {
    toast.info("Schedule interview clicked");
    // In real implementation, this would open a scheduling modal
  };

  const handleViewProfile = (candidateId: number) => {
    toast.info("View profile clicked");
    // In real implementation, this would navigate to candidate profile
  };

  const handleCall = (candidateId: number) => {
    toast.info("Call candidate clicked");
    // In real implementation, this would initiate a call or show contact info
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (filteredCandidates.length === 0) {
    return <EmptyState onAddCandidate={onAddCandidate || (() => {})} />;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[300px]">Candidate Name</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Profit</TableHead>
            <TableHead>Stage Progress</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px] text-center">Validated</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCandidates.map((candidate) => (
            <TableRow key={candidate.id}>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>{candidate.name}</span>
                  <span className="text-xs text-muted-foreground">
                    Applied on {candidate.appliedDate}
                  </span>
                </div>
              </TableCell>
              <TableCell>{candidate.owner}</TableCell>
              <TableCell>{candidate.profit}</TableCell>
              <TableCell>
                <div className="w-28">
                  <StageProgress 
                    stages={recruitmentStages}
                    currentStage={candidate.currentStage || "New"}
                  />
                </div>
              </TableCell>
              <TableCell>
                <StatusSelector 
                  status={candidate.status}
                  candidateId={candidate.id}
                  onStatusChange={handleStatusChange}
                />
              </TableCell>
              <TableCell className="text-center">
                <ValidateResumeButton 
                  isValidated={candidate.hasValidatedResume || false}
                  candidateId={candidate.id}
                  onValidate={handleValidateResume}
                />
              </TableCell>
              <TableCell className="text-right">
                <ActionButtons 
                  candidateId={candidate.id}
                  onViewResume={handleViewResume}
                  onScheduleInterview={handleScheduleInterview}
                  onViewProfile={handleViewProfile}
                  onCall={handleCall}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CandidatesList;
