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

export default function ModalEliminarUsuario({
  modal,
  setModal,
  usuarioEliminar,
}) {
  const { eliminarUsuario } = useAuth();

  const handleOpen = () => setModal(!modal);

  const handleEliminar = async () => {
    try {
      const respuestaEliminar = await eliminarUsuario(usuarioEliminar.id);
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
          ¿Estás seguro que deseas eliminar al usuario?
        </DialogHeader>
        <DialogBody>
          <p>Nombre: {usuarioEliminar.nombre}</p>
          <p>Apellido: {usuarioEliminar.apellido}</p>
          <p>Mail: {usuarioEliminar.email}</p>
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
