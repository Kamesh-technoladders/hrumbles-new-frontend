
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClientDetailsData } from "./types";

interface ClientInformationFieldsProps {
  data: ClientDetailsData;
  onChange: (data: Partial<ClientDetailsData>) => void;
}

const ClientInformationFields = ({ data, onChange }: ClientInformationFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="clientName">Client Name <span className="text-red-500">*</span></Label>
        <Input
          id="clientName"
          placeholder="Enter client name"
          value={data.clientName}
          onChange={(e) => onChange({ clientName: e.target.value })}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="endClient">End Client</Label>
        <Input
          id="endClient"
          placeholder="Enter end client (if different)"
          value={data.endClient}
          onChange={(e) => onChange({ endClient: e.target.value })}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="pointOfContact">Point of Contact</Label>
        <Input
          id="pointOfContact"
          placeholder="Enter point of contact"
          value={data.pointOfContact}
          onChange={(e) => onChange({ pointOfContact: e.target.value })}
        />
      </div>
    </>
  );
};

export default ClientInformationFields;
