import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Input } from "@material-tailwind/react";

export function InputFilterCanchas() {
  return (
    <div className="w-72">
      <Input
        label="Filtrar..."
        icon={<MagnifyingGlassIcon className="h-5 w-5" />}
      />
    </div>
  );
}
