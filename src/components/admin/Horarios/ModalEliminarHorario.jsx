import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { notifyError, notifySuccess } from "../../../libs/funciones";
import { useHorarios } from "../../../context/HorariosProvider";

export default function ModalEliminarHorario({
  modal,
  setModal,
  horarioEliminar,
}) {
  const { eliminarHorario } = useHorarios();

  const handleOpen = () => setModal(!modal);

  const handleEliminar = async () => {
    try {
      const respuestaEliminar = await eliminarHorario(horarioEliminar.id);
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
          Estás seguro que deseas eliminar el horario de:
        </DialogHeader>
        <DialogBody>
          <p>Número de cancha: {horarioEliminar.nro_cancha}</p>
          <p>Fecha: {horarioEliminar.fecha}</p>
          <p>Inicio: {horarioEliminar.horario_apertura}</p>
          <p>Terminación: {horarioEliminar.horario_cierre}</p>
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
