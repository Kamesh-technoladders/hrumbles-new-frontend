import { useState, useEffect } from "react";
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
import { createCandidate, updateCandidate, updateCandidateSkillRatings } from "@/services/candidateService";
import { useSelector } from "react-redux";
import { supabase } from "@/integrations/supabase/client";
import ProofIdTab from "./ProofIdTab";


interface AddCandidateDrawerProps {
  job: JobData;
  onCandidateAdded: () => void;
  candidate?: Candidate;
  open?: boolean;        // Add this
  onOpenChange?: (open: boolean) => void;  // Add this
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
  totalExperienceMonths?: number;
  relevantExperienceMonths?: number;
  experience?: string; 
  resume: string | null; 
  skills: Array<{
    name: string;
    rating: number;
    experienceYears: number;
    experienceMonths: number;
  }>;
  location?: string;       // Make optional
  expectedSalary?: number; // Make optional
  currentSalary?: number;  // Make optional
  noticePeriod?: string;
  lastWorkingDay?: string;
  linkedInId?: string; // Added
  hasOffers?: "Yes" | "No"; // Added
  offerDetails?: string; // Added
  uan?: string; // Add UAN (optional)
  pan?: string; // Add PAN (optional)
  pf?: string; // Add PF (optional)
  esicNumber?: string; // Add ESIC Number (optional)
};

const AddCandidateDrawer = ({ job, onCandidateAdded, candidate, open, onOpenChange }: AddCandidateDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("basic-info");
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false); // Added loading state
  const user = useSelector((state: any) => state.auth.user);
  const isEditMode = !!candidate;

  // Use controlled open state if provided, otherwise use internal state
  const controlledOpen = open !== undefined ? open : isOpen;
  const controlledOnOpenChange = onOpenChange || setIsOpen;

  console.log("user", user)

  const basicInfoForm = useForm<CandidateFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      currentLocation: "",
      preferredLocations: [],
      totalExperience: undefined, // Changed to undefined
    totalExperienceMonths: undefined,
    relevantExperience: undefined, // Changed to undefined
    relevantExperienceMonths: undefined,
    currentSalary: undefined, // Changed to undefined
    expectedSalary: undefined,
      resume: null,
      skills: [],
      noticePeriod: candidate?.metadata?.noticePeriod || undefined, // Add Notice Period
    lastWorkingDay: candidate?.metadata?.lastWorkingDay || "", // Add Last Working Day
    linkedInId: candidate?.metadata?.linkedInId || "", // Initialize for edit mode
      hasOffers: candidate?.metadata?.hasOffers || undefined, // Initialize for edit mode
      offerDetails: candidate?.metadata?.offerDetails || "", 
    uan: candidate?.metadata?.uan || "", // Initialize for edit mode
      pan: candidate?.metadata?.pan || "", // Initialize for edit mode
      pf: candidate?.metadata?.pf || "", // Initialize for edit mode
      esicNumber: candidate?.metadata?.esicNumber || "", // Initialize for edit mode
    }
  });

  const skillsForm = useForm<CandidateFormData>({
    defaultValues: {
      skills: job.skills?.map(skill => ({ name: skill, rating: 0, experienceYears: 0, experienceMonths: 0 })) || []
    }
  });

  const proofIdForm = useForm<CandidateFormData>({
    defaultValues: {
      uan: candidate?.metadata?.uan || "",
      pan: candidate?.metadata?.pan || "",
      pf: candidate?.metadata?.pf || "",
      esicNumber: candidate?.metadata?.esicNumber || "",
    },
  });
  
  const handleClose = () => {
    basicInfoForm.reset();
    skillsForm.reset();
    proofIdForm.reset();
    setCandidateId(isEditMode ? candidate?.id.toString() : null);
    setActiveTab("basic-info");
    controlledOnOpenChange(false); // Use controlled handler
  };
  
// Inside the component
const watchedValues = basicInfoForm.watch(); // Watches all form fields

useEffect(() => {
  console.log("Basic Information Tab Data:", watchedValues);
}, [watchedValues]); // Logs whenever the form values change

const checkDuplicateCandidate = async (jobId: string, email: string, phone: string) => {
  const { data, error } = await supabase
    .from("hr_job_candidates")
    .select("id, email, phone")
    .eq("job_id", jobId)
    .or(`email.eq.${email},phone.eq.${phone}`);

  if (error) {
    console.error("Error checking duplicate candidate:", error);
    throw error;
  }

  return data && data.length > 0;
};


