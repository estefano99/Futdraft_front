import React from "react";
import { Select, Option } from "@material-tailwind/react";

export function SelectHorarios({ canchas, value, onChange }) {
  const handleChange = (val) => {
    onChange(val);
  };

  return (
    <div className="w-full">
      <Select label="Seleccionar Cancha" value={value} onChange={handleChange}>
        {canchas.map((cancha) => (
          <Option key={cancha.id} value={String(cancha.id)}>
            {cancha.nro_cancha}
          </Option>
        ))}
      </Select>
    </div>
  );
}
