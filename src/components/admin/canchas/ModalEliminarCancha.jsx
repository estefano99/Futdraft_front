import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { notifyError, notifySuccess } from "../../../libs/funciones";
import { useCanchas } from "../../../context/CanchasProvider";

export default function ModalEliminarCancha({
  modal,
  setModal,
  canchaEliminar,
}) {
  const { eliminarCancha } = useCanchas();

  const handleOpen = () => setModal(!modal);

  const handleEliminar = async () => {
    try {
      const respuestaEliminar = await eliminarCancha(canchaEliminar.id);
      console.log(respuestaEliminar)
      notifySuccess(respuestaEliminar.message);
      setModal(false);
    } catch (error) {
      console.log(error);
      notifyError(error.response.data.message);
      setModal(false);
    }
  };

  return (
    <>
      <Button onClick={handleOpen} variant="gradient" className="hidden">
        Open Modal
      </Button>
      <Dialog open={modal} handler={handleOpen}>
        <DialogHeader>
          Estás seguro que deseas eliminar la cancha:
        </DialogHeader>
        <DialogBody>
          <p>Número de cancha: {canchaEliminar.nro_cancha}</p>
          <p>Precio: {canchaEliminar.precio}</p>
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
