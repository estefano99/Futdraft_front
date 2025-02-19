import { useTipoMantenimiento } from "../../../context/TipoMantProvider";
import { useEffect, useState } from "react";

export function SelectTipoMant({ value: initialValue, onChange, onBlur }) {
  const { listadoTipoMantenimientos, tiposMantenimiento } =
    useTipoMantenimiento();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    listadoTipoMantenimientos();
  }, []);

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setValue(selectedValue);
    onChange(selectedValue);
  };

  // Sincroniza el estado local con la prop value
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className="w-full">
      {" "}
      <select
        id="tipo_mantenimiento"
        value={value}
        onChange={handleChange}
        className="border border-gray-300 rounded px-3 py-2 w-full"
        onBlur={onBlur}
      >
        <option value="">Selecciona un tipo de mantenimiento</option>{" "}
        {/* Opción por defecto */}
        {tiposMantenimiento.map((tipoMantenimiento) => (
          <option
            key={tipoMantenimiento.id}
            value={String(tipoMantenimiento.id)}
          >
            {tipoMantenimiento.descripcion}
          </option>
        ))}
      </select>
    </div>
  );
}
