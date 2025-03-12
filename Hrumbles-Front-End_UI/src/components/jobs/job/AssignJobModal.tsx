
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/jobs/ui/dialog";
import { Button } from "@/components/jobs/ui/button";
import { Label } from "@/components/jobs/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/jobs/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/jobs/ui/select";
import { IndianRupee } from "lucide-react";
import { Input } from "@/components/jobs/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/jobs/ui/tabs";
import { MOCK_EMPLOYEES, MOCK_TEAMS, MOCK_VENDORS } from "@/lib/constants";
import { toast } from "sonner";
import { JobData } from "@/lib/types";

interface AssignJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobData | null;
}

export function AssignJobModal({ isOpen, onClose, job }: AssignJobModalProps) {
  const [selectedTab, setSelectedTab] = useState("internal");
  const [assignmentType, setAssignmentType] = useState("individual");
  const [selectedIndividual, setSelectedIndividual] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [budget, setBudget] = useState("");
  const [budgetType, setBudgetType] = useState("LPA");

  const handleSave = () => {
    // Validate form before saving
    if (selectedTab === "internal") {
      if (assignmentType === "individual" && !selectedIndividual) {
        toast.error("Please select an employee");
        return;
      }
      if (assignmentType === "team" && !selectedTeam) {
        toast.error("Please select a team");
        return;
      }
      
      // Save internal assignment
      toast.success(
        `Job assigned to ${assignmentType === "individual" ? "employee" : "team"} successfully!`
      );
    } else {
      // External assignment
      if (!selectedVendor) {
        toast.error("Please select a vendor");
        return;
      }
      if (!budget) {
        toast.error("Please enter a budget");
        return;
      }
      
      // Save external assignment
      toast.success(`Job assigned to vendor successfully!`);
    }
    
    // Reset form and close modal
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setSelectedTab("internal");
    setAssignmentType("individual");
    setSelectedIndividual("");
    setSelectedTeam("");
    setSelectedVendor("");
    setBudget("");
    setBudgetType("LPA");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Assign Job: {job?.title}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs 
          defaultValue="internal" 
          className="mt-4" 
          value={selectedTab}
          onValueChange={setSelectedTab}
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="internal">Internal Assignment</TabsTrigger>
            <TabsTrigger value="external">External Assignment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="internal" className="space-y-4 pt-4">
            <RadioGroup
              value={assignmentType}
              onValueChange={setAssignmentType}
              className="flex flex-col space-y-4"
            >
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="individual" id="individual" />
                <div className="grid gap-1.5 w-full">
                  <Label htmlFor="individual" className="font-medium">
                    Assign to Individual
                  </Label>
                  <Select
                    value={selectedIndividual}
                    onValueChange={setSelectedIndividual}
                    disabled={assignmentType !== "individual"}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_EMPLOYEES.map((employee) => (
                        <SelectItem key={employee.value} value={employee.value}>
                          {employee.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="team" id="team" />
                <div className="grid gap-1.5 w-full">
                  <Label htmlFor="team" className="font-medium">
                    Assign to Team
                  </Label>
                  <Select
                    value={selectedTeam}
                    onValueChange={setSelectedTeam}
                    disabled={assignmentType !== "team"}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a team" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_TEAMS.map((team) => (
                        <SelectItem key={team.value} value={team.value}>
                          {team.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </RadioGroup>
          </TabsContent>
          
          <TabsContent value="external" className="space-y-4 pt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="vendor">Vendor Selection</Label>
                <Select
                  value={selectedVendor}
                  onValueChange={setSelectedVendor}
                >
                  <SelectTrigger className="w-full" id="vendor">
                    <SelectValue placeholder="Select a vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_VENDORS.map((vendor) => (
                      <SelectItem key={vendor.value} value={vendor.value}>
                        {vendor.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="budget">Budget</Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <IndianRupee className="h-4 w-4 text-gray-500" />
                    </div>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="Enter budget amount"
                      className="pl-9"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    />
                  </div>
                  <Select
                    value={budgetType}
                    onValueChange={setBudgetType}
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LPA">LPA</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Hourly">Hourly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
