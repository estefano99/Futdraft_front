import React, { useState } from "react";
import HeaderAdmin from "../../components/admin/HeaderAdmin";
import { TablaTareas } from "../../components/admin/tareas/TablaTareas";
import { DrawerTarea } from "../../components/admin/tareas/DrawerTarea";

const GestionarTareas = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [tareaEditar, setTareaEditar] = useState(null);
  return (
    <div>
      <HeaderAdmin titulo="Gestionar tareas" />
      <div className="w-[90%] mx-auto mt-5">
        <div className="flex justify-end w-full mb-5">
          <DrawerTarea
            openDrawer={openDrawer}
            setOpenDrawer={setOpenDrawer}
            tareaEditar={tareaEditar}
            setTareaEditar={setTareaEditar}
          />
        </div>
        <TablaTareas
          setOpenDrawer={setOpenDrawer}
          setTareaEditar={setTareaEditar}
        />
      </div>
    </div>
  );
};

export default GestionarTareas;
