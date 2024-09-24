import React from "react";
import { useNavigate } from "react-router-dom";
import { rutaGestionarCanchas, rutaReservarTurno, rutaGeneralAdmin } from "../../../libs/constantes";

//! Este componente se reutiliza en GESTIONAR CANCHAS DEL ADMIN y Reservas Turnos del cliente, y cumple diferente funciones.
const Canchas = ({ canchas = [], setOpenDrawer = () => {}, setCanchaEditar = () => {}, reservandoTurno }) => {
  const navigate = useNavigate();

  const handleSeleccionarCancha = (cancha) => {
    if (!reservandoTurno) {
      setCanchaEditar(cancha);
      setOpenDrawer(true);
      return;
    }

    if (reservandoTurno) {
      navigate(`${rutaReservarTurno}/${cancha.id}/${cancha.nro_cancha}/${cancha.precio}`);
    }

  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {canchas.length > 0 ? (
        canchas.map((cancha) => (
          <div
            className="h-48 bg-green-700 text-white hover:bg-green-500 cursor-pointer"
            key={cancha.id}
            onClick={() => handleSeleccionarCancha(cancha)}
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
            {reservandoTurno ? <> No Existen canchas en el sistema.</>: <> No hay canchas creadas, <button className="underline underline-offset-2 transition-all hover:text-gray-200" onClick={()=> setOpenDrawer(true)}>cargue alguna!</button></>}
          </p>
        </div>
      )}
    </div>
  );
};

export default Canchas;
