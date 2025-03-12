
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientDetailsData } from "./types";

interface BudgetFieldProps {
  data: ClientDetailsData;
  onChange: (data: Partial<ClientDetailsData>) => void;
  hiringMode: string;
}

const BudgetField = ({ data, onChange, hiringMode }: BudgetFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="clientBudget">Client Budget <span className="text-red-500">*</span></Label>
      <div className="flex">
        <Input
          id="clientBudget"
          placeholder="Enter client budget"
          value={data.clientBudget}
          onChange={(e) => onChange({ clientBudget: e.target.value })}
          className="rounded-r-none"
        />
        {hiringMode === "Full Time" || hiringMode === "Permanent" ? (
          <span className="inline-flex items-center px-3 border border-l-0 border-gray-300 bg-gray-100 text-gray-600 rounded-r-md">
            LPA
          </span>
        ) : (
          <Select
            value={data.clientBudget.includes("LPA") ? "LPA" : 
                  data.clientBudget.includes("Monthly") ? "Monthly" : 
                  data.clientBudget.includes("Hourly") ? "Hourly" : ""}
            onValueChange={(value) => {
              const numericPart = data.clientBudget.split(' ')[0] || '';
              onChange({ clientBudget: `${numericPart} ${value}` });
            }}
          >
            <SelectTrigger className="w-24 rounded-l-none border-l-0">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {(hiringMode === "Both" || hiringMode === "Both (Contract & Full-Time)") && (
                <SelectItem value="LPA">LPA</SelectItem>
              )}
              <SelectItem value="Monthly">Monthly</SelectItem>
              <SelectItem value="Hourly">Hourly</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};

export default BudgetField;
