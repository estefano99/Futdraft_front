import { Select, Option } from "@material-tailwind/react";

const estados = [0,1];
 
export function SelectEstado({ value, onChange }) {
  const handleChange = (val) => {
    onChange(val);
  };
  return (
    <div className="w-full">
      <Select label="Elegir estado" value={String(value)} onChange={handleChange}>
      {estados.map((estado, index) => (
          <Option key={index} value={String(estado)}>
            {estado}
          </Option>
        ))}
      </Select>
    </div>
  );
}