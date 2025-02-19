import React, { useState } from "react";
import HeaderAdmin from "../../components/admin/HeaderAdmin";
import { TablaAuditoriaLog } from "../../components/admin/auditorias/TablaAuditoriaLog";

const AuditoriaLog = () => {
  return (
    <div>
      <HeaderAdmin titulo="Auditoria Log in / Log out" />
      <div className="w-4/5 mx-auto mt-10">
        <TablaAuditoriaLog
        />
      </div>
    </div>
  );
};

export default AuditoriaLog;
