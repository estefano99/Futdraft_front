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
 
export default function ModalEditarReserva({modal, setModal, actualizarEvento, setActualizarEvento}) {
  const {editarReserva} = useReservas();
 
  const handleOpen = () => setModal(!modal);
  
  const handleEditar = async () => {
    try {
      const respuesta = await editarReserva(actualizarEvento);
      notifySuccess(`${respuesta.message} - ${respuesta.reserva.fecha}`);
      setActualizarEvento(null);
      handleOpen();
    } catch (error) {
      console.log(error);
      setActualizarEvento(null);
      notifyError(error.message);
      handleOpen();
    }
  }

  const handleCancelar = () => {
    setActualizarEvento(null);
    handleOpen();
  }
 
  return (
    <>
      <Button onClick={handleOpen} variant="gradient">
        Open Modal
      </Button>
      <Dialog open={modal} handler={handleOpen}>
        <DialogHeader>Estás seguro que deseas editar el turno a:</DialogHeader>
        <DialogBody>
        <p>Número de cancha: {actualizarEvento?.nro_cancha}</p>
        <p>Inicio: {String(actualizarEvento?.start)}</p>
        <p>Fin: {String(actualizarEvento?.end)}</p>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleCancelar}
            className="mr-1"
          >
            <span>Cancelar</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleEditar}>
            <span>Confirmar</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}