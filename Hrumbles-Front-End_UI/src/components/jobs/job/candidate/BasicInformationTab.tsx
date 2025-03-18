import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form,
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import MultiLocationSelector from "./MultiLocationSelector";
import { CandidateFormData } from "./AddCandidateDrawer";
import { supabase } from "@/integrations/supabase/client";

interface BasicInformationTabProps {
  form: UseFormReturn<CandidateFormData>;
  onSaveAndNext: (data: CandidateFormData) => void;
  onCancel: () => void;
}

// Sample location options - in a real app, this would come from an API
const LOCATION_OPTIONS = [
  "New York", "San Francisco", "Chicago", "Los Angeles", "Boston",
  "Seattle", "Austin", "Denver", "Miami", "Washington DC",
  "Bangalore", "Hyderabad", "Chennai", "Mumbai", "Delhi",
  "London", "Berlin", "Paris", "Tokyo", "Sydney"
];

// Form validation schema
const basicInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  currentLocation: z.string().min(1, "Current location is required"),
  preferredLocations: z.array(z.string()).min(1, "At least one preferred location is required"),
  totalExperience: z.coerce.number().min(0, "Total experience cannot be negative"),
  relevantExperience: z.coerce.number().min(0, "Relevant experience cannot be negative"),
  currentSalary: z.coerce.number().min(0, "Current salary cannot be negative"),
  expectedSalary: z.coerce.number().min(0, "Expected salary cannot be negative"),
  resume: z.string().url("Resume URL is required"),
  skills: z.array(z.object({
    name: z.string(),
    rating: z.number()
  }))
});

const BasicInformationTab = ({ form, onSaveAndNext, onCancel }: BasicInformationTabProps) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
  
    if (!file) return;
    
    const filePath = `resumes/${Date.now()}_${file.name}`;
  
    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
      .from("candidate_resumes")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });
  
    if (error) {
      console.error("Upload Error:", error.message);
      return;
    }
  
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
    .from("candidate_resumes")
    .getPublicUrl(filePath);

  // Store the resume URL in the form instead of the file object
  if (publicUrl) {
    form.setValue("resume", publicUrl); // Ensure this line is executed
  }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSaveAndNext)} className="space-y-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Last Name */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Location */}
          <FormField
            control={form.control}
            name="currentLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Location <span className="text-red-500">*</span></FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select current location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {LOCATION_OPTIONS.map(location => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Preferred Locations */}
          <FormField
            control={form.control}
            name="preferredLocations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Locations <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <MultiLocationSelector 
                    locations={LOCATION_OPTIONS} 
                    selectedLocations={field.value} 
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Total Experience */}
          <FormField
            control={form.control}
            name="totalExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Experience (years) <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Relevant Experience */}
          <FormField
            control={form.control}
            name="relevantExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Relevant Experience (years) <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Salary */}
          <FormField
            control={form.control}
            name="currentSalary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Salary <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Expected Salary */}
          <FormField
            control={form.control}
            name="expectedSalary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expected Salary <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Resume Upload */}
        <FormField
          control={form.control}
          name="resume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  onChange={handleFileChange}
                />
              </FormControl>
              {field.value && (
                <p className="text-sm text-green-600">Uploaded: {field.value}</p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Save & Next
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BasicInformationTab;