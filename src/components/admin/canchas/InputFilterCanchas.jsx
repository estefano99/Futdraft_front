import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Input } from "@material-tailwind/react";

export function InputFilterCanchas({ value, setValue, isCancha }) {
  
  return (
    <div className="w-72">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        label={isCancha ? "Filtrar por número de cancha" : "Filtrar por precio"}
        icon={<MagnifyingGlassIcon className="h-5 w-5 text-white" />}
        color="white"
      />
    </div>
  );
}
