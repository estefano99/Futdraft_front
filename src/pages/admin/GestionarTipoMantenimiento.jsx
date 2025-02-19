import React, { useState } from "react";
import HeaderAdmin from "../../components/admin/HeaderAdmin";
import { DrawerTipoMantenimiento } from "../../components/admin/tiposMantenimiento/DrawerTipoMantenimiento";
import { TablaTiposMant } from "../../components/admin/tiposMantenimiento/TablaTiposMant";

const GestionarTipoMantenimiento = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [tipoMantenimientoEditar, setTipoMantenimientoEditar] = useState(null);
  return (
    <div>
      <HeaderAdmin titulo="Gestionar tipos de mantenimiento" />
      <div className="w-4/5 mx-auto mt-10">
        <div className="flex justify-end w-full mb-5">
          <DrawerTipoMantenimiento
            openDrawer={openDrawer}
            setOpenDrawer={setOpenDrawer}
            tipoMantenimientoEditar={tipoMantenimientoEditar}
            setTipoMantenimientoEditar={setTipoMantenimientoEditar}
          />
        </div>
        <TablaTiposMant
          setOpenDrawer={setOpenDrawer}
          setTipoMantenimientoEditar={setTipoMantenimientoEditar}
        />
      </div>
    </div>
  );
};

export default GestionarTipoMantenimiento;
