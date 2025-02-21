import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";

export function ModalVerTareas({
  modalVerTareas,
  setModalVerTareas,
  tareasMantenimiento,
}) {
  const handleOpen = () => setModalVerTareas(!modalVerTareas);

  return (
    <>
      <Button
        onClick={handleOpen}
        className={`${modalVerTareas ? "hidden" : ""}`}
      >
        Ver Tareas asociadas
      </Button>
      <Dialog
        open={modalVerTareas}
        handler={handleOpen}
        className="max-h-[80%] flex flex-col justify-between overflow-y-auto"
      >
        <DialogHeader className="text-center text-lg font-bold text-blue-gray-800">
          Tareas asociadas
        </DialogHeader>
        <DialogBody className="flex-grow overflow-y-auto p-4">
          <ul className="mt-2 space-y-1">
            {tareasMantenimiento.map((tarea) => (
              <li
                key={tarea.id}
                className="text-gray-700 text-sm flex items-center gap-2"
              >
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                  {tarea.descripcion}
                </span>
              </li>
            ))}
          </ul>
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
