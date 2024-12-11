import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { notifyError, notifySuccess } from "../../../libs/funciones";
import { useGrupos } from "../../../context/GruposProvider";

export default function ModalEliminarGrupo({
  modal,
  setModal,
  grupoEliminar,
}) {
  const { eliminarGrupo } = useGrupos();

  const handleOpen = () => setModal(!modal);

  const handleEliminar = async () => {
    try {
      const respuestaEliminar = await eliminarGrupo(grupoEliminar.id);
      notifySuccess(respuestaEliminar.message);
      setModal(false);
    } catch (error) {
      console.log(error);
      notifyError(error.response.data.error || "Error al eliminar un grupo");
      setModal(false);
    }
  };

  return (
    <>
      <Button onClick={handleOpen} variant="gradient" className={`${modal ? "hidden" : ""}`}>
        Open Modal
      </Button>
      <Dialog open={modal} handler={handleOpen}>
        <DialogHeader>
          El grupo pasará a inactivo (0). ¿Estás seguro?:
        </DialogHeader>
        <DialogBody>
          <p>Codigo: {grupoEliminar.codigo}</p>
          <p>Fecha: {grupoEliminar.nombre}</p>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancelar</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleEliminar}>
            <span>Confirmar</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
