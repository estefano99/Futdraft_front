import React, { useEffect, useState } from "react";
import HeaderAdmin from "../../components/admin/HeaderAdmin";
import { TablaHorarios } from "../../components/admin/Horarios/TablaHorarios";
import { DrawerHorarios } from "../../components/admin/Horarios/DrawerHorarios";
import { AlertColors } from "../../components/Alert";

const GestionarHorarios = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [alert, setAlert] = useState(null);
  const [horarioEditar, setHorarioEditar] = useState(null);

  useEffect(() => {
    let timer;
    if (alert) {
      timer = setTimeout(() => {
        setAlert(null);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [alert]);

  return (
    <div>
      <HeaderAdmin titulo="Gestionar Horarios" />
      <div className="w-4/5 mx-auto mt-10">
      {alert && <AlertColors alert={alert} />}
        <DrawerHorarios
          openDrawer={openDrawer}
          setOpenDrawer={setOpenDrawer}
          setAlert={setAlert}
          horarioEditar={horarioEditar}
          setHorarioEditar={setHorarioEditar}
        />
        <TablaHorarios setOpenDrawer={setOpenDrawer} setHorarioEditar={setHorarioEditar} />
      </div>
    </div>
  );
};

export default GestionarHorarios;
