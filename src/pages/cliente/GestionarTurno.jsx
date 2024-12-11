import React from "react";
import { TablaGestionarTurnos } from "../../components/cliente/TablaGestionarTurnos";
import HeaderAdmin from "../../components/admin/HeaderAdmin";

const GestionarTurno = () => {

  return (
    <div>
      <HeaderAdmin titulo="Gestionar Turnos" />
      <div className="w-4/5 mx-auto py-5">
        <TablaGestionarTurnos/>
      </div>
    </div>
  );
};

export default GestionarTurno;
