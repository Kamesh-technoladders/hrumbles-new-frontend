
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CandidatesList from "../CandidatesList";
import { Candidate, CandidateStatus } from "@/lib/types";

interface CandidatesTabsSectionProps {
  jobId: string;
  candidates: Candidate[];
  onAddCandidate: () => void;
}

const CandidatesTabsSection = ({ 
  jobId, 
  candidates, 
  onAddCandidate 
}: CandidatesTabsSectionProps) => {
  const [activeTab, setActiveTab] = useState("all");


  // Calculate counts for each status category
  const newCount = candidates.filter(c => c.status === "New").length;
  const inReviewCount = candidates.filter(c => c.status === "InReview").length;
  const engagedCount = candidates.filter(c => c.status === "Engaged").length;
  const availableCount = candidates.filter(c => c.status === "Available").length;
  const offeredCount = candidates.filter(c => c.status === "Offered").length;
  const hiredCount = candidates.filter(c => c.status === "Hired").length;
  const rejectedCount = candidates.filter(c => c.status === "Rejected").length;

  // Also include the original status values for backward compatibility
  const screeningCount = candidates.filter(c => c.status === "Screening").length;
  const interviewingCount = candidates.filter(c => c.status === "Interviewing").length;
  const selectedCount = candidates.filter(c => c.status === "Selected").length;

  return (
    <div className="md:col-span-3">
      <Tabs defaultValue="all" className="w-full">
        <div className="border-b mb-4 overflow-x-auto">
          <TabsList className="w-full justify-start bg-transparent p-0">
            <TabsTrigger 
              value="all" 
              onClick={() => setActiveTab("all")}
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 pb-3"
            >
              All Candidates ({candidates.length})
            </TabsTrigger>
            <TabsTrigger 
              value="new" 
              onClick={() => setActiveTab("new")}
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 pb-3"
            >
              New ({newCount + screeningCount})
            </TabsTrigger>
            <TabsTrigger 
              value="inReview" 
              onClick={() => setActiveTab("inReview")}
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 pb-3"
            >
              In Review ({inReviewCount + interviewingCount})
            </TabsTrigger>
            <TabsTrigger 
              value="engaged" 
              onClick={() => setActiveTab("engaged")}
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 pb-3"
            >
              Engaged ({engagedCount})
            </TabsTrigger>
            <TabsTrigger 
              value="available" 
              onClick={() => setActiveTab("available")}
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 pb-3"
            >
              Available ({availableCount})
            </TabsTrigger>
            <TabsTrigger 
              value="offered" 
              onClick={() => setActiveTab("offered")}
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 pb-3"
            >
              Offered ({offeredCount})
            </TabsTrigger>
            <TabsTrigger 
              value="hired" 
              onClick={() => setActiveTab("hired")}
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 pb-3"
            >
              Hired ({hiredCount + selectedCount})
            </TabsTrigger>
            <TabsTrigger 
              value="rejected" 
              onClick={() => setActiveTab("rejected")}
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 pb-3"
            >
              Rejected ({rejectedCount})
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="mt-0">
          <CandidatesList jobId={jobId} onAddCandidate={onAddCandidate} />
        </TabsContent>
        
        <TabsContent value="new" className="mt-0">
          <CandidatesList jobId={jobId} statusFilter="New" onAddCandidate={onAddCandidate} />
        </TabsContent>
        
        <TabsContent value="inReview" className="mt-0">
          <CandidatesList jobId={jobId} statusFilter="InReview" onAddCandidate={onAddCandidate} />
        </TabsContent>
        
        <TabsContent value="engaged" className="mt-0">
          <CandidatesList jobId={jobId} statusFilter="Engaged" onAddCandidate={onAddCandidate} />
        </TabsContent>
        
        <TabsContent value="available" className="mt-0">
          <CandidatesList jobId={jobId} statusFilter="Available" onAddCandidate={onAddCandidate} />
        </TabsContent>
        
        <TabsContent value="offered" className="mt-0">
          <CandidatesList jobId={jobId} statusFilter="Offered" onAddCandidate={onAddCandidate} />
        </TabsContent>
        
        <TabsContent value="hired" className="mt-0">
          <CandidatesList jobId={jobId} statusFilter="Hired" onAddCandidate={onAddCandidate} />
        </TabsContent>
        
        <TabsContent value="rejected" className="mt-0">
          <CandidatesList jobId={jobId} statusFilter="Rejected" onAddCandidate={onAddCandidate} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CandidatesTabsSection;
