import {
  Bold,
  GaugeIcon,
  Italic,
  LockIcon,
  ShieldIcon,
  Underline,
} from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function FeatureSelect({
  value1,
  onValue1Change,
  value2,
  onValue2Change,
}: {
  value1: string;
  onValue1Change: (val: string) => void;
  value2: string;
  onValue2Change: (val: string) => void;
}) {
  return (
    <div className="flex flex-col items-center">
      <div>
        <ToggleGroup
          type="single"
          variant="outline"
          value={value1}
          onValueChange={(newValue: string | null) => {
            if (newValue === null || newValue === "") return;
            onValue1Change(newValue);
          }}
        >
          <ToggleGroupItem value="reliability">
            <ShieldIcon className="h-8 w-8" />
            <p className="w-50 text-xl">Reliability</p>
          </ToggleGroupItem>
          <ToggleGroupItem value="performance">
            <GaugeIcon className="h-8 w-8" />
            <p className="w-50 text-xl">Performance</p>
          </ToggleGroupItem>
          <ToggleGroupItem value="security">
            <LockIcon className="h-8 w-8" />
            <p className="w-50 text-xl">Security</p>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="h-4"></div>
      <div>
        <ToggleGroup
          type="single"
          variant="outline"
          value={value2}
          onValueChange={(newValue: string | null) => {
            if (newValue === null || newValue === "") return;
            onValue2Change(newValue);
          }}
        >
          <ToggleGroupItem value="gov">
            {/* <ShieldIcon className="h-8 w-8" /> */}
            <p className="w-50 text-xl ">Government</p>
          </ToggleGroupItem>
          <ToggleGroupItem value="top">
            {/* <GaugeIcon className="h-8 w-8" /> */}
            <p className="w-50 text-xl">Top sites</p>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
