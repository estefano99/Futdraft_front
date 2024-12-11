import { ButtonGroup, Button } from "@material-tailwind/react";
import { useState } from "react";
import ModalCambiarClave from "./ModalCambiarClave";

export function MenuPerfil({ setOpenDatos, setOpenGrupos, setOpenAcciones }) {
  const [open, setOpen] = useState(false);

  const handleOpenDatos = () => {
    setOpenDatos(true);
    setOpenGrupos(false);
    setOpenAcciones(false);
  };
  const handleOpenGrupos = () => {
    setOpenDatos(false);
    setOpenGrupos(true);
    setOpenAcciones(false);
  };

  const handleOpenAcciones = () => {
    setOpenDatos(false);
    setOpenGrupos(false);
    setOpenAcciones(true);
  };

  const handleResetearClave = async () => {
    setOpen(true);
  };
  return (
    <>
      {open && <ModalCambiarClave setOpen={setOpen} open={open} />}
      <ButtonGroup
        color="blue"
        className="flex flex-col gap-2  md:gap-0 md:flex-row"
        variant="gradient"
        fullWidth
      >
        <Button onClick={handleOpenDatos}>Datos</Button>
        <Button onClick={handleOpenGrupos}>Grupos</Button>
        <Button onClick={handleOpenAcciones}>Acciones</Button>
        <Button onClick={handleResetearClave}>Resetear Clave</Button>
      </ButtonGroup>
    </>
  );
}
