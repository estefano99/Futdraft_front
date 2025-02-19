import { Select, Option } from "@material-tailwind/react";
import { formatearEstado } from "../../../libs/funciones";

const estados = ["pendiente", "en_progreso", "completado", "cancelado"];

export function SelectEstado({ value, onChange }) {
  const handleChange = (val) => {
    onChange(val);
  };
  return (
    <div className="w-full">
      <Select
        label="Elegir estado"
        value={String(value)}
        onChange={handleChange}
      >
        {estados.map((estado, index) => (
          <Option key={index} value={String(estado)}>
            {formatearEstado(estado)}
          </Option>
        ))}
      </Select>
    </div>
  );
}
