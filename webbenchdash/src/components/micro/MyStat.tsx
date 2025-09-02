import { Card, CardContent } from "../ui/card";
import { featureData, label_display, unit_convert } from "../widget/data";

export function MyStat({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center">
        <div className="">{label_display(label)}</div>
        <div className="text-2xl font-bold ">
          {unit_convert(featureData[label].convert, value)}
        </div>
      </CardContent>
    </Card>
  );
}
