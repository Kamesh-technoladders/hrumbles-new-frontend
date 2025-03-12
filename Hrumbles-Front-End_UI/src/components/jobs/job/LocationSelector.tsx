
import { useState } from "react";
import { Badge } from "@/components/jobs/ui/badge";
import { Button } from "@/components/jobs/ui/button";
import { X, ChevronDown } from "lucide-react";
import { INDIAN_CITIES } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/jobs/ui/dropdown-menu";

interface LocationSelectorProps {
  selectedLocations: string[];
  onChange: (locations: string[]) => void;
  placeholder?: string;
}

export default function LocationSelector({
  selectedLocations = [],
  onChange,
  placeholder = "Select locations..."
}: LocationSelectorProps) {
  // Ensure selectedLocations is always an array
  const safeSelectedLocations = Array.isArray(selectedLocations) ? selectedLocations : [];
  
  // Handle selecting a location
  const handleSelect = (location: string, checked: boolean) => {
    try {
      if (checked) {
        // Add location if checked and not already in the array
        if (!safeSelectedLocations.includes(location)) {
          onChange([...safeSelectedLocations, location]);
        }
      } else {
        // Remove location if unchecked
        onChange(safeSelectedLocations.filter(loc => loc !== location));
      }
    } catch (error) {
      console.error("Error selecting location:", error);
    }
  };

  // Handle removing a location
  const handleRemoveLocation = (locationLabel: string) => {
    try {
      onChange(safeSelectedLocations.filter(loc => loc !== locationLabel));
    } catch (error) {
      console.error("Error removing location:", error);
    }
  };

  // Clear all selected locations
  const handleClear = () => {
    onChange([]);
  };

  return (
    <div className="w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between h-auto min-h-10 px-3 py-2"
          >
            <div className="flex flex-wrap gap-1 items-center">
              {safeSelectedLocations.length > 0 ? (
                safeSelectedLocations.map(location => (
                  <Badge 
                    key={location} 
                    variant="secondary"
                    className="mr-1 mb-1 py-1"
                  >
                    {location}
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveLocation(location);
                      }}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-[300px] max-h-[300px] overflow-y-auto"
          align="start"
        >
          {INDIAN_CITIES.map((city) => (
            <DropdownMenuCheckboxItem
              key={city.value}
              checked={safeSelectedLocations.includes(city.label)}
              onCheckedChange={(checked) => handleSelect(city.label, checked)}
            >
              {city.label}
            </DropdownMenuCheckboxItem>
          ))}
          {safeSelectedLocations.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-center text-sm mt-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClear();
              }}
            >
              Clear selections
            </Button>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
