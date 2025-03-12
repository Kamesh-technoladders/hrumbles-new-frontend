
import { useState } from "react";
import { Button } from "@/components/jobs/ui/button";
import { toast } from "sonner";
import StepperNavigation from "./StepperNavigation";
import { JobData } from "@/lib/types";
import { useJobFormState } from "./hooks/useJobFormState";
import { getTotalSteps, validateStep } from "./utils/jobFormValidation";
import { mapFormDataToJobData } from "./utils/mapFormDataToJobData";
import StepRenderer from "./StepRenderer";
import { Loader2 } from "lucide-react";

type JobType = "Staffing" | "Augment Staffing" | null;
type StaffingType = "Internal" | "Talent Deployment" | null;

interface JobStepperFormProps {
  jobType: JobType;
  staffingType: StaffingType;
  onClose: () => void;
  editJob?: JobData | null;
  onSave?: (job: JobData) => void;
}

export const JobStepperForm = ({ 
  jobType, 
  staffingType, 
  onClose, 
  editJob = null, 
  onSave 
}: JobStepperFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { formData, updateFormData } = useJobFormState({ jobType, staffingType, editJob });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const totalSteps = getTotalSteps(jobType, staffingType);
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Prepare job data from form data
      const jobData = mapFormDataToJobData(formData, editJob, staffingType);
      
      console.log("Job data submitted:", jobData);
      
      // If onSave callback is provided, use it to save/update the job
      if (onSave) {
        await onSave(jobData);
      }
      
      // Close the form
      onClose();
    } catch (error) {
      console.error("Error submitting job:", error);
      toast.error(editJob ? "Failed to update job" : "Failed to create job");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="py-2">
      <StepperNavigation 
        currentStep={currentStep} 
        totalSteps={totalSteps}
        jobType={jobType}
        staffingType={staffingType}
      />
      
      <div className="mt-6">
        <StepRenderer 
          currentStep={currentStep}
          formData={formData}
          updateFormData={updateFormData}
          jobType={jobType}
          staffingType={staffingType}
        />
      </div>
      
      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          onClick={onClose}
          disabled={isSubmitting}
        >
          Discard
        </Button>
        <div className="flex gap-2">
          {currentStep > 1 && (
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={isSubmitting}
            >
              Previous
            </Button>
          )}
          {currentStep < totalSteps ? (
            <Button 
              onClick={handleNext}
              disabled={!validateStep(currentStep, formData) || isSubmitting}
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={!validateStep(currentStep, formData) || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editJob ? "Updating..." : "Saving..."}
                </>
              ) : (
                editJob ? "Update Job" : "Save & Submit"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
