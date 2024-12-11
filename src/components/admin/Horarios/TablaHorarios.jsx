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
import { useHorarios } from "../../../context/HorariosProvider";
import { useEffect, useState } from "react";
import {
  useDebounceFecha,
  useDebounceHoraApertura,
  useDebounceNroCancha,
} from "../../../libs/funciones";
import { CheckedSwitch } from "../../CheckedSwitch";
import ModalEliminarHorario from "./ModalEliminarHorario";
import {
  accionesDisponibles,
  tienePermiso,
} from "../../../libs/PermisosBotones";
import { useAuth } from "../../../context/AuthProvider";

const TABLE_HEAD = [
  "Nº cancha",
  "Precio",
  "Fecha (A-M-D)",
  "Hora Apertura",
  "Hora cierre",
  "Dur. turno",
  "Acciones",
];

export function TablaHorarios({ setOpenDrawer, setHorarioEditar }) {
  const { horarios, listadoHorarios } = useHorarios();
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState(""); // Estado para el mensaje de error
  const [filtrarNroCancha, setFiltrarNroCancha] = useState(""); //Guarda el filtrado de nroCancha
  const [filtrarFecha, setFiltrarFecha] = useState("");
  const [filtrarHoraApertura, setFiltrarHoraApertura] = useState("");
  const [estadoSwitch, setEstadoSwitch] = useState(false);
  const [modal, setModal] = useState(false);
  const [horarioEliminar, setHorarioEliminar] = useState(null);
  const { accionesUsuarioDisponibles } = useAuth();
  const [puedeEditarHorario, setPuedeEditarHorario] = useState(false);
  const [puedeEliminarHorario, setPuedeEliminarHorario] = useState(false);

  //Retrasa la peticion a la api en la escritura de los filtros.
  const debounceNroCancha = useDebounceNroCancha(filtrarNroCancha, 300);
  const debounceFecha = useDebounceFecha(filtrarFecha, 300);
  const debounceHoraApertura = useDebounceHoraApertura(
    filtrarHoraApertura,
    300
  );

  const handleClickEliminar = async (horario) => {
    setHorarioEliminar(horario);
    setModal(true);
  };

  const handleClickEditar = (horario) => {
    setHorarioEditar(horario);
    setOpenDrawer(true);
  };

  const respuestaHorarios = async () => {
    try {
      await listadoHorarios(
        currentPage,
        setTotalPages,
        debounceNroCancha,
        debounceFecha,
        debounceHoraApertura,
        estadoSwitch
      );
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const handleFiltrarNroCancha = (e) => {
    setFiltrarNroCancha(e.target.value);
    setCurrentPage(1);
  };

  const handleFiltrarFecha = (e) => {
    setFiltrarFecha(e.target.value);
    setCurrentPage(1);
  };

  const handleFiltrarHoraApertura = (e) => {
    setFiltrarHoraApertura(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    respuestaHorarios();
    return;
  }, [
    currentPage,
    debounceNroCancha,
    debounceFecha,
    debounceHoraApertura,
    estadoSwitch,
  ]);

  useEffect(() => {
    // Calcular permisos para horarios
    const editarHorario = tienePermiso(
      accionesUsuarioDisponibles,
      accionesDisponibles.EDITAR_HORARIO
    );
    const eliminarHorario = tienePermiso(
      accionesUsuarioDisponibles,
      accionesDisponibles.ELIMINAR_HORARIO
    );

    // Actualizar los estados de los permisos
    setPuedeEditarHorario(editarHorario);
    setPuedeEliminarHorario(eliminarHorario);
  }, [accionesUsuarioDisponibles]);

  return (
    <Card className="h-full w-full">
      {modal && (
        <ModalEliminarHorario
          modal={modal}
          setModal={setModal}
          horarioEliminar={horarioEliminar}
        />
      )}
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col flex-wrap justify-around md:flex-row gap-10 ">
          <div className="flex">
            <Typography
              variant="h5"
              className="mt-5 font-black"
              color="blue-gray"
            >
              Listado de horarios {estadoSwitch ? "finalizados" : "disponibles"}
            </Typography>
          </div>
          <div className="flex w-full flex-col shrink-0 gap-2 md:w-max ">
            <div className="w-full md:w-full flex gap-2 ">
              <Input
                label="Filtrar por nro cancha..."
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={filtrarNroCancha}
                onChange={handleFiltrarNroCancha}
              />
              <Input
                label="Filtrar por fecha..."
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={filtrarFecha}
                onChange={handleFiltrarFecha}
              />
              <Input
                label="Filtrar por hora apertura..."
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={filtrarHoraApertura}
                onChange={handleFiltrarHoraApertura}
              />
            </div>
            <CheckedSwitch
              color="blue"
              estadoSwitch={estadoSwitch}
              setEstadoSwitch={setEstadoSwitch}
              label={
                estadoSwitch
                  ? "Ver horarios disponibles"
                  : "Ver horarios finalizados"
              }
            />
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
            {horarios.length > 0 ? (
              horarios.map(
                (
                  {
                    id,
                    cancha_id,
                    nro_cancha,
                    precio,
                    fecha,
                    horario_apertura,
                    horario_cierre,
                    duracion_turno,
                  },
                  index
                ) => {
                  const isLast = index === horarios.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  const horario = {
                    id,
                    cancha_id,
                    nro_cancha,
                    precio,
                    fecha,
                    horario_apertura,
                    horario_cierre,
                    duracion_turno,
                  };

                  return (
                    <tr key={index}>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold"
                          >
                            {nro_cancha}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
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
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold"
                          >
                            {fecha}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {horario_apertura}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {horario_cierre}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {duracion_turno}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Editar Horario">
                          <IconButton
                            variant="text"
                            disabled={!puedeEditarHorario}
                            className={`${
                              !puedeEditarHorario
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => handleClickEditar(horario)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Eliminar Horario">
                          <IconButton
                            disabled={!puedeEliminarHorario}
                            className={`${
                              !puedeEliminarHorario
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            variant="text"
                            onClick={() => handleClickEliminar(horario)}
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
                <td colSpan="7" className="p-4 text-center">
                  <Typography variant="small" color="blue-gray">
                    {errorMessage || "No hay horarios disponibles."}
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
