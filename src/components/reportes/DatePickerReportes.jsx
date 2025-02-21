import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import clienteAxios from "../../config/axios";
import {
  rutaReportesBack,
  rutaReportesMantenimientoBack,
} from "../../libs/constantes";
import { notifyError } from "../../libs/funciones";

export default function DatePickerReportes({
  setDataTurnos,
  setDataMantenimientos,
}) {
  const [year, setYear] = useState(new Date());
  const handleChange = (date) => {
    setYear(date);
  };

  const consultarData = async () => {
    try {
      const yearFormated = year.getFullYear();
      const respuestaAxios = await clienteAxios.get(
        `${rutaReportesBack}?year=${yearFormated}`
      );
      setDataTurnos(respuestaAxios.data.datos);
    } catch (error) {
      notifyError(
        error.response?.data?.message ||
          "Error al obtener los reportes de turnos"
      );
      console.log(error);
    }
  };

  const consultarDataMantenimientos = async () => {
    try {
      const yearFormated = year.getFullYear();
      const respuestaAxios = await clienteAxios.get(
        `${rutaReportesMantenimientoBack}?year=${yearFormated}`
      );
      console.log(respuestaAxios)
      setDataMantenimientos(respuestaAxios.data.series);
    } catch (error) {
      notifyError(
        error.response?.data?.message ||
          "Error al obtener los reportes de mantenimiento"
      );
      console.log(error);
    }
  };

  useEffect(() => {
    consultarData();
    consultarDataMantenimientos();
  }, [year]);

  return (
    <div className="p-4">
      <label className="block text-gray-200 text-sm font-bold mb-2">
        Seleccionar Año
      </label>
      <DatePicker
        selected={year}
        onChange={handleChange}
        showYearPicker // Activa la vista de solo años
        dateFormat="yyyy" // Formato del año
        placeholderText="Seleccione un año"
        className="w-full px-4 py-2 border rounded shadow-sm"
      />
      {year && (
        <p className="mt-4 text-gray-200">
          Año seleccionado: {year.getFullYear()}
        </p>
      )}
    </div>
  );
}
