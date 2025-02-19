import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { notifyError, notifySuccess } from "../../../libs/funciones";
import { useAuth } from "../../../context/AuthProvider";
import { useMantenimiento } from "../../../context/MantenimientosProvider";

export default function ModalEliminarMantenimiento({
  modal,
  setModal,
  mantenimientoEliminar,
}) {
  const { eliminarMantenimiento } = useMantenimiento();

  const handleOpen = () => setModal(!modal);

  const handleEliminar = async () => {
    try {
      const respuestaEliminar = await eliminarMantenimiento(mantenimientoEliminar.id);
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
      <Button onClick={handleOpen} variant="gradient" className={`${modal ? "hidden" : ""}`}>
        Open Modal
      </Button>
      <Dialog open={modal} handler={handleOpen}>
        <DialogHeader>
          ¿Estás seguro que deseas eliminar el mantenimiento?
        </DialogHeader>
        <DialogBody>
          <p>Descripcion: {mantenimientoEliminar.descripcion}</p>
          <p>Fecha: {mantenimientoEliminar.fecha}</p>
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
