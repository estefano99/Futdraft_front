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
import { useDebounce } from "../../../libs/funciones";
import ModalEliminarTipo from "./ModalEliminarTipo";
import {
  accionesDisponibles,
  tienePermiso,
} from "../../../libs/PermisosBotones";
import { useAuth } from "../../../context/AuthProvider";
import { useTipoMantenimiento } from "../../../context/TipoMantProvider";

const TABLE_HEAD = ["Descripcion", "Acciones"];

export function TablaTiposMant({ setOpenDrawer, setTipoMantenimientoEditar }) {
  const { tiposMantenimiento, listadoTipoMantenimientos } =
    useTipoMantenimiento();
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState(""); // Estado para el mensaje de error
  const [filtrarDescripcion, setFiltrarDescripcion] = useState(""); //Guarda el filtrado de descripcion
  const [modal, setModal] = useState(false);
  const [tipoEliminar, setTipoEliminar] = useState(null);
  const { accionesUsuarioDisponibles } = useAuth();
  const [puedeEditarHorario, setPuedeEditarHorario] = useState(false);
  const [puedeEliminarHorario, setPuedeEliminarHorario] = useState(false);

  //Retrasa la peticion a la api en la escritura de los filtros.
  const debounceDescripcion = useDebounce(filtrarDescripcion, 300);

  const handleClickEliminar = async (tipo) => {
    setTipoEliminar(tipo);
    setModal(true);
  };

  const handleClickEditar = (tipo) => {
    setTipoMantenimientoEditar(tipo);
    setOpenDrawer(true);
  };

  const respuestaTipos = async () => {
    try {
      await listadoTipoMantenimientos();
      // currentPage,
      // setTotalPages,
      // debounceDescripcion
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response.data.message);
    }
  };

  const handleFiltrarDescripcion = (e) => {
    setFiltrarDescripcion(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    respuestaTipos();
    return;
  }, [currentPage, debounceDescripcion]);

  useEffect(() => {
    // Calcular permisos para Tipos mantenimiento
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
        <ModalEliminarTipo
          modal={modal}
          setModal={setModal}
          tipoEliminar={tipoEliminar}
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
              Listado de Tipos de mantenimiento
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
            {tiposMantenimiento.length > 0 ? (
              tiposMantenimiento.map(({ id, descripcion }, index) => {
                const isLast = index === tiposMantenimiento.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                const horario = {
                  id,
                  descripcion,
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
              })
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center">
                  <Typography variant="small" color="blue-gray">
                    {errorMessage ||
                      "No hay tipos de mantenimiento disponibles."}
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
