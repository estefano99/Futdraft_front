import React, { useState } from "react";
import { TablaGestionar } from "../../components/cliente/TablaGestionar";
import HeaderAdmin from "../../components/admin/HeaderAdmin";
import Canchas from "../../components/admin/canchas/Canchas";
import { useCanchas } from "../../context/CanchasProvider";

const GestionarTurno = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [canchaEditar, setCanchaEditar] = useState(null);
  const [reservandoTurno, setReservandoTurno] = useState(false); // Booleano para saber si esta reservando turno o gestionando canchas
  const { canchas } = useCanchas();

  return (
    <div className="">
      <HeaderAdmin titulo="Gestionar Turnos" />
      <div className="w-4/5 mx-auto py-5">
        <Canchas
          canchas={canchas}
          setOpenDrawer={setOpenDrawer}     
          setCanchaEditar={setCanchaEditar}
          reservandoTurno={true}
        />
      </div>
    </div>
  );
};

export default GestionarTurno;
