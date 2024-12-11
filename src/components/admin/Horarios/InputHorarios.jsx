import { Input } from "@material-tailwind/react";
 
export function InputHorarios({type, value, onChange}) {
  const handleChange = (event) => {
    onChange(event.target.value);
  };
  return (
    <div className="w-full">
      <Input label={type} type="time" value={value} onChange={handleChange} />
    </div>
  );
}