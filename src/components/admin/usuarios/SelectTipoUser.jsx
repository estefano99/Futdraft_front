import { Select, Option } from "@material-tailwind/react";

const tipoUser = ["cliente", "admin", "empleado"];

export function SelectTipoUser({ value, onChange }) {
  const handleChange = (val) => {
    onChange(val);
  };
  return (
    <div className="w-full">
      <Select
        label="Elegir tipo usuario"
        value={String(value)}
        onChange={handleChange}
      >
        {tipoUser.map((tipo, index) => (
          <Option key={index} value={String(tipo)}>
            {tipo}
          </Option>
        ))}
      </Select>
    </div>
  );
}
