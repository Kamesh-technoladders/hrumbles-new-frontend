
import { JobFormData } from "../hooks/useJobFormState";

type JobType = "Staffing" | "Augment Staffing" | null;
type StaffingType = "Internal" | "Talent Deployment" | null;

export const getTotalSteps = (jobType: JobType, staffingType: StaffingType): number => {
  if (jobType === "Staffing" && staffingType === "Internal") {
    return 3; // Job Info, Experience & Skills, Job Description
  } else {
    return 4; // Job Info, Experience & Skills, Client Details, Job Description
  }
};

export const validateStep = (step: number, formData: JobFormData): boolean => {
  switch(step) {
    case 1: 
      return formData.jobInformation.jobId.trim() !== "" && 
             formData.jobInformation.jobTitle.trim() !== "" &&
             formData.jobInformation.jobLocation.length > 0;
    case 2:
      // Validate Experience & Skills step
      return formData.experienceSkills.skills.length > 0 &&
             (formData.experienceSkills.minimumYear > 0 || formData.experienceSkills.minimumMonth > 0);
    case 3:
      // If we're at step 3 and have 3 total steps, we're at the job description step
      if (formData.jobDescription.description.length >= 100) {
        return true;
      }
      // Otherwise, we're at the client details step
      return formData.clientDetails.clientName.trim() !== "";
    case 4:
      return formData.jobDescription.description.length >= 100;
    default:
      return true;
  }
};
