import React from "react";
import HeaderAdmin from "../../components/admin/HeaderAdmin";
import CalendarioAdmin from "../../components/admin/adminTurnos/CalendarioAdmin";

const AdminCalendarioPage = () => {
  return (
    <div className="h-screen flex flex-col bg-white">
      <HeaderAdmin titulo="Administrar turnos" />
      <div className="flex-grow mt-8">
        <CalendarioAdmin />
      </div>
    </div>
  );
};

export default AdminCalendarioPage;
