import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { notifyError, notifySuccess } from "../../../libs/funciones";
import { useTareas } from "../../../context/TareasProvider";

export default function ModalEliminarTarea({ modal, setModal, tareaEliminar }) {
  const { eliminarTarea } = useTareas();

  const handleOpen = () => setModal(!modal);

  const handleEliminar = async () => {
    try {
      const respuestaEliminar = await eliminarTarea(tareaEliminar.id);
      notifySuccess(respuestaEliminar?.message || "Tarea eliminada");
      setModal(false);
    } catch (error) {
      console.log(error);
      notifyError(error.response?.data?.message || "Error al eliminar tarea");
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
        <DialogHeader>¿Estás seguro que deseas eliminar la tarea?</DialogHeader>
        <DialogBody>
          <p>Descripcion: {tareaEliminar.descripcion}</p>
          <p>Fecha asignacion: {tareaEliminar.fecha_asignacion}</p>
          <p>
            Mantenimiento: {tareaEliminar.mantenimiento.descripcion}
          </p>
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
