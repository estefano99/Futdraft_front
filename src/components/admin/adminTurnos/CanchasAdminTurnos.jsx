import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { rutaAdminTurnos } from "../../../libs/constantes";
import { useAuth } from "../../../context/AuthProvider";
import {
  accionesDisponibles,
  tienePermiso,
} from "../../../libs/PermisosBotones";

const CanchasAdminTurnos = ({ filtroCanchas = [] }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { accionesUsuarioDisponibles } = useAuth();

  const [puedeCrearAdminTurno, setPuedeCrearAdminTurno] = useState(false);

  const handleReservarTurno = (cancha) => {
    navigate(
      `${rutaAdminTurnos}/${cancha.id}/${cancha.nro_cancha}/${cancha.precio}/${user.id}`
    );
  };

  useEffect(() => {
    // Calcular permisos para canchas
    const crearAdminTurno = tienePermiso(
      accionesUsuarioDisponibles,
      accionesDisponibles.CREAR_ADMIN_TURNO
    );
    // Actualizar los estados de los permisos
    setPuedeCrearAdminTurno(crearAdminTurno);
  }, [accionesUsuarioDisponibles]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.isArray(filtroCanchas) && filtroCanchas.length > 0 ? (
        filtroCanchas.map((cancha) => (
          <div
            className={`flex flex-col justify-between h-48 bg-green-700 text-white ${
              !puedeCrearAdminTurno 
                ? "pointer-events-none opacity-50"
                : "cursor-pointer hover:bg-green-500"
            }`}
            onClick={() => {
              handleReservarTurno(cancha);
            }}
            key={cancha.id}
          >
            <ul className="h-full flex flex-col justify-center items-center font-bold text-xl">
              <li>
                Cancha Nro:
                <span className="ml-1 text-2xl underline">
                  {cancha.nro_cancha}
                </span>
              </li>
              <li>
                Precio:
                <span className="ml-1 text-2xl">
                  {parseFloat(cancha.precio).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </span>
              </li>
            </ul>
          </div>
        ))
      ) : (
        <div className="">
          <p className="mt-10 text-white text-center font-bold text-2xl">
            No se encontraron canchas en el sistema.
          </p>
        </div>
      )}
    </div>
  );
};

export default CanchasAdminTurnos;
