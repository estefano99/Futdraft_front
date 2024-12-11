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

export function ModalVerAcciones({
  modalVerAcciones,
  setModalVerAcciones,
  accionesUsuario,
}) {
  const handleOpen = () => setModalVerAcciones(!modalVerAcciones);

  return (
    <>
      <Button
        onClick={handleOpen}
        className={`${modalVerAcciones ? "hidden" : ""}`}
      >
        Ver Acciones
      </Button>
      <Dialog
        open={modalVerAcciones}
        handler={handleOpen}
        className="max-h-[80%] flex flex-col justify-between overflow-y-auto"
      >
        <DialogHeader className="text-center text-lg font-bold text-blue-gray-800">
          Acciones del usuario
        </DialogHeader>
        <DialogBody className="flex-grow overflow-y-auto p-4">
          {accionesUsuario.length > 0
            ? accionesUsuario.map((modulo) => (
                <div
                  key={modulo.id}
                  className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm"
                >
                  <Typography
                    variant="h6"
                    color="blue-gray"
                    className="text-blue-700 font-semibold"
                  >
                    {modulo.nombre}
                  </Typography>
                  <div className="pl-4">
                    {modulo.formularios.map((formulario) => (
                      <div key={formulario.id} className="mt-4">
                        <Typography
                          variant="h6"
                          color="blue-gray"
                          className="text-blue-500 font-medium"
                        >
                          {formulario.nombre}
                        </Typography>
                        <List className="mt-2 space-y-1">
                          {formulario.acciones.map((accion) => (
                            <ListItem
                              key={accion.id}
                              className="text-gray-700 text-sm flex items-center gap-2 cursor-default"
                            >
                              <span className=" text-blue-800 px-2 py-1 rounded-md">
                                {accion.nombre}
                              </span>
                            </ListItem>
                          ))}
                        </List>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            : "El usuario no tiene acciones asignadas"}
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
