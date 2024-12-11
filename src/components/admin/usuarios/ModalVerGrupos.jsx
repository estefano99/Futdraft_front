import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  List,
  ListItem,
} from "@material-tailwind/react";

export function ModalVerGrupos({
  modalVerGrupos,
  setModalVerGrupos,
  gruposUsuario
}) {
  const handleOpen = () => setModalVerGrupos(!modalVerGrupos);

  return (
    <>
      <Button
        onClick={handleOpen}
        className={`${modalVerGrupos ? "hidden" : ""}`}
      >
        Ver Grupos
      </Button>
      <Dialog
        open={modalVerGrupos}
        handler={handleOpen}
        className="max-h-[80%] flex flex-col justify-between overflow-y-auto"
      >
        <DialogHeader className="text-center text-lg font-bold text-blue-gray-800">
          Grupos del usuario
        </DialogHeader>
        <DialogBody className="flex-grow overflow-y-auto p-4">
          {gruposUsuario.length > 0
            ? gruposUsuario.map((grupo) => (
                <div
                  key={grupo.id}
                  className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm"
                >
                  <Typography
                    variant="h6"
                    color="blue-gray"
                    className="text-blue-700 font-semibold"
                  >
                    codigo: {grupo.codigo}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="blue-gray"
                    className="text-blue-700 font-semibold"
                  >
                    nombre: {grupo.nombre}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="blue-gray"
                    className="text-blue-700 font-semibold"
                  >
                    descripcion: {grupo.descripcion}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="blue-gray"
                    className="text-blue-700 font-semibold"
                  >
                    estado: {grupo.estado}
                  </Typography>
                  
                </div>
              ))
            : "El usuario no tiene grupos asignados"}
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button
            variant="gradient"
            color="dark"
            onClick={handleOpen}
            className="text-sm"
          >
            Cerrar
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
