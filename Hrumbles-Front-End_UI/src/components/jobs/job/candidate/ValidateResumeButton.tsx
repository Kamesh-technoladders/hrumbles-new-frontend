
import React from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ValidateResumeButtonProps {
  isValidated: boolean;
  candidateId: number;
  onValidate: (candidateId: number) => void;
}

const ValidateResumeButton = ({ 
  isValidated, 
  candidateId, 
  onValidate 
}: ValidateResumeButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "p-0 h-auto",
        isValidated ? "text-green-600" : "text-gray-400"
      )}
      onClick={() => onValidate(candidateId)}
    >
      {isValidated ? (
        <CheckCircle2 className="h-5 w-5" />
      ) : (
        <Circle className="h-5 w-5" />
      )}
    </Button>
  );
};

export default ValidateResumeButton;
