import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  CardFooter,
  IconButton,
  Tooltip,
  Input,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useReservas } from "../../context/ReservasProvider";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { rutaReservarTurno } from "../../libs/constantes";
import { useAuth } from "../../context/AuthProvider";
import { useDebounceNroCancha } from "../../libs/funciones";
import ModalEliminarReserva from "./ModalEliminarReserva";
import { CheckedSwitch } from "../CheckedSwitch";
import { accionesDisponibles, tienePermiso } from "../../libs/PermisosBotones";

const TABLE_HEAD = [
  "Nº cancha",
  "Precio",
  "Fecha (D-M-A)",
  "Inicio",
  "Terminación",
  "Acciones",
];

export function TablaGestionarTurnos({ setOpenDrawer, setHorarioEditar }) {
  const { reservas, obtenerReservasByIdUsuario } = useReservas();
  const { user, accionesUsuarioDisponibles } = useAuth();
  const [filtrarNroCancha, setFiltrarNroCancha] = useState(""); //Guarda el filtrado de nroCancha
  const [filtrarFecha, setFiltrarFecha] = useState(""); //Guarda el filtrado de fecha
  const [totalPages, setTotalPages] = useState(1); //Total de paginas
  const [currentPage, setCurrentPage] = useState(1); //Pagina actual
  const [errorMessage, setErrorMessage] = useState(""); // Estado para el mensaje de error
  const [modal, setModal] = useState(false);
  const [reservaEliminar, setReservaEliminar] = useState(null);
  const [estadoSwitch, setEstadoSwitch] = useState(false); //en false reservas disponibles, en true finalizados
  const navigate = useNavigate();
  const [puedeEditarTurno, setPuedeEditarTurno] = useState(false);
  const [puedeEliminarTurno, setPuedeEliminarTurno] = useState(false);

  const debounceFecha = useDebounceNroCancha(filtrarFecha, 300); //Hace que la consulta por filtrado se ejecute cada cierto tiempo.
  const debounceNroCancha = useDebounceNroCancha(filtrarNroCancha, 300);
  const respuestaReservas = async () => {
    try {
      await obtenerReservasByIdUsuario(
        currentPage,
        setTotalPages,
        debounceFecha,
        debounceNroCancha,
        estadoSwitch
      );
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  useEffect(() => {
    if (!user && !user?.id) return;
    respuestaReservas();
    return;
  }, [currentPage, user, debounceFecha, debounceNroCancha, estadoSwitch]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFiltrarNroCancha = (e) => {
    setFiltrarNroCancha(e.target.value);
    setCurrentPage(1); // Reiniciar a la primera página cuando se busca
  };

  const handleFiltrarFecha = (e) => {
    setFiltrarFecha(e.target.value);
    setCurrentPage(1);
  };

  const handleClickEditar = (reserva) => {
    const { cancha_id, nro_cancha, precio, usuario_id } = reserva;
    navigate(
      `${rutaReservarTurno}/${cancha_id}/${nro_cancha}/${precio}/${usuario_id}`
    );
  };

  const handleClickEliminar = async (reserva) => {
    setReservaEliminar(reserva);
    setModal(true);
  };

  useEffect(() => {
    // Calcular permisos para turnos
    const editarTurno = tienePermiso(
      accionesUsuarioDisponibles,
      accionesDisponibles.EDITAR_TURNO
    );
    const eliminarTurno = tienePermiso(
      accionesUsuarioDisponibles,
      accionesDisponibles.ELIMINAR_TURNO
    );

    // Actualizar los estados de los permisos
    setPuedeEditarTurno(editarTurno);
    setPuedeEliminarTurno(eliminarTurno);
  }, [accionesUsuarioDisponibles]);

  return (
    <Card className="h-full w-full">
      {modal && (
        <ModalEliminarReserva
          modal={modal}
          setModal={setModal}
          reservaEliminar={reservaEliminar}
        />
      )}
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography
              variant="h5"
              className="mt-5 font-black"
              color="blue-gray"
            >
              Listado de turnos {estadoSwitch ? "finalizados" : "disponibles"}
            </Typography>
          </div>
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <div className="w-full flex flex-col gap-2 md:w-72">
              <Input
                label="Filtrar Nro cancha"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={filtrarNroCancha}
                onChange={handleFiltrarNroCancha}
              />
              <Input
                label="Filtrar Fecha (a-m-d)"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={filtrarFecha}
                onChange={handleFiltrarFecha}
              />
              <CheckedSwitch
                color="blue"
                estadoSwitch={estadoSwitch}
                setEstadoSwitch={setEstadoSwitch}
                label={
                  estadoSwitch
                    ? "Ver turnos disponibles"
                    : "Ver turnos finalizados"
                }
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reservas.length > 0 ? (
              reservas.map(
                (
                  {
                    id,
                    cancha_id,
                    nro_cancha,
                    precio,
                    fecha,
                    start,
                    end,
                    usuario_id,
                  },
                  index
                ) => {
                  const isLast = index === reservas.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={index}>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {nro_cancha}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {parseFloat(precio).toLocaleString("es-AR", {
                            style: "currency",
                            currency: "ARS",
                          })}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {dayjs(fecha).format("YYYY-MM-DD")}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {dayjs(start).format("h:mm:ss A")}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {dayjs(end).format("h:mm:ss A")}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Editar Turno">
                          <IconButton
                            variant="text"
                            disabled={!puedeEditarTurno}
                            onClick={() =>
                              handleClickEditar({
                                id,
                                cancha_id,
                                nro_cancha,
                                precio,
                                fecha,
                                start,
                                end,
                                usuario_id,
                              })
                            }
                          >
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Eliminar Turno">
                          <IconButton
                            variant="text"
                            disabled={!puedeEliminarTurno}
                            onClick={() =>
                              handleClickEliminar({
                                id,
                                cancha_id,
                                nro_cancha,
                                precio,
                                fecha,
                                start,
                                end,
                                usuario_id,
                              })
                            }
                          >
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                }
              )
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center">
                  <Typography variant="small" color="blue-gray">
                    {errorMessage || "No hay reservas disponibles."}
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Button
          variant="outlined"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>
        <div className="flex items-center gap-2">
          {[...Array(totalPages).keys()].map((_, index) => (
            <IconButton
              key={index}
              variant={currentPage === index + 1 ? "outlined" : "text"}
              size="sm"
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </IconButton>
          ))}
        </div>
        <Button
          variant="outlined"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </Button>
      </CardFooter>
    </Card>
  );
}
