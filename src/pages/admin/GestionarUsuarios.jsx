import React, { useState } from "react";
import HeaderAdmin from "../../components/admin/HeaderAdmin";
import { TablaUsuarios } from "../../components/admin/usuarios/TablaUsuarios";
import { DrawerUsuarios } from "../../components/admin/usuarios/DrawerUsuarios";

const GestionarUsuarios = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [alert, setAlert] = useState(null);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  return (
    <div>
      <HeaderAdmin titulo="Gestionar usuarios" />
      <div className="w-4/5 mx-auto mt-10">
        <div className="flex justify-end w-full mb-5">
          <DrawerUsuarios
            openDrawer={openDrawer}
            setOpenDrawer={setOpenDrawer}
            setAlert={setAlert}
            usuarioEditar={usuarioEditar}
            setUsuarioEditar={setUsuarioEditar}
          />
        </div>
        <TablaUsuarios
          setOpenDrawer={setOpenDrawer}
          setUsuarioEditar={setUsuarioEditar}
        />
      </div>
    </div>
  );
};

export default GestionarUsuarios;
