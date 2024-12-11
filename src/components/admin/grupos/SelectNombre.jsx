import { Select, Option } from "@material-tailwind/react";

const nombres = [ "cliente", "empleado", "admin","superAdmin"];
 
export function SelectNombre({ value, onChange }) {
  const handleChange = (val) => {
    onChange(val);
  };
  return (
    <div className="w-full">
      <Select label="Elegir nombre" value={value} onChange={handleChange}>
      {nombres.map((nombre, index) => (
          <Option key={index} value={String(nombre)}>
            {nombre}
          </Option>
        ))}
      </Select>
    </div>
  );
}