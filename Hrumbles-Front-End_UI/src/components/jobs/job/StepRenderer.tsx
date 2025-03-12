
import { ReactNode } from "react";
import JobInformationStep from "./steps/JobInformationStep";
import ExperienceSkillsStep from "./steps/ExperienceSkillsStep";
import ClientDetailsStep from "./steps/ClientDetailsStep";
import JobDescriptionStep from "./steps/JobDescriptionStep";
import { JobFormData } from "./hooks/useJobFormState";

type JobType = "Staffing" | "Augment Staffing" | null;
type StaffingType = "Internal" | "Talent Deployment" | null;

interface StepRendererProps {
  currentStep: number;
  formData: JobFormData;
  updateFormData: (step: string, data: any) => void;
  jobType: JobType;
  staffingType: StaffingType;
}

const StepRenderer = ({ 
  currentStep, 
  formData, 
  updateFormData,
  jobType,
  staffingType
}: StepRendererProps): ReactNode => {
  switch(currentStep) {
    case 1:
      return (
        <JobInformationStep 
          data={formData.jobInformation}
          onChange={(data) => updateFormData("jobInformation", data)}
          jobType={jobType}
          staffingType={staffingType}
        />
      );
    case 2:
      return (
        <ExperienceSkillsStep 
          data={formData.experienceSkills}
          onChange={(data) => updateFormData("experienceSkills", data)}
        />
      );
    case 3:
      if (staffingType === "Internal") {
        return (
          <JobDescriptionStep 
            data={formData.jobDescription}
            onChange={(data) => updateFormData("jobDescription", data)}
          />
        );
      }
      return (
        <ClientDetailsStep 
          data={formData.clientDetails}
          onChange={(data) => updateFormData("clientDetails", data)}
          hiringMode={formData.jobInformation.hiringMode}
        />
      );
    case 4:
      return (
        <JobDescriptionStep 
          data={formData.jobDescription}
          onChange={(data) => updateFormData("jobDescription", data)}
        />
      );
    default:
      return null;
  }
};

export default StepRenderer;
