import { Bold, Italic, Underline } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function FeatureSelect() {
  return (
    <ToggleGroup type="single" variant="outline">
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        {/* <Bold className="h-4 w-4" /> */}
        <p className="w-50 text-xl">Reliability</p>
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        {/* <Italic className="h-4 w-4" /> */}
        <p className="w-50 text-xl">Performance</p>
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        {/* <Underline className="h-4 w-4" /> */}
        <p className="w-50 text-xl">Security</p>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
