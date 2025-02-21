import React, { useEffect, useState } from "react";
import HeaderAdmin from "../../components/admin/HeaderAdmin";
import GraficoBarra from "../../components/reportes/GraficoBarra";
import DatePickerReportes from "../../components/reportes/DatePickerReportes";
import GraficoBarraEstados from "../../components/reportes/GraficoBarraEstados";
import { useAuth } from "../../context/AuthProvider";
import { accionesDisponibles, tienePermiso } from "../../libs/PermisosBotones";

const Reportes = () => {
  const [puedeVerReporteReservas, setPuedeVerReporteReservas] = useState(false);
  const [puedeVerReporteEstados, setPuedeVerReporteEstados] = useState([]);
  const [dataTurnos, setDataTurnos] = useState([]);
  const [dataMantenimientos, setDataMantenimientos] = useState([]);
  const { accionesUsuarioDisponibles } = useAuth();

  //Asignar permisos para los botones
  useEffect(() => {
    const puedeEditar = tienePermiso(
      accionesUsuarioDisponibles,
      accionesDisponibles.EDITAR_MANTENIMIENTO
    );
    const puedeEliminar = tienePermiso(
      accionesUsuarioDisponibles,
      accionesDisponibles.ELIMINAR_MANTENIMIENTO
    );
    const puedeVerAcciones = tienePermiso(
      accionesUsuarioDisponibles,
      accionesDisponibles.VER_ACCIONES_GRUPO
    );

    // Actualizar los estados
    setPuedeVerReporteReservas(puedeEliminar);
    setPuedeVerReporteEstados(puedeVerAcciones);
  }, [accionesUsuarioDisponibles]);
  return (
    <div>
      <HeaderAdmin titulo="Reportes" />
      <div className="w-4/5 mx-auto mt-10">
        <DatePickerReportes
          setDataTurnos={setDataTurnos}
          setDataMantenimientos={setDataMantenimientos}
        />
        <div className="flex flex-col w-full gap-5">
          {puedeVerReporteReservas ? (
            <GraficoBarra dataTurnos={dataTurnos} />
          ) : (
            <p className="text-white text-center my-5">No tiene permisos para ver reporte de los turnos</p>
          )}
          {puedeVerReporteEstados ? (
            <GraficoBarraEstados dataMantenimientos={dataMantenimientos} />
          ) : (
            <p className="text-white text-center my-5">No tiene permisos para ver reporte de los mantenimientos</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reportes;
