import { Select, Option } from "@material-tailwind/react";
import { useAuth } from "../../../context/AuthProvider";
import { useEffect, useState } from "react";

export function SelectEmpleado({ value: initialValue, onChange, onBlur }) {
  const { listadoUsuariosSinPaginacion } = useAuth();
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const respuesta = await listadoUsuariosSinPaginacion();
        const empleados = respuesta.filter(
          (usuario) => usuario.tipo_usuario === "empleado"
        );
        setUsuariosFiltrados(empleados);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    obtenerUsuarios();
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
        id="empleado"
        value={value}
        onChange={handleChange}
        className="border border-gray-300 rounded px-3 py-2 w-full"
        onBlur={onBlur}
      >
        <option value="">Selecciona un empleado</option>{" "}
        {/* Opción por defecto */}
        {usuariosFiltrados.map((empleado) => (
          <option key={empleado.id} value={String(empleado.id)}>
            {empleado.nombre} {empleado.apellido}
          </option>
        ))}
      </select>
    </div>
  );
}
