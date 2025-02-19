import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
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
import {
  formatearEstado,
  notifyError,
  useDebounce,
} from "../../../libs/funciones";
import ModalEliminarTarea from "./ModalEliminarTarea";
import {
  accionesDisponibles,
  tienePermiso,
} from "../../../libs/PermisosBotones";
import { useAuth } from "../../../context/AuthProvider";
import { useTareas } from "../../../context/TareasProvider";

const TABLE_HEAD = [
  "descripcion",
  "empleado",
  "mantenimiento",
  "fecha asignacion",
  "fecha completado",
  "acciones",
];

export function TablaTareas({ setOpenDrawer, setTareaEditar }) {
  const { tareas, listadoTareas } = useTareas();
  const { accionesUsuarioDisponibles } = useAuth();
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [filtrarDescripcion, setFiltrarDescripcion] = useState("");
  const [filtrarFecha, setFiltrarFecha] = useState("");
  const [filtrarMantenimiento, setFiltrarMantenimiento] = useState("");
  const [estadoSwitch, setEstadoSwitch] = useState(true);
  const [modal, setModal] = useState(false);
  const [tareaEliminar, setTareaEliminar] = useState(null);
  const [puedeEditarTarea, setPuedeEditarTarea] = useState(false);
  const [puedeEliminarTarea, setPuedeEliminarTarea] = useState(false);

  //Retrasa la peticion a la api en la escritura de los filtros.
  const debounceDescripcion = useDebounce(filtrarDescripcion, 300);
  const debounceFecha = useDebounce(filtrarFecha, 300);
  const debounceMantenimiento = useDebounce(filtrarMantenimiento, 300);

  const handleClickEliminar = async (tarea) => {
    setTareaEliminar(tarea);
    setModal(true);
  };

  const handleClickEditar = (tarea) => {
    setTareaEditar(tarea);
    setOpenDrawer(true);
  };

  const respuestaTareas = async () => {
    try {
      await listadoTareas(
        currentPage,
        setTotalPages,
        debounceDescripcion,
        debounceFecha,
        debounceMantenimiento
      );
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response?.data?.message || "Error desconocido");
    }
  };

  const handleFiltrarDescripcion = (e) => {
    setFiltrarDescripcion(e.target.value);
    setCurrentPage(1);
  };

  const handleFiltrarFecha = (e) => {
    setFiltrarFecha(e.target.value);
    setCurrentPage(1);
  };

  const handleFiltrarMantenimiento = (e) => {
    setFiltrarMantenimiento(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    respuestaTareas();
    return;
  }, [
    currentPage,
    debounceDescripcion,
    debounceFecha,
    debounceMantenimiento,
    estadoSwitch,
  ]);

  //Asignar permisos para los botones
  useEffect(() => {
    const puedeEditar = tienePermiso(
      accionesUsuarioDisponibles,
      accionesDisponibles.EDITAR_TAREA
    );
    const puedeEliminar = tienePermiso(
      accionesUsuarioDisponibles,
      accionesDisponibles.ELIMINAR_TAREA
    );

    // Actualizar los estados
    setPuedeEditarTarea(puedeEditar);
    setPuedeEliminarTarea(puedeEliminar);
  }, [accionesUsuarioDisponibles]);

  return (
    <Card className="h-full w-full">
      {modal && (
        <ModalEliminarTarea
          modal={modal}
          setModal={setModal}
          tareaEliminar={tareaEliminar}
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
              Listado de tareas
            </Typography>
          </div>
          <div className="flex w-full flex-col shrink-0 gap-2 md:w-max ">
            <div className="w-full md:w-full flex gap-2 ">
              <Input
                label="Filtrar por descripcion..."
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={filtrarDescripcion}
                onChange={handleFiltrarDescripcion}
              />
              <Input
                label="Filtrar por fecha asignacion..."
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={filtrarFecha}
                onChange={handleFiltrarFecha}
              />
              <Input
                label="Filtrar por mantenimiento..."
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={filtrarMantenimiento}
                onChange={handleFiltrarMantenimiento}
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
            {tareas.length > 0 ? (
              tareas.map(
                (
                  {
                    id,
                    descripcion,
                    empleado,
                    mantenimiento,
                    fecha_asignacion,
                    fecha_completado,
                    acciones,
                  },
                  index
                ) => {
                  const isLast = index === tareas.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  const tarea = {
                    id,
                    descripcion,
                    empleado,
                    mantenimiento,
                    fecha_asignacion,
                    fecha_completado,
                    acciones,
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
                            {descripcion}
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
                            {`${empleado.nombre} ${empleado.apellido}`}
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
                            {mantenimiento.descripcion}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {fecha_asignacion}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {fecha_completado ?? "-"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Editar Tarea">
                          <IconButton
                            variant="text"
                            disabled={!puedeEditarTarea}
                            onClick={() => handleClickEditar(tarea)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Eliminar Mantenimiento">
                          <IconButton
                            variant="text"
                            disabled={!puedeEliminarTarea}
                            onClick={() => handleClickEliminar(tarea)}
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
                    {errorMessage || "No hay tareas disponibles."}
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
