import React, { useState } from "react";
import HeaderAdmin from "../../components/admin/HeaderAdmin";
import { TablaGrupos } from "../../components/admin/grupos/TablaGrupos";
import { DrawerGrupo } from "../../components/admin/grupos/DrawerGrupo";

const GestionarGrupos = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [alert, setAlert] = useState(null);
  const [grupoEditar, setGrupoEditar] = useState(null);
  return (
    <div>
      <HeaderAdmin titulo="Gestionar grupos" />
      <div className="w-4/5 mx-auto mt-5">
        <div className="flex justify-end w-full mb-5">
          <DrawerGrupo
            openDrawer={openDrawer}
            setOpenDrawer={setOpenDrawer}
            setAlert={setAlert}
            grupoEditar={grupoEditar}
            setGrupoEditar={setGrupoEditar}
          />
        </div>
        <TablaGrupos setOpenDrawer={setOpenDrawer} setGrupoEditar={setGrupoEditar} />
      </div>
    </div>
  );
};

export default GestionarGrupos;
