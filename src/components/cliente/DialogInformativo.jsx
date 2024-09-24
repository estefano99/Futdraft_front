import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

export function DialogInformativo({ openDialogInfo, setOpenDialogInfo, date }) {
  const handleOpen = () => setOpenDialogInfo(!openDialogInfo);

  return (
    <>
      <Button onClick={handleOpen} variant="gradient">
        Open Dialog
      </Button>
      <Dialog
        open={openDialogInfo}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>Atención.</DialogHeader>
        <DialogBody>
          <p>
            En la fecha{" "}
            <span className="font-bold">
              {date
                ? dayjs(date).format("dddd, D MMMM YYYY")
                : "Fecha no disponible"}
            </span>{" "}
            aún no se puede reservar turnos, por favor seleccione otra.
          </p>
        </DialogBody>
        <DialogFooter>
          <Button variant="gradient" color="dark" onClick={handleOpen}>
            <span>Cerrar</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
