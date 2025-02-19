import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";

export function ModalVerTodo({
  auditoriaSeleccionada: auditoria,
  modalVerTodo,
  setModalVerTodo,
}) {
  const handleOpen = () => setModalVerTodo(!modalVerTodo);

  return (
    <>
      <Button
        onClick={handleOpen}
        className={`${modalVerTodo ? "hidden" : ""}`}
      >
        Ver Acciones
      </Button>
      <Dialog
        open={modalVerTodo}
        handler={handleOpen}
        className="max-h-[80%] flex flex-col justify-between overflow-y-auto"
      >
        <DialogHeader className="text-center text-lg font-bold text-blue-gray-800">
          Todos los datos
        </DialogHeader>
        <DialogBody className="flex-grow overflow-y-auto p-4">
          <Typography
            variant="h6"
            color="blue-gray"
            className="text-blue-700 font-semibold"
          >
            Datos previos
          </Typography>
          <div
            key={auditoria.id}
            className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm"
          >
            <Typography
              variant="h6"
              color="blue-gray"
              className="text-blue-700 font-semibold"
            >
              id usuario:{" "}
              {auditoria?.datos_previos?.usuario_asignado
                ? auditoria.datos_previos.usuario_asignado
                : "N/A"}
            </Typography>
            <Typography
              variant="h6"
              color="blue-gray"
              className="text-blue-700 font-semibold"
            >
              Fecha:{" "}
              {auditoria?.datos_previos?.fecha
                ? auditoria.datos_previos.fecha
                : "N/A"}
            </Typography>
            <Typography
              variant="h6"
              color="blue-gray"
              className="text-blue-700 font-semibold"
            >
              Precio:{" "}
              {auditoria?.datos_previos?.precio
                ? auditoria.datos_previos.precio
                : "N/A"}
            </Typography>
            <Typography
              variant="h6"
              color="blue-gray"
              className="text-blue-700 font-semibold"
            >
              Id cancha :{" "}
              {auditoria?.datos_previos?.cancha_id
                ? auditoria.datos_previos.cancha_id
                : "N/A"}
            </Typography>
          </div>
          <Typography
            variant="h6"
            color="blue-gray"
            className="text-blue-700 font-semibold"
          >
            Datos nuevos
          </Typography>
          <div
            className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm"
          >
            <Typography
              variant="h6"
              color="blue-gray"
              className="text-blue-700 font-semibold"
            >
              id usuario:{" "}
              {auditoria?.datos_nuevos?.usuario_asignado
                ? auditoria.datos_nuevos.usuario_asignado
                : "N/A"}
            </Typography>
            <Typography
              variant="h6"
              color="blue-gray"
              className="text-blue-700 font-semibold"
            >
              Fecha:{" "}
              {auditoria?.datos_nuevos?.fecha
                ? auditoria.datos_nuevos.fecha
                : "N/A"}
            </Typography>
            <Typography
              variant="h6"
              color="blue-gray"
              className="text-blue-700 font-semibold"
            >
              Precio:{" "}
              {auditoria?.datos_nuevos?.precio
                ? auditoria.datos_nuevos.precio
                : "N/A"}
            </Typography>
            <Typography
              variant="h6"
              color="blue-gray"
              className="text-blue-700 font-semibold"
            >
              Id cancha :{" "}
              {auditoria?.datos_nuevos?.cancha_id
                ? auditoria.datos_nuevos.cancha_id
                : "N/A"}
            </Typography>
          </div>
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
