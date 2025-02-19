import React, { useState } from "react";
import HeaderAdmin from "../../components/admin/HeaderAdmin";
import { TablaAuditoriaReserva } from "../../components/admin/auditorias/TablaAuditoriaReserva";

const AuditoriaReserva= () => {
  return (
    <div>
      <HeaderAdmin titulo="Auditoria Reservas" />
      <div className="w-4/5 mx-auto mt-10">
        <TablaAuditoriaReserva
        />
      </div>
    </div>
  );
};

export default AuditoriaReserva;
