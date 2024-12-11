import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";
import { notifyError, notifySuccess } from "../../../libs/funciones";
import { useReservas } from "../../../context/ReservasProvider";
import {
  accionesDisponibles,
  tienePermiso,
} from "../../../libs/PermisosBotones";
import { useAuth } from "../../../context/AuthProvider";

export default function ModalEditarEliminarReserva({
  modal,
  setModal,
  actualizarEvento,
  setActualizarEvento,
}) {
  const { eliminarReserva } = useReservas();
  const [modalAvisarEditar, setModalAvisarEditar] = useState(false);
  const { accionesUsuarioDisponibles } = useAuth();

  const [puedeEditarAdminTurno, setPuedeEditarAdminTurno] = useState(false);
  const [puedeEliminarAdminTurno, setPuedeEliminarAdminTurno] = useState(false);

  const handleOpen = () => setModal(!modal);

  const handleEditar = async () => {
    setModalAvisarEditar(true);
    // handleOpen();
  };

  const handleEliminar = async () => {
    try {
      await eliminarReserva(actualizarEvento.id);
      notifySuccess("Turno eliminado correctamente");
      setActualizarEvento(null);
      handleOpen();
    } catch (error) {
      console.log(error);
      setActualizarEvento(null);
      notifyError(error.message || "Error al eliminar la reserva");
      handleOpen();
    }
  };

  const handleCancelar = () => {
    setActualizarEvento(null);
    handleOpen();
  };

  useEffect(() => {
    // Calcular permisos para canchas
    const editarAdminTurno = tienePermiso(
      accionesUsuarioDisponibles,
      accionesDisponibles.EDITAR_ADMIN_TURNO
    );
    // Actualizar los estados de los permisos
    setPuedeEditarAdminTurno(editarAdminTurno);
    const eliminarAdminTurno = tienePermiso(
      accionesUsuarioDisponibles,
      accionesDisponibles.ELIMINAR_ADMIN_TURNO
    );
    // Actualizar los estados de los permisos
    setPuedeEliminarAdminTurno(eliminarAdminTurno);
  }, [accionesUsuarioDisponibles]);

  return (
    <>
      <Button onClick={handleOpen} variant="gradient">
        Open Modal
      </Button>
      <Dialog open={modal} handler={handleOpen}>
        <DialogHeader className="flex flex-col gap-2">
          {modalAvisarEditar ? (
            "Atención, para editar deberá:"
          ) : (
            <>
              ¿Deseas editar o eliminar?
              <div className="px-4">
                <Typography
                  variant="small"
                  color="gray"
                  className="font-normal"
                >
                  Seleccionaste el turno:
                </Typography>
              </div>
            </>
          )}
        </DialogHeader>
        <DialogBody>
          {modalAvisarEditar ? (
            <Typography
              variant="paragraph"
              color="gray"
              className="font-normal"
            >
              Seleccionar un <span className="font-bold">turno libre</span> y se{" "}
              <span className="font-bold"> editará el turno previamente</span>{" "}
              seleccionado.
            </Typography>
          ) : (
            <>
              <Typography
                variant="paragraph"
                color="gray"
                className="font-normal"
              >
                Inicio: {String(actualizarEvento?.start)}{" "}
              </Typography>
              <Typography
                variant="paragraph"
                color="gray"
                className="font-normal"
              >
                Fin: {String(actualizarEvento?.end)}
              </Typography>
              <Typography
                variant="paragraph"
                color="gray"
                className="font-normal"
              >
                Nombre: {actualizarEvento.usuario_nombre}{" "}
                {actualizarEvento.usuario_apellido}
              </Typography>
              <Typography
                variant="paragraph"
                color="gray"
                className="font-normal"
              >
                Email: {actualizarEvento.usuario_email}
              </Typography>
            </>
          )}
        </DialogBody>
        <DialogFooter className="flex justify-center gap-2">
          {modalAvisarEditar ? (
            <>
              <Button
                variant="text"
                color="red"
                onClick={handleCancelar}
                className="mr-1"
              >
                <span>Cancelar</span>
              </Button>
              <Button
                variant="gradient"
                color="green"
                onClick={() => handleOpen()}
              >
                <span>Confirmar</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="text"
                color="red"
                onClick={handleCancelar}
                className="mr-1"
              >
                <span>Cancelar</span>
              </Button>
              <Button
                disabled={!puedeEditarAdminTurno}
                variant="gradient"
                color="green"
                onClick={handleEditar}
              >
                <span>Editar</span>
              </Button>
              <Button
                variant="gradient"
                disabled={!puedeEliminarAdminTurno}
                color="red"
                onClick={handleEliminar}
              >
                <span>Eliminar</span>
              </Button>
            </>
          )}
        </DialogFooter>
      </Dialog>
    </>
  );
}
