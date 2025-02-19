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
import { CheckedSwitch } from "../../CheckedSwitch";
import ModalEliminarMantenimiento from "./ModalEliminarMantenimiento";
// import { ModalVerAcciones } from "./ModalVerAcciones";
import {
  accionesDisponibles,
  tienePermiso,
} from "../../../libs/PermisosBotones";
import { useAuth } from "../../../context/AuthProvider";
import { useMantenimiento } from "../../../context/MantenimientosProvider";
import { estados } from "../../../libs/estados";
import { ChipColor } from "./ChipColor";

const TABLE_HEAD = [
  "descripcion",
  "responsable",
  "fecha inicio",
  "fecha_fin",
  "estado",
  "tipo mantenimiento",
  "acciones",
];

export function TablaMantenimientos({ setOpenDrawer, setMantenimientoEditar }) {
  const { mantenimientos, listadoMantenimientos } = useMantenimiento();
  const { accionesUsuarioDisponibles } = useAuth();
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [filtrarDescripcion, setFiltrarDescripcion] = useState("");
  const [filtrarFecha, setFiltrarFecha] = useState("");
  const [filtrarEstado, setFiltrarEstado] = useState("");
  const [estadoSwitch, setEstadoSwitch] = useState(true);
  const [modal, setModal] = useState(false);
  const [modalVerAcciones, setModalVerAcciones] = useState(false);
  const [mantenimientoEliminar, setMantenimientoEliminar] = useState(null);
  const [accionesGrupo, setAccionesGrupo] = useState([]); //Visualiza las acciones del grupo al clickear en el boton ver acciones
  const [puedeEditarMantenimiento, setPuedeEditarMantenimiento] =
    useState(false);
  const [puedeEliminarMantenimiento, setPuedeEliminarMantenimiento] =
    useState(false);
  const [puedeVerAccionesGrupo, setPuedeVerAccionesGrupo] = useState(false);

  //Retrasa la peticion a la api en la escritura de los filtros.
  const debounceDescripcion = useDebounce(filtrarDescripcion, 300);
  const debounceFecha = useDebounce(filtrarFecha, 300);
  const debounceEstado = useDebounce(filtrarEstado, 300);

  const handleClickEliminar = async (mantenimiento) => {
    setMantenimientoEliminar(mantenimiento);
    setModal(true);
  };

  const handleClickEditar = (mantenimiento) => {
    setMantenimientoEditar(mantenimiento);
    setOpenDrawer(true);
  };

  const handleClickVerAcciones = async (grupo) => {
    try {
      const respuesta = await listadoAccionesGrupoById(grupo, setAccionesGrupo);
      setAccionesGrupo(respuesta);
      setModalVerAcciones(true);
    } catch (error) {
      console.log(error);
      notifyError(error.response.data.message);
    }
  };

  const respuestaMantenimientos = async () => {
    try {
      await listadoMantenimientos(
        currentPage,
        setTotalPages,
        debounceDescripcion,
        debounceFecha,
        debounceEstado
      );
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response.data.message);
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

  const handleFiltrarEstado = (e) => {
    setFiltrarEstado(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    respuestaMantenimientos();
    return;
  }, [
    currentPage,
    debounceDescripcion,
    debounceFecha,
    debounceEstado,
    estadoSwitch,
  ]);

  //Asignar permisos para los botones
  useEffect(() => {
    const puedeEditar = tienePermiso(
      accionesUsuarioDisponibles,
      accionesDisponibles.EDITAR_MANTENIMIENTO
    );
    const puedeEliminar = tienePermiso(
      accionesUsuarioDisponibles,
      accionesDisponibles.ELIMINAR_MANTENIMIENTO
    );
    const puedeVerAcciones = tienePermiso(
      accionesUsuarioDisponibles,
      accionesDisponibles.VER_ACCIONES_GRUPO
    );

    // Actualizar los estados
    setPuedeEditarMantenimiento(puedeEditar);
    setPuedeEliminarMantenimiento(puedeEliminar);
    setPuedeVerAccionesGrupo(puedeVerAcciones);
  }, [accionesUsuarioDisponibles]);

  return (
    <Card className="h-full w-full">
      {modal && (
        <ModalEliminarMantenimiento
          modal={modal}
          setModal={setModal}
          mantenimientoEliminar={mantenimientoEliminar}
        />
      )}
      {/* {modalVerAcciones && (
        <ModalVerAcciones
          modalVerAcciones={modalVerAcciones}
          setModalVerAcciones={setModalVerAcciones}
          accionesGrupo={accionesGrupo}
        />
      )} */}
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col flex-wrap justify-around md:flex-row gap-10 ">
          <div className="flex">
            <Typography
              variant="h5"
              className="mt-5 font-black"
              color="blue-gray"
            >
              Listado de mantenimientos
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
                label="Filtrar por fecha..."
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={filtrarFecha}
                onChange={handleFiltrarFecha}
              />
              <Input
                label="Filtrar por estado..."
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={filtrarEstado}
                onChange={handleFiltrarEstado}
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
            {mantenimientos.length > 0 ? (
              mantenimientos.map(
                (
                  {
                    id,
                    responsable,
                    descripcion,
                    fecha,
                    fecha_fin,
                    estado,
                    tipo_mantenimiento,
                  },
                  index
                ) => {
                  const isLast = index === mantenimientos.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  const mantenimiento = {
                    id,
                    responsable,
                    descripcion,
                    fecha,
                    fecha_fin,
                    estado,
                    tipo_mantenimiento,
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
                            {`${responsable.nombre} ${responsable.apellido}`}
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
                          {fecha_fin ?? "-"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <ChipColor
                          color={estados[estado]}
                          value={formatearEstado(estado)}
                        />
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold"
                          >
                            {tipo_mantenimiento
                              ? tipo_mantenimiento.descripcion
                              : "-"}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Editar Mantenimiento">
                          <IconButton
                            variant="text"
                            disabled={!puedeEditarMantenimiento}
                            onClick={() => handleClickEditar(mantenimiento)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Eliminar Mantenimiento">
                          <IconButton
                            variant="text"
                            disabled={!puedeEliminarMantenimiento}
                            onClick={() => handleClickEliminar(mantenimiento)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Ver Acciones">
                          <IconButton
                            variant="text"
                            disabled={!puedeVerAccionesGrupo}
                            onClick={() =>
                              handleClickVerAcciones(mantenimiento)
                            }
                          >
                            <EyeIcon className="h-4 w-4" />
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
                    {errorMessage || "No hay mantenimientos disponibles."}
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
