import React, { useState } from "react";
import HeaderAdmin from "../../components/admin/HeaderAdmin";
import Canchas from "../../components/admin/canchas/Canchas";
import { useCanchas } from "../../context/CanchasProvider";
import { InputFilterCanchas } from "../../components/admin/canchas/InputFilterCanchas";

const SeleccionarCancha = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [canchaEditar, setCanchaEditar] = useState(null);
  const [valueNroCancha, setValueNroCancha] = useState("");
  const [valuePrecio, setValuePrecio] = useState("");
  const { canchas } = useCanchas();

  const filtroCanchas = [...canchas].filter((cancha) =>
    String(`${cancha.nro_cancha} ${cancha.precio}`).includes(
      `${valueNroCancha} ${valuePrecio}`
    )
  );

  return (
    <div className="">
      <HeaderAdmin titulo="Seleccionar canchas" />
      <div className="w-4/5 mx-auto py-5">
        <div className="flex flex-col md:flex-row gap-2 mb-5">
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
        <Canchas
          canchas={canchas}
          setOpenDrawer={setOpenDrawer}
          setCanchaEditar={setCanchaEditar}
          reservandoTurno={true}
          filtroCanchas={filtroCanchas}
        />
      </div>
    </div>
  );
};

export default SeleccionarCancha;