const handleSaveBasicInfo = async (data: CandidateFormData) => {
  console.log("Form Data Before Saving:", data);

  if (!data.resume) {
    toast.error("Resume is required. Please upload your resume.");
    return;
  }

  if (!job.id) {
    toast.error("Job ID is missing");
    return;
  }

  try {
    const appliedFrom = user?.user_metadata
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
      : "Unknown";
    const createdby = user?.id;

    const formatExperience = (years: number, months?: number) => {
      const yearsStr = years > 0 ? `${years} year${years === 1 ? "" : "s"}` : "";
      const monthsStr = months && months > 0 ? `${months} month${months === 1 ? "" : "s"}` : "";
      return [yearsStr, monthsStr].filter(Boolean).join(" and ") || "0 years";
    };

    const candidateData = {
      id: candidateId || "",
      name: `${data.firstName} ${data.lastName}`,
      status: "Screening" as CandidateStatus,
      experience: formatExperience(data.totalExperience, data.totalExperienceMonths),
      matchScore: 0,
      appliedDate: new Date().toISOString().split('T')[0],
      skills: [],
      email: data.email,
      phone: data.phone,
      currentSalary: data.currentSalary,
      expectedSalary: data.expectedSalary,
      location: data.currentLocation,
      appliedFrom,
      resumeUrl: data.resume,
      createdBy: createdby,
      metadata: {
        currentLocation: data.currentLocation,
        preferredLocations: data.preferredLocations,
        totalExperience: data.totalExperience,
        totalExperienceMonths: data.totalExperienceMonths,
        relevantExperience: data.relevantExperience,
        relevantExperienceMonths: data.relevantExperienceMonths,
        currentSalary: data.currentSalary,
        expectedSalary: data.expectedSalary,
        resume_url: data.resume,
        noticePeriod: data.noticePeriod,
        lastWorkingDay: data.lastWorkingDay,
        linkedInId: data.linkedInId || undefined,
        hasOffers: data.hasOffers || undefined,
        offerDetails: data.offerDetails || undefined,
        uan: data.uan || undefined,
        pan: data.pan || undefined,
        pf: data.pf || undefined,
        esicNumber: data.esicNumber || undefined,
      }
    };

    // ✅ Prevent duplicate if not in edit mode
    if (!candidateId) {
      const isDuplicate = await checkDuplicateCandidate(job.id, data.email, data.phone);
      if (isDuplicate) {
        toast.error("Candidate with same email or phone already exists for this job.");
        return;
      }

      const newCandidate = await createCandidate(job.id, candidateData);
      setCandidateId(newCandidate.id);
      toast.success("Basic information saved successfully");
    } else {
      // Edit mode - safe to update
      await updateCandidate(candidateId, candidateData);
      toast.success("Basic information updated successfully");
    }

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

    // Update only the skill_ratings field
    await updateCandidateSkillRatings(candidateId, data.skills);
    
    toast.success("Skills updated successfully");
    setActiveTab("proof-id");
  } catch (error) {
    console.error("Error saving candidate skills:", error);
    toast.error("Failed to save skills information");
  }
};

const handleSaveProofId = async (data: CandidateFormData) => {
  try {
    setIsSaving(true); // Set loading state
    if (!candidateId || !job.id) {
      toast.error("Candidate ID or Job ID is missing");
      return;
    }

    const candidateData = {
      metadata: {
        uan: data.uan || undefined,
        pan: data.pan || undefined,
        pf: data.pf || undefined,
        esicNumber: data.esicNumber || undefined,
      },
    };

    await updateCandidate(candidateId, candidateData);
    toast.success("Proof ID information saved successfully");
    handleClose(); // Close drawer after final step
    onCandidateAdded(); // Trigger refresh in parent
  } catch (error) {
    console.error("Error saving proof ID information:", error);
    toast.error("Failed to save proof ID information");
  } finally {
    setIsSaving(false); // Reset loading state
  }
};

// Function to fetch candidate by ID
const fetchCandidateById = async (id: string) => {
  const { data, error } = await supabase
    .from('hr_job_candidates')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching candidate:", error);
    return null;
  }

  return data;
};
  
  // Calculate a simple match score based on skill ratings (0-100)
  const calculateMatchScore = (skills: Array<{name: string, rating: number}>) => {
    if (skills.length === 0) return 0;
    
    const totalPossibleScore = skills.length * 5; // 5 is max rating
    const actualScore = skills.reduce((sum, skill) => sum + skill.rating, 0);
    
    return Math.round((actualScore / totalPossibleScore) * 100);
  };
  
  return (
    <Sheet open={controlledOpen} 
    onOpenChange={controlledOnOpenChange} >
      <SheetTrigger asChild>
        <Button 
          id={isEditMode ? "edit-candidate-btn" : "add-candidate-btn"} 
          onClick={() => controlledOnOpenChange(true)}
        >
          {isEditMode ? "Edit Candidate" : "Add Candidate"}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg md:max-w-xl  overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Add New Candidate</SheetTitle>
        </SheetHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic-info">Basic Information</TabsTrigger>
            <TabsTrigger 
              value="skills-info" 
              disabled={!candidateId}
            >
              Skill Information
            </TabsTrigger>
            <TabsTrigger value="proof-id" disabled={!candidateId}>
              Proof ID
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic-info">
            <BasicInformationTab 
              form={basicInfoForm} 
              onSaveAndNext={(data) => handleSaveBasicInfo(data)}
              onCancel={handleClose}
            />
          </TabsContent>
          
          <TabsContent value="skills-info">
            <SkillInformationTab 
              form={skillsForm}
              jobSkills={job.skills || []}
              onSave={(data) => handleSaveSkills(data)}
              onCancel={handleClose}
            />
          </TabsContent>
          <TabsContent value="proof-id">
            <ProofIdTab
              form={proofIdForm}
              onSave={(data) => handleSaveProofId(data)}
              onCancel={handleClose}
              isSaving={isSaving} // Pass loading state
            />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default AddCandidateDrawer;

// Resume parse details