import { Card, CardContent } from "../ui/card";
import { CountingNumber } from "../ui/shadcn-io/counting-number";
import { featureData, label_display, unit_convert } from "../widget/data";

export function MyStat({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center">
        <div className="">{label_display(label)}</div>
        <div className="text-2xl font-bold ">
          <CountingNumber
            number={Number.parseFloat(
              unit_convert(featureData[label].convert, value)
            )}
            transition={{ stiffness: 200, damping: 20 }}
            className="text-4xl"
          />
          {/* {unit_convert(featureData[label].convert, value)} */}
        </div>
      </CardContent>
    </Card>
  );
}
