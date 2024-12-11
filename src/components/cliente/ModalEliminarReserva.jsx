import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useReservas } from "../../context/ReservasProvider";
import { notifyError, notifySuccess } from "../../libs/funciones";
 
export default function ModalEliminarReserva({modal, setModal, reservaEliminar}) {
  const {eliminarReserva} = useReservas();
 
  const handleOpen = () => setModal(!modal);
  
  const handleEliminar = async () => {
    try {
      await eliminarReserva(reservaEliminar.id);
      notifySuccess("Turno eliminado correctamente!");
      setModal(false);
    } catch (error) {
      notifyError(error.response.data.message);
      setModal(false);
    }
  }
 
  return (
    <>
      <Button onClick={handleOpen} variant="gradient">
        Open Modal
      </Button>
      <Dialog open={modal} handler={handleOpen}>
        <DialogHeader>Estás seguro que deseas eliminar el turno de:</DialogHeader>
        <DialogBody>
        <p>Número de cancha: {reservaEliminar.nro_cancha}</p>
        <p>Fecha: {reservaEliminar.fecha}</p>
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