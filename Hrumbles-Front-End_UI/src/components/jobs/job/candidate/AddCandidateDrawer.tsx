
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { JobData, CandidateStatus } from "@/lib/types";
import BasicInformationTab from "./BasicInformationTab";
import SkillInformationTab from "./SkillInformationTab";
import { createCandidate, updateCandidate } from "@/services/candidateService";

interface AddCandidateDrawerProps {
  job: JobData;
  onCandidateAdded: () => void;
}

export type CandidateFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentLocation: string;
  preferredLocations: string[];
  totalExperience: number;
  relevantExperience: number;
  currentSalary: number;
  expectedSalary: number;
  resume: File | null;
  skills: Array<{
    name: string;
    rating: number;
  }>;
};

const AddCandidateDrawer = ({ job, onCandidateAdded }: AddCandidateDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("basic-info");
  const [candidateId, setCandidateId] = useState<string | null>(null);
  
  const form = useForm<CandidateFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      currentLocation: "",
      preferredLocations: [],
      totalExperience: 0,
      relevantExperience: 0,
      currentSalary: 0,
      expectedSalary: 0,
      resume: null,
      skills: job.skills?.map(skill => ({ name: skill, rating: 3 })) || []
    }
  });
  
  const handleClose = () => {
    form.reset();
    setCandidateId(null);
    setActiveTab("basic-info");
    setIsOpen(false);
  };
  
  const handleSaveBasicInfo = async (data: CandidateFormData) => {
    try {
      if (!job.id) {
        toast.error("Job ID is missing");
        return;
      }
      
      // Create a new candidate with basic information
      const candidateData = {
        id: candidateId || "",
        name: `${data.firstName} ${data.lastName}`,
        status: "Screening" as CandidateStatus, // Add type assertion here
        experience: `${data.totalExperience} years`,
        matchScore: 0,
        appliedDate: new Date().toISOString().split('T')[0],
        skills: [],
        email: data.email,
        phone: data.phone,
        // Store additional data in the metadata field
        metadata: {
          currentLocation: data.currentLocation,
          preferredLocations: data.preferredLocations,
          totalExperience: data.totalExperience,
          relevantExperience: data.relevantExperience,
          currentSalary: data.currentSalary,
          expectedSalary: data.expectedSalary,
        }
      };
      
      if (!candidateId) {
        // Create new candidate
        const newCandidate = await createCandidate(job.id, candidateData);
        setCandidateId(newCandidate.id);
        toast.success("Basic information saved successfully");
      } else {
        // Update existing candidate
        await updateCandidate(candidateId, candidateData);
        toast.success("Basic information updated successfully");
      }
      
      // Move to skills tab
      setActiveTab("skills-info");
      
    } catch (error) {
      console.error("Error saving candidate basic info:", error);
      toast.error("Failed to save basic information");
    }
  };
  
  const handleSaveSkills = async (data: CandidateFormData) => {
    try {
      if (!candidateId || !job.id) {
        toast.error("Candidate ID or Job ID is missing");
        return;
      }
      
      const skillNames = data.skills.map(skill => skill.name);
      
      // Update candidate with skills
      await updateCandidate(candidateId, {
        id: candidateId,
        name: `${data.firstName} ${data.lastName}`,
        status: "Screening" as CandidateStatus, // Add type assertion here
        experience: `${data.totalExperience} years`,
        matchScore: calculateMatchScore(data.skills),
        appliedDate: new Date().toISOString().split('T')[0],
        skills: skillNames,
        // Store skill ratings in the metadata
        skillRatings: data.skills
      });
      
      toast.success("Candidate added successfully");
      onCandidateAdded();
      handleClose();
    } catch (error) {
      console.error("Error saving candidate skills:", error);
      toast.error("Failed to save skills information");
    }
  };
  
  // Calculate a simple match score based on skill ratings (0-100)
  const calculateMatchScore = (skills: Array<{name: string, rating: number}>) => {
    if (skills.length === 0) return 0;
    
    const totalPossibleScore = skills.length * 5; // 5 is max rating
    const actualScore = skills.reduce((sum, skill) => sum + skill.rating, 0);
    
    return Math.round((actualScore / totalPossibleScore) * 100);
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button id="add-candidate-btn" onClick={() => setIsOpen(true)}>
          Add Candidate
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Add New Candidate</SheetTitle>
        </SheetHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic-info">Basic Information</TabsTrigger>
            <TabsTrigger 
              value="skills-info" 
              disabled={!candidateId}
            >
              Skill Information
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic-info">
            <BasicInformationTab 
              form={form} 
              onSaveAndNext={(data) => handleSaveBasicInfo(data)}
              onCancel={handleClose}
            />
          </TabsContent>
          
          <TabsContent value="skills-info">
            <SkillInformationTab 
              form={form}
              jobSkills={job.skills || []}
              onSave={(data) => handleSaveSkills(data)}
              onCancel={handleClose}
            />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default AddCandidateDrawer;
