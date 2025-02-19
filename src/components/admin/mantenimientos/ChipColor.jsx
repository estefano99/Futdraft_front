import { Chip } from "@material-tailwind/react";

export function ChipColor({ color, value }) {
  return (
    <div className="flex gap-2">
      <Chip color={color} value={value} />
    </div>
  );
}
