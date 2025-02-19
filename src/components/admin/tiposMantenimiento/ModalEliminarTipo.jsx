import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { notifyError, notifySuccess } from "../../../libs/funciones";
import { useTipoMantenimiento } from "../../../context/TipoMantProvider";

export default function ModalEliminarTipo({ modal, setModal, tipoEliminar }) {
  const { eliminarTipoMantenimiento } = useTipoMantenimiento();

  const handleOpen = () => setModal(!modal);

  const handleEliminar = async () => {
    try {
      const respuestaEliminar = await eliminarTipoMantenimiento(
        tipoEliminar.id
      );
      notifySuccess(respuestaEliminar.message);
      setModal(false);
    } catch (error) {
      console.log(error);
      notifyError(error.response.data.error || "Error al eliminar un tipo");
      setModal(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="gradient"
        className={`${modal ? "hidden" : ""}`}
      >
        Open Modal
      </Button>
      <Dialog open={modal} handler={handleOpen}>
        <DialogHeader>
          Se eliminara de forma permanente. ¿Estás seguro?:
        </DialogHeader>
        <DialogBody>
          <p>Descripcion: {tipoEliminar.descripcion}</p>
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
