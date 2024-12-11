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
  const [valueNroCancha, setValueNroCancha] = useState("");
  const [valuePrecio, setValuePrecio] = useState("");

  const filtroCanchas = [...canchas].filter((cancha) =>
    String(`${cancha.nro_cancha} ${cancha.precio}`).includes(
      `${valueNroCancha} ${valuePrecio}`
    )
  );

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
        <div className="w-full py-5 flex flex-col md:flex-row justify-between">
          <div className="flex flex-col md:flex-row gap-2">
            <InputFilterCanchas
              value={valueNroCancha}
              setValue={setValueNroCancha}
              isCancha={true}
            />

            {/* Filtro por precio */}
            <InputFilterCanchas
              value={valuePrecio}
              setValue={setValuePrecio}
              isCancha={false}
            />
          </div>
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
          filtroCanchas={filtroCanchas}
        />
      </div>
    </div>
  );
};

export default GestionarCanchas;
