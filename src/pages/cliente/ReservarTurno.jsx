import React from "react";
import Calendario from "../../components/cliente/Calendario";
import HeaderAdmin from "../../components/admin/HeaderAdmin";

const ReservarTurno = () => {
  return (
    <div className="h-screen flex flex-col bg-white">
      <HeaderAdmin titulo="Reservar Turnos" />
      <div className="flex-grow mt-8">
        <Calendario />
      </div>
    </div>
  );
};

export default ReservarTurno;
