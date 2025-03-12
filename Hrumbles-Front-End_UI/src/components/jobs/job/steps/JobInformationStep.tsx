
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LocationSelector from "../LocationSelector";

type JobType = "Staffing" | "Augment Staffing" | null;
type StaffingType = "Internal" | "Talent Deployment" | null;

interface JobInformationData {
  hiringMode: string;
  jobId: string;
  jobTitle: string;
  numberOfCandidates: number;
  jobLocation: string[];
  noticePeriod?: string;
  budgetType?: string;
}

interface JobInformationStepProps {
  data: JobInformationData;
  onChange: (data: Partial<JobInformationData>) => void;
  jobType: JobType;
  staffingType: StaffingType;
}

const JobInformationStep = ({ 
  data, 
  onChange, 
  jobType,
  staffingType 
}: JobInformationStepProps) => {
  // Determine if notice period is needed based on job type and staffing type
  const showNoticePeriod = jobType === "Augment Staffing" || 
    (jobType === "Staffing" && staffingType === "Talent Deployment");
  
  // Ensure jobLocation is always an array even if it comes in as undefined or null
  const safeJobLocation = Array.isArray(data.jobLocation) ? data.jobLocation : [];
  
  // Handle location change with proper error handling
  const handleLocationChange = (locations: string[]) => {
    try {
      onChange({ jobLocation: locations });
    } catch (error) {
      console.error("Error updating job locations:", error);
      // Fallback to empty array to prevent UI from breaking
      onChange({ jobLocation: [] });
    }
  };

  // Get appropriate hiring mode options based on job type and staffing type
  const getHiringModeOptions = () => {
    if (jobType === "Staffing" && staffingType === "Internal") {
      return [
        { value: "Full Time", label: "Full-Time (FTE)" }
      ];
    } else if (jobType === "Staffing" && staffingType === "Talent Deployment") {
      return [
        { value: "Contract", label: "Contract" },
        { value: "Both", label: "Both (Contract & Full-Time)" }
      ];
    } else if (jobType === "Augment Staffing") {
      return [
        { value: "Permanent", label: "Permanent (Direct Hire)" },
        { value: "Contract", label: "Contract (Third-Party Payroll)" },
        { value: "Both", label: "Both (Permanent & Contract)" }
      ];
    }
    return [];
  };

  // Get budget type options based on hiring mode
  const getBudgetTypeOptions = () => {
    if (data.hiringMode === "Full Time" || data.hiringMode === "Permanent") {
      return "LPA"; // Fixed LPA for Full Time and Permanent
    } else if (data.hiringMode === "Contract") {
      return ["Monthly", "Hourly"]; // Dropdown for Contract
    } else if (data.hiringMode === "Both") {
      return ["LPA", "Monthly", "Hourly"]; // Dropdown for Both
    }
    return null;
  };

  // Handle hiring mode change and reset budget type if needed
  const handleHiringModeChange = (value: string) => {
    const updates: Partial<JobInformationData> = { hiringMode: value };
    
    // Reset budget type based on new hiring mode
    if (value === "Full Time" || value === "Permanent") {
      updates.budgetType = "LPA";
    } else if (value === "Contract" && (!data.budgetType || data.budgetType === "LPA")) {
      updates.budgetType = "Monthly";
    } else if (value === "Both" && (!data.budgetType || !["LPA", "Monthly", "Hourly"].includes(data.budgetType))) {
      updates.budgetType = "LPA";
    }
    
    onChange(updates);
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Job Information</h3>
        <p className="text-sm text-gray-500">
          Enter the basic information about the job posting.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="hiringMode">Hiring Mode <span className="text-red-500">*</span></Label>
          <Select 
            value={data.hiringMode} 
            onValueChange={handleHiringModeChange}
          >
            <SelectTrigger id="hiringMode">
              <SelectValue placeholder="Select hiring mode" />
            </SelectTrigger>
            <SelectContent>
              {getHiringModeOptions().map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="jobId">Job ID <span className="text-red-500">*</span></Label>
          <Input
            id="jobId"
            placeholder="Enter job ID"
            value={data.jobId}
            onChange={(e) => onChange({ jobId: e.target.value })}
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="jobTitle">Job Title <span className="text-red-500">*</span></Label>
          <Input
            id="jobTitle"
            placeholder="Enter job title"
            value={data.jobTitle}
            onChange={(e) => onChange({ jobTitle: e.target.value })}
            maxLength={120}
          />
          <p className="text-xs text-gray-500">
            {data.jobTitle.length}/120 characters
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="numberOfCandidates">Number of Candidates <span className="text-red-500">*</span></Label>
          <Input
            id="numberOfCandidates"
            type="number"
            min={1}
            placeholder="Enter number of candidates"
            value={data.numberOfCandidates}
            onChange={(e) => onChange({ numberOfCandidates: parseInt(e.target.value) || 1 })}
          />
        </div>
        
        {showNoticePeriod && (
          <div className="space-y-2">
            <Label htmlFor="noticePeriod">Notice Period <span className="text-red-500">*</span></Label>
            <Select 
              value={data.noticePeriod} 
              onValueChange={(value) => onChange({ noticePeriod: value })}
            >
              <SelectTrigger id="noticePeriod">
                <SelectValue placeholder="Select notice period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Immediate">Immediate</SelectItem>
                <SelectItem value="15 Days">15 Days</SelectItem>
                <SelectItem value="30 Days">30 Days</SelectItem>
                <SelectItem value="45 Days">45 Days</SelectItem>
                <SelectItem value="90 Days">90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        {/* Client Budget Type Field - Only show dropdown if needed */}
        {getBudgetTypeOptions() && Array.isArray(getBudgetTypeOptions()) && (
          <div className="space-y-2">
            <Label htmlFor="budgetType">Budget Type <span className="text-red-500">*</span></Label>
            <Select 
              value={data.budgetType} 
              onValueChange={(value) => onChange({ budgetType: value })}
            >
              <SelectTrigger id="budgetType">
                <SelectValue placeholder="Select budget type" />
              </SelectTrigger>
              <SelectContent>
                {(getBudgetTypeOptions() as string[]).map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="jobLocation">Job Location <span className="text-red-500">*</span></Label>
          <LocationSelector
            selectedLocations={safeJobLocation}
            onChange={handleLocationChange}
            placeholder="Select job locations"
          />
          <p className="text-xs text-gray-500">
            Select one or more locations where this job can be performed
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobInformationStep;
