import HeaderAdmin from "../../components/admin/HeaderAdmin";
import { InputFilterCanchas } from "../../components/admin/canchas/InputFilterCanchas";
import { DrawerCrearCancha } from "../../components/admin/canchas/DrawerCrearCancha";
import { useCanchas } from "../../context/CanchasProvider";
import Canchas from "../../components/admin/canchas/Canchas";
import { useState, useEffect } from "react";
import { AlertColors } from "../../components/Alert";

const GestionarCanchas = () => {
  const { canchas } = useCanchas();
  const [alert, setAlert] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [canchaEditar, setCanchaEditar] = useState(null);

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
      <HeaderAdmin titulo="Gestionar canchas" />
      <div className="w-4/5 mx-auto">
        {alert && <AlertColors alert={alert} />}
        <div className="w-full py-5 flex justify-between">
          <InputFilterCanchas />
          <DrawerCrearCancha
            openDrawer={openDrawer}
            setOpenDrawer={setOpenDrawer}
            setAlert={setAlert}
            canchaEditar={canchaEditar}
            setCanchaEditar={setCanchaEditar}
            text="Crear Cancha"
          />
        </div>
        <Canchas
          setCanchaEditar={setCanchaEditar}
          setOpenDrawer={setOpenDrawer}
          canchas={canchas}
          reservandoTurno={false}
        />
      </div>
    </div>
  );
};

export default GestionarCanchas;
