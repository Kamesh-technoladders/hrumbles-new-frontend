import React from "react";
import { Calendar, Users, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProgressTracker from "@/components/goals/goals/ProgressTracker";
import AnimatedCard from "@/components/ui/custom/AnimatedCard";
import { GoalWithDetails } from "@/types/goal";
import { format } from "date-fns";

// Adding this AvatarGroup component since it's not included in shadcn by default
const AvatarGroup = ({ children, limit = 3, className = "" }: { 
  children: React.ReactNode; 
  limit?: number; 
  className?: string;
}) => {
  const childrenArray = React.Children.toArray(children);
  const limitedChildren = childrenArray.slice(0, limit);
  const excess = childrenArray.length - limit;

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {limitedChildren}
      {excess > 0 && (
        <Avatar className="ring-2 ring-background">
          <AvatarFallback className="bg-muted text-muted-foreground text-xs">
            +{excess}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

interface GoalCardProps {
  goal: GoalWithDetails;
  delay?: number;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, delay = 0 }) => {
  console.log('goalsss', goal)
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  const getSectorColor = (sector: string) => {
    switch (sector.toLowerCase()) {
      case "hr":
        return "bg-sector-hr text-white";
      case "sales":
        return "bg-sector-sales text-white";
      case "finance":
        return "bg-sector-finance text-white";
      case "operations":
        return "bg-sector-operations text-white";
      case "marketing":
        return "bg-sector-marketing text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AnimatedCard
      animation="fade"
      delay={delay}
      className="bg-white border border-gray-100"
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <Badge variant="outline" className={getSectorColor(goal.sector)}>
            {goal.sector}
          </Badge>
          {goal.assignmentDetails && (
            <Badge
              variant="outline"
              className={getStatusColor(goal.assignmentDetails.status)}
            >
              {goal.assignmentDetails.status
                .replace("-", " ")
                .replace(/^\w/, (c) => c.toUpperCase())}
            </Badge>
          )}
        </div>

        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{goal.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {goal.description}
        </p>

        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar className="h-4 w-4 mr-2" />
          <span>
            {formatDate(goal.startDate)} - {formatDate(goal.endDate)}
          </span>
        </div>

        <div className="mt-auto">
          {goal.assignmentDetails && (
            <div className="mb-3">
              <ProgressTracker
                progress={goal.assignmentDetails.progress}
                size="md"
              />
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>
                  Current: {goal.assignmentDetails.currentValue}
                  {goal.metricUnit}
                </span>
                <span>
                  Target: {goal.assignmentDetails.targetValue}
                  {goal.metricUnit}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-sm text-gray-600">
                {goal.kpis ? goal.kpis.length : 0} KPIs
              </span>
            </div>

            {goal.assignedTo && goal.assignedTo.length > 0 && (
              <AvatarGroup className="justify-end" limit={3}>
                {goal.assignedTo.map((employee) => (
                  <Avatar
                    key={employee.id}
                    className="h-8 w-8 border-2 border-white"
                  >
                    <AvatarImage src={employee.avatar} alt={employee.name} />
                    <AvatarFallback>
                      {employee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </AvatarGroup>
            )}
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default GoalCard;
