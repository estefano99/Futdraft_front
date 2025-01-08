import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { rutaReservarTurno } from "../../../libs/constantes";
import { useAuth } from "../../../context/AuthProvider";
import ModalEliminarCancha from "./ModalEliminarCancha";
import {
  accionesDisponibles,
  tienePermiso,
} from "../../../libs/PermisosBotones";

//! Este componente se reutiliza en GESTIONAR CANCHAS DEL ADMIN y Reservas Turnos del cliente, y cumple diferente funciones.
const Canchas = ({
  canchas = [],
  setOpenDrawer = () => {},
  setCanchaEditar = () => {},
  reservandoTurno,
  filtroCanchas = [],
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [canchaEliminar, setCanchaEliminar] = useState(null);
  const { accionesUsuarioDisponibles } = useAuth();

  const [puedeReservarTurno, setPuedeReservarTurno] = useState(false);
  const [puedeEditarCancha, setPuedeEditarCancha] = useState(false);
  const [puedeEliminarCancha, setPuedeEliminarCancha] = useState(false);

  const handleEditarCancha = (cancha) => {
    if (!reservandoTurno) {
      setCanchaEditar(cancha);
      setOpenDrawer(true);
      return;
    }
  };

  const handleReservarTurno = (cancha) => {
    navigate(
      `${rutaReservarTurno}/${cancha.id}/${cancha.nro_cancha}/${cancha.precio}/${user.id}`
    );
  };

  const handleEliminarCancha = (cancha) => {
    setModal(true);
    setCanchaEliminar(cancha);
  };

  useEffect(() => {
    // Calcular permisos para canchas
    const reservarTurno = tienePermiso(
      accionesUsuarioDisponibles,
      accionesDisponibles.RESERVAR_TURNO_CLIENTE
    );
    const editarCancha = tienePermiso(
      accionesUsuarioDisponibles,
      accionesDisponibles.EDITAR_CANCHA
    );
    const eliminarCancha = tienePermiso(
      accionesUsuarioDisponibles,
      accionesDisponibles.ELIMINAR_CANCHA
    );

    // Actualizar los estados de los permisos
    setPuedeReservarTurno(reservarTurno);
    setPuedeEditarCancha(editarCancha);
    setPuedeEliminarCancha(eliminarCancha);
  }, [accionesUsuarioDisponibles]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {modal && (
        <ModalEliminarCancha
          modal={modal}
          setModal={setModal}
          canchaEliminar={canchaEliminar}
        />
      )}
      {Array.isArray(filtroCanchas) && filtroCanchas.length > 0 ? (
        filtroCanchas.map((cancha) => (
          <div
            className={`flex flex-col justify-between h-48 bg-green-700 text-white ${
              !puedeReservarTurno && reservandoTurno
                ? "pointer-events-none opacity-50"
                : "cursor-pointer hover:bg-green-500"
            }`}
            onClick={() => {
              if (reservandoTurno && puedeReservarTurno)
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
            {!reservandoTurno && (
              <div className="flex justify-center items-center gap-5 bg-green-800 px-4 py-2">
                <button
                  disabled={!puedeEditarCancha}
                  className={`text-sm md:text-base bg-blue-500 hover:bg-blue-400 text-white font-bold py-1 px-3 rounded ${
                    !puedeEditarCancha ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation(); // Evita activar el onClick del contenedor
                    handleEditarCancha(cancha);
                  }}
                >
                  Editar
                </button>
                <button
                  disabled={!puedeEliminarCancha}
                  className={`text-sm md:text-base bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-3 rounded ${
                    !puedeEditarCancha ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation(); // Evita activar el onClick del contenedor
                    handleEliminarCancha(cancha);
                  }}
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="">
          <p className="mt-10 text-white text-center font-bold text-2xl">
            {reservandoTurno ? (
              <> No Existen canchas en el sistema.</>
            ) : (
              <> No se encontraron canchas. </>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default Canchas;
