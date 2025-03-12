import React, { useState, useEffect } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { SectorType, Employee, Goal, GoalType } from "@/types/goal";
import { getEmployees, getGoals, assignGoalToEmployees } from "@/lib/supabaseData";

const AssignGoalsForm = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [sector, setSector] = useState<SectorType>();
  const [goalType, setGoalType] = useState<GoalType>('Monthly');
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [filteredGoals, setFilteredGoals] = useState<Goal[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [targetValue, setTargetValue] = useState<number | undefined>();
  const [employeeCommandOpen, setEmployeeCommandOpen] = useState(false);
  const [goalCommandOpen, setGoalCommandOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
  
      try {
        const [employeeData, goalsData] = await Promise.all([
          getEmployees(),
          getGoals(),
        ]);
  
        console.log("Employees loaded:", employeeData);
        console.log("Goals loaded:", goalsData?.length || 0);
  
        setEmployees(Array.isArray(employeeData) ? employeeData : []);
        setGoals(Array.isArray(goalsData) ? goalsData : []);
      } catch (err) {
        setError("Failed to load data.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  useEffect(() => {
    if (!sector) {
      setFilteredGoals([]);
      return;
    }

    if (!Array.isArray(goals) || goals.length === 0) {
      console.log("No goals available to filter");
      setFilteredGoals([]);
      return;
    }

    console.log("Filtering goals for sector:", sector);
    console.log("Available goals before filtering:", goals);
    console.log("SelectedGoal::", selectedGoal)

    const filtered = goals.filter(goal => goal.sector?.toLowerCase() === sector.toLowerCase());

    console.log("Filtered goals:", filtered);
    setFilteredGoals(filtered || []); // Ensure it's always an array
  }, [sector, goals, selectedGoal]);


  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployees((current) => {
      if (current.some(e => e.id === employee.id)) {
        return current.filter(e => e.id !== employee.id);
      }
      return [...current, employee];
    });
  };

  const handleSelectGoal = (goal: Goal) => {
    console.log("Selected goal:", goal);
    setSelectedGoal(goal);
    setGoalCommandOpen(false);
  };

  const getMetricUnitLabel = () => {
    if (!selectedGoal) return "Target Value";

    switch (selectedGoal.metricType) {
      case "percentage":
        return "Percentage (%)";
      case "currency":
        return "Amount ($)";
      case "count":
        return "Count (#)";
      case "hours":
        return "Hours (hrs)";
      case "custom":
        return `Value (${selectedGoal.metricUnit})`;
      default:
        return "Target Value";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedGoal || !startDate || !endDate || !sector || targetValue === undefined) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (selectedEmployees.length === 0) {
      toast.error("Please select at least one employee");
      return;
    }
    
    setLoading(true);
    
    try {
      const employeeIds = selectedEmployees.map(emp => emp.id);
      await assignGoalToEmployees(selectedGoal.id, employeeIds, goalType, targetValue);
      
      toast.success("Goal assigned successfully!");
      
      // Reset form
      setSelectedGoal(null);
      setSelectedEmployees([]);
      setTargetValue(undefined);
      setStartDate(undefined);
      setEndDate(undefined);
      setSector(undefined);
      setGoalType('Monthly');
      
    } catch (error) {
      console.error("Error assigning goal:", error);
      toast.error("Failed to assign goal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Assign Goals</DialogTitle>
        <DialogDescription>
          Assign existing goals to employees with specific targets and timelines.
        </DialogDescription>
      </DialogHeader>
      
      {isLoading ? (
        <div className="py-8 text-center">Loading data...</div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">{error}</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="sector" className="text-sm font-medium">
                Sector
              </Label>
              <Select 
                onValueChange={(value) => setSector(value as SectorType)}
                value={sector}
              >
                <SelectTrigger id="sector" className="mt-1.5">
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="goal" className="text-sm font-medium">
                Goal
              </Label>
              <Popover open={goalCommandOpen} onOpenChange={setGoalCommandOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={goalCommandOpen}
                    className="w-full mt-1.5 justify-between"
                    type="button"
                    disabled={!sector}
                  >
                    {selectedGoal ? selectedGoal.name : "Select a goal..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search goals..." />
                    <CommandEmpty>
                      {sector 
                        ? "No goals found for this sector." 
                        : "Please select a sector first."}
                    </CommandEmpty>
                    <CommandList>
                      <ScrollArea className="h-64">
                        {filteredGoals.length > 0 ? (
                          filteredGoals.map(goal => (
                            <CommandItem 
                              key={goal.id} 
                              value={goal.name} 
                              onSelect={() => handleSelectGoal(goal)}
                            >
                              <Check className={cn(
                                "mr-2 h-4 w-4", 
                                selectedGoal?.id === goal.id ? "opacity-100" : "opacity-0"
                              )} />
                              {goal.name}
                            </CommandItem>
                          ))
                        ) : (
                          <div className="py-6 text-center text-sm text-gray-500">
                            {sector ? "No goals available for this sector" : "Select a sector to view goals"}
                          </div>
                        )}
                      </ScrollArea>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {filteredGoals.length === 0 && sector && (
                <p className="mt-2 text-sm text-amber-600">
                  No goals found for {sector}. Please create goals for this sector first.
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="goalType" className="text-sm font-medium">
                Goal Type
              </Label>
              <Select 
                onValueChange={(value) => setGoalType(value as GoalType)}
                value={goalType}
              >
                <SelectTrigger id="goalType" className="mt-1.5">
                  <SelectValue placeholder="Select goal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-gray-500">
                Determines how progress is tracked and reported
              </p>
            </div>
            
            <div>
              <Label htmlFor="employees" className="text-sm font-medium">
                Assign to Employees
              </Label>
              <Popover open={employeeCommandOpen} onOpenChange={setEmployeeCommandOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={employeeCommandOpen}
                    className="w-full mt-1.5 justify-between"
                    type="button"
                  >
                    {selectedEmployees.length === 0 
                      ? "Select employees..." 
                      : `${selectedEmployees.length} employee${selectedEmployees.length > 1 ? 's' : ''} selected`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search employee..." />
                    <CommandEmpty>No employee found.</CommandEmpty>
                    <CommandList>
                      <ScrollArea className="h-64">
                        {employees.length > 0 ? (
                          employees.map((employee) => (
                            <CommandItem
                              key={employee.id}
                              value={employee.name}
                              onSelect={() => {
                                handleSelectEmployee(employee);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedEmployees.some(e => e.id === employee.id) 
                                    ? "opacity-100" 
                                    : "opacity-0"
                                )}
                              />
                              {employee.name} ({employee.department})
                            </CommandItem>
                          ))
                        ) : (
                          <div className="py-6 text-center text-sm text-gray-500">
                            No employees available
                          </div>
                        )}
                      </ScrollArea>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              
              {selectedEmployees.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedEmployees.map((employee) => (
                    <Badge key={employee.id} variant="secondary" className="p-1 px-2">
                      {employee.name}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => handleSelectEmployee(employee)}
                        type="button"
                      >
                        ×
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate" className="text-sm font-medium">
                  Start Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full mt-1.5 justify-start text-left font-normal"
                      id="startDate"
                      type="button"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? (
                        format(startDate, "PPP")
                      ) : (
                        <span>Select date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label htmlFor="endDate" className="text-sm font-medium">
                  End Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full mt-1.5 justify-start text-left font-normal"
                      id="endDate"
                      type="button"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) =>
                        date < new Date() || (startDate ? date < startDate : false)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {selectedGoal && (
              <div>
                <Label htmlFor="targetValue" className="text-sm font-medium">
                  {getMetricUnitLabel()}
                </Label>
                <Input
                  id="targetValue"
                  type="number"
                  placeholder={`Enter target ${getMetricUnitLabel().toLowerCase()}`}
                  className="mt-1.5"
                  value={targetValue === undefined ? "" : targetValue}
                  onChange={(e) => setTargetValue(e.target.value ? Number(e.target.value) : undefined)}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  This target value will be used to calculate progress for this assigned goal
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Assigning..." : "Assign Goal"}
            </Button>
          </DialogFooter>
        </form>
      )}
    </DialogContent>
  );
};

export default AssignGoalsForm;
