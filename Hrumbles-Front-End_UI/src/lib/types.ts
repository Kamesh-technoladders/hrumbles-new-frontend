import { ReactNode } from "react";

export interface JobData {
  id: string;  // Changed from number to string since we're using UUIDs
  jobId: string;
  title: string;
  department: string;
  location: string[];
  type: string;
  status: "Active" | "Pending" | "Completed";
  postedDate: string;
  applications: number;
  dueDate: string;
  clientOwner: string;
  hiringMode: string;
  submissionType: "Internal" | "Client";
  experience?: {
    min?: { years: number; months: number };
    max?: { years: number; months: number };
  };
  skills?: string[];
  description?: string;
  descriptionBullets?: string[];
  clientDetails?: {
    clientName?: string;
    clientBudget?: string;
    endClient?: string;
    pointOfContact?: string;
  };
  jobCategory?: string;
  primarySkills?: string[];
  secondarySkills?: string[];
  staffingManager?: string;
  interviewProcess?: string[];
  payRate?: string;
  billRate?: string;
  startDate?: string;
  assignedTo?: {
    type: "individual" | "team" | "vendor";
    name: string;
  };
  budgets?: {
    clientBudget?: string;
    hrBudget?: string;
    vendorBudget?: string;
  };
  customUrl?: string;
  noticePeriod?: string;
  budgetType?: string;
}

export interface Candidate {
  resume: any;
  hasValidatedResume: boolean;
  currentStage: string;
  profit: ReactNode;
  appliedFrom: ReactNode;
  id: number;
  name: string;
  status: "Screening" | "Interviewing" | "Selected" | "Rejected";
  experience: string;
  matchScore: number;
  appliedDate: string;
  skills: string[];
}
