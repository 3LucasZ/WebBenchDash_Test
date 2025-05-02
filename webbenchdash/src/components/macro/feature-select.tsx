import {
  Bold,
  GaugeIcon,
  Italic,
  LockIcon,
  ShieldIcon,
  Underline,
} from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function FeatureSelect() {
  return (
    <ToggleGroup type="single" variant="outline">
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <ShieldIcon className="h-8 w-8" />
        <p className="w-50 text-xl">Reliability</p>
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <GaugeIcon className="h-8 w-8" />
        <p className="w-50 text-xl">Performance</p>
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <LockIcon className="h-8 w-8" />
        <p className="w-50 text-xl">Security</p>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
