
import { useState, useEffect } from "react";
import { JobData } from "@/lib/types";

type JobType = "Staffing" | "Augment Staffing" | null;
type StaffingType = "Internal" | "Talent Deployment" | null;

interface UseJobFormStateProps {
  jobType: JobType;
  staffingType: StaffingType;
  editJob: JobData | null;
}

export interface JobInformationData {
  hiringMode: string;
  jobId: string;
  jobTitle: string;
  numberOfCandidates: number;
  jobLocation: string[];
  noticePeriod: string;
  budgetType: string;
}

export interface ExperienceSkillsData {
  minimumYear: number;
  minimumMonth: number;
  maximumYear: number;
  maximumMonth: number;
  skills: string[];
}

export interface ClientDetailsData {
  clientName: string;
  clientBudget: string;
  endClient: string;
  pointOfContact: string;
  assignedTo: string;
}

export interface JobDescriptionData {
  description: string;
}

export interface JobFormData {
  jobInformation: JobInformationData;
  experienceSkills: ExperienceSkillsData;
  clientDetails: ClientDetailsData;
  jobDescription: JobDescriptionData;
}

export const useJobFormState = ({ jobType, staffingType, editJob }: UseJobFormStateProps) => {
  const [formData, setFormData] = useState<JobFormData>({
    jobInformation: {
      hiringMode: jobType === "Staffing" && staffingType === "Internal" ? "Full Time" : "",
      jobId: "",
      jobTitle: "",
      numberOfCandidates: 1,
      jobLocation: [],
      noticePeriod: "",
      budgetType: jobType === "Staffing" && staffingType === "Internal" ? "LPA" : "",
    },
    experienceSkills: {
      minimumYear: 0,
      minimumMonth: 0,
      maximumYear: 0,
      maximumMonth: 0,
      skills: [],
    },
    clientDetails: {
      clientName: "",
      clientBudget: "",
      endClient: "",
      pointOfContact: "",
      assignedTo: "",
    },
    jobDescription: {
      description: "",
    },
  });
  
  // Initialize form with edit job data if provided
  useEffect(() => {
    if (editJob) {
      const initialFormData = {
        jobInformation: {
          hiringMode: editJob.hiringMode || (jobType === "Staffing" && staffingType === "Internal" ? "Full Time" : ""),
          jobId: editJob.jobId || "",
          jobTitle: editJob.title || "",
          numberOfCandidates: 1,
          jobLocation: editJob.location || [],
          noticePeriod: editJob.noticePeriod || "",
          budgetType: editJob.budgetType || (jobType === "Staffing" && staffingType === "Internal" ? "LPA" : ""),
        },
        experienceSkills: {
          minimumYear: editJob.experience?.min?.years || 0,
          minimumMonth: editJob.experience?.min?.months || 0,
          maximumYear: editJob.experience?.max?.years || 0,
          maximumMonth: editJob.experience?.max?.months || 0,
          skills: editJob.skills || [],
        },
        clientDetails: {
          clientName: editJob.clientDetails?.clientName || "",
          clientBudget: editJob.clientDetails?.clientBudget || "",
          endClient: editJob.clientDetails?.endClient || "",
          pointOfContact: editJob.clientDetails?.pointOfContact || "",
          assignedTo: editJob.assignedTo?.name || "",
        },
        jobDescription: {
          description: editJob.description || "",
        },
      };
      
      setFormData(initialFormData);
    }
  }, [editJob, jobType, staffingType]);

  const updateFormData = (step: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [step]: {...prev[step as keyof typeof prev], ...data},
    }));
  };

  return {
    formData,
    updateFormData
  };
};
