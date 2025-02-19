import React, { useState } from "react";
import HeaderAdmin from "../../components/admin/HeaderAdmin";
import { TablaMantenimientos } from "../../components/admin/mantenimientos/TablaMantenimientos";
import { DrawerMantenimiento } from "../../components/admin/mantenimientos/DrawerMantenimiento";

const GestionarMantenimientos = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [mantenimientoEditar, setMantenimientoEditar] = useState(null);
  return (
    <div>
      <HeaderAdmin titulo="Gestionar mantenimientos" />
      <div className="w-4/5 mx-auto mt-5">
        <div className="flex justify-end w-full mb-5">
          <DrawerMantenimiento
            openDrawer={openDrawer}
            setOpenDrawer={setOpenDrawer}
            mantenimientoEditar={mantenimientoEditar}
            setMantenimientoEditar={setMantenimientoEditar}
          />
        </div>
        <TablaMantenimientos
          setOpenDrawer={setOpenDrawer}
          setMantenimientoEditar={setMantenimientoEditar}
        />
      </div>
    </div>
  );
};

export default GestionarMantenimientos;
