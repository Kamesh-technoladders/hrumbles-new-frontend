
import { JobData } from "@/lib/types";
import { JobFormData } from "../hooks/useJobFormState";

type StaffingType = "Internal" | "Talent Deployment" | null;

export const mapFormDataToJobData = (
  formData: JobFormData, 
  editJob: JobData | null,
  staffingType: StaffingType
): JobData => {
  const jobData: JobData = {
    id: editJob?.id || crypto.randomUUID(),
    jobId: formData.jobInformation.jobId,
    title: formData.jobInformation.jobTitle,
    department: "Engineering", // Default value, could be made editable
    location: formData.jobInformation.jobLocation,
    type: "Full-time", // Default value, could be made editable
    status: "Active",
    postedDate: editJob?.postedDate || new Date().toISOString().split('T')[0],
    applications: editJob?.applications || 0,
    dueDate: editJob?.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    clientOwner: formData.clientDetails.clientName || "Internal HR",
    hiringMode: formData.jobInformation.hiringMode,
    submissionType: staffingType === "Internal" ? "Internal" : "Client",
    experience: {
      min: { 
        years: formData.experienceSkills.minimumYear, 
        months: formData.experienceSkills.minimumMonth 
      },
      max: { 
        years: formData.experienceSkills.maximumYear, 
        months: formData.experienceSkills.maximumMonth 
      }
    },
    skills: formData.experienceSkills.skills,
    description: formData.jobDescription.description,
    clientDetails: {
      clientName: formData.clientDetails.clientName,
      clientBudget: formData.clientDetails.clientBudget,
      endClient: formData.clientDetails.endClient,
      pointOfContact: formData.clientDetails.pointOfContact
    },
    noticePeriod: formData.jobInformation.noticePeriod,
    budgetType: formData.jobInformation.budgetType,
  };

  // Add assignedTo if present
  if (formData.clientDetails.assignedTo) {
    jobData.assignedTo = {
      type: "individual",
      name: formData.clientDetails.assignedTo
    };
  }

  return jobData;
};
