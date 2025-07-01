import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimeLog } from "@/types/time-tracker-types";
import { TimesheetTable } from "@/components/TimeManagement/timesheet/TimesheetTable";

interface TimesheetContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingTimesheets: TimeLog[];
  clarificationTimesheets: TimeLog[];
  approvedTimesheets: TimeLog[];
  loading: boolean;
  onViewTimesheet: (timesheet: TimeLog) => void;
  onRespondToClarification: (timesheet: TimeLog) => void;
  employeeHasProjects: boolean; // Add employeeHasProjects
}

export const TimesheetContent: React.FC<TimesheetContentProps> = ({
  activeTab,
  setActiveTab,
  pendingTimesheets,
  clarificationTimesheets,
  approvedTimesheets,
  loading,
  onViewTimesheet,
  onRespondToClarification,
  employeeHasProjects, // Destructure employeeHasProjects
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Timesheet Management</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading timesheets...</div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="pending">
                Pending
                {pendingTimesheets.length > 0 && (
                  <span className="ml-2 bg-primary text-white rounded-full w-5 h-5 inline-flex items-center justify-center text-xs">
                    {pendingTimesheets.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="clarification">
                Clarification Needed
                {clarificationTimesheets.length > 0 && (
                  <span className="ml-2 bg-amber-500 text-white rounded-full w-5 h-5 inline-flex items-center justify-center text-xs">
                    {clarificationTimesheets.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              {pendingTimesheets.length === 0 ? (
                <div>No pending timesheets found.</div>
              ) : (
                <TimesheetTable 
                  timesheets={pendingTimesheets}
                  loading={loading}
                  onViewTimesheet={onViewTimesheet}
                  type="pending"
                  employeeHasProjects={employeeHasProjects} // Pass employeeHasProjects
                />
              )}
            </TabsContent>
            
            <TabsContent value="clarification">
              {clarificationTimesheets.length === 0 ? (
                <div>No timesheets requiring clarification found.</div>
              ) : (
                <TimesheetTable 
                  timesheets={clarificationTimesheets}
                  loading={loading}
                  onViewTimesheet={onViewTimesheet}
                  onRespondToClarification={onRespondToClarification}
                  type="clarification"
                  employeeHasProjects={employeeHasProjects} // Pass employeeHasProjects
                />
              )}
            </TabsContent>
            
            <TabsContent value="approved">
              {approvedTimesheets.length === 0 ? (
                <div>No approved timesheets found.</div>
              ) : (
                <TimesheetTable 
                  timesheets={approvedTimesheets}
                  loading={loading}
                  onViewTimesheet={onViewTimesheet}
                  type="approved"
                  employeeHasProjects={employeeHasProjects} // Pass employeeHasProjects
                />
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};