import { Select, Option } from "@material-tailwind/react";
import { useAuth } from "../../../context/AuthProvider";
import { useEffect, useState } from "react";
import { useMantenimiento } from "../../../context/MantenimientosProvider";
import { now } from "lodash";

export function SelectMantenimiento({ value: initialValue, onChange, onBlur }) {
  const { listadoMantenimientosSinPaginacion } = useMantenimiento();
  const [mantenimientosFiltrados, setMantenimientosFiltrados] = useState([]);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const obtenerMantenimientos = async () => {
      try {
        const respuesta = await listadoMantenimientosSinPaginacion();
        console.log(respuesta)
        const mantenimientos = respuesta.filter(
          (mantenimiento) =>
            new Date(mantenimiento.fecha).getTime() >= Date.now()
        );
        setMantenimientosFiltrados(mantenimientos || []);
      } catch (error) {
        console.error("Error al obtener mantenimientos:", error);
      }
    };

    obtenerMantenimientos();
  }, []);

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setValue(selectedValue);
    onChange(selectedValue);
  };

  // Actualiza el estado interno cada vez que cambia la prop value
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className="w-full">
      <select
        id="mantenimiento_id"
        value={value}
        onChange={handleChange}
        className="border border-gray-300 rounded px-3 py-2 w-full"
        onBlur={onBlur}
      >
        <option value="">Selecciona un mantenimiento</option>{" "}
        {mantenimientosFiltrados.map((mantenimiento) => (
          <option key={mantenimiento.id} value={String(mantenimiento.id)}>
            {`${mantenimiento.descripcion} - ${mantenimiento.fecha} - ${mantenimiento.fecha_fin}`}
          </option>
        ))}
      </select>
    </div>
  );
}
