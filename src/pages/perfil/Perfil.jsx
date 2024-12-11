import { useState } from "react";
import HeaderAdmin from "../../components/admin/HeaderAdmin";
import { MenuPerfil } from "../../components/perfil/MenuPerfil";
import DatosPerfil from "../../components/perfil/DatosPerfil";
import GruposPerfil from "../../components/perfil/GruposPerfil";
import AccionesPerfil from "../../components/perfil/AccionesPerfil";

const Perfil = () => {
  const [openDatos, setOpenDatos] = useState(true);
  const [openGrupos, setOpenGrupos] = useState(false);
  const [openAcciones, setOpenAcciones] = useState(false);
  return (
    <section>
      <HeaderAdmin titulo="Mi perfil" />
      <div className="w-4/5 mx-auto py-5">
        <MenuPerfil
          setOpenDatos={setOpenDatos}
          setOpenGrupos={setOpenGrupos}
          setOpenAcciones={setOpenAcciones}
        />
        <div className="mt-10">
          {openDatos && <DatosPerfil />}
          {openGrupos && <GruposPerfil />}
          {openAcciones && <AccionesPerfil />}
        </div>
      </div>
    </section>
  );
};

export default Perfil;
