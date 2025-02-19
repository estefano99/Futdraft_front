import React, { useState } from "react";
import HeaderAdmin from "../../components/admin/HeaderAdmin";
import { TablaAuditoriaMant } from "../../components/admin/auditorias/TablaAuditoriaMant";

const AuditoriaMantenimiento = () => {
  return (
    <div>
      <HeaderAdmin titulo="Auditoria Mantenimiento" />
      <div className="w-4/5 mx-auto mt-10">
        <TablaAuditoriaMant
        />
      </div>
    </div>
  );
};

export default AuditoriaMantenimiento;
