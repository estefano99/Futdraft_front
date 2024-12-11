import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";
import { notifyError, notifySuccess } from "../../../libs/funciones";
import { useAuth } from "../../../context/AuthProvider";

export default function ModalResetearClave({
  modalResetearClave,
  setModalResetearClave,
  usuarioResetearClave,
}) {
  const { resetearClave } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const handleOpen = () => setModalResetearClave(!modalResetearClave);

  //Resetea el passaword
  const handleRestear = async () => {
    try {
      setLoading(true);
      const respuestaResetear = await resetearClave(usuarioResetearClave.id);
      setLoading(false);
      notifySuccess(respuestaResetear);
      setModalResetearClave(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      notifyError(error.response.data.message);
      setModalResetearClave(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="gradient"
        className={`${modalResetearClave ? "hidden" : ""}`}
      >
        Open Modal
      </Button>
      <Dialog open={modalResetearClave} handler={handleOpen}>
        <DialogHeader>
          ¿Estás seguro que deseas resetear la clave del usuario? :
        </DialogHeader>
        <DialogBody>
          <Typography
            className="mb-3 font-normal"
            variant="paragraph"
            color="gray"
          >
            <p>Se enviará al Mail: {usuarioResetearClave.email}</p>
          </Typography>
          <p>Nombre: {usuarioResetearClave.nombre}</p>
          <p>Apellido: {usuarioResetearClave.apellido}</p>
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
          <Button
            loading={loading}
            variant="gradient"
            color="green"
            onClick={handleRestear}
          >
            <span>{loading ? "cargando" : "Confirmar"}</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
