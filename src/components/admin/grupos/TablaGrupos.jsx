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
import { useEffect, useMemo, useState } from "react";
import { notifyError, useDebounce } from "../../../libs/funciones";
import { CheckedSwitch } from "../../CheckedSwitch";
import { useGrupos } from "../../../context/GruposProvider";
import ModalEliminarGrupo from "./ModalEliminarGrupo";
import { ModalVerAcciones } from "./ModalVerAcciones";
import {
  accionesDisponibles,
  tienePermiso,
} from "../../../libs/PermisosBotones";
import { useAuth } from "../../../context/AuthProvider";

const TABLE_HEAD = ["codigo", "nombre", "descripcion", "estado", "acciones"];

export function TablaGrupos({ setOpenDrawer, setGrupoEditar }) {
  const { grupos, listadoGrupos, listadoAccionesGrupoById } = useGrupos();
  const { accionesUsuarioDisponibles } = useAuth();
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [filtrarCodigo, setFiltrarCodigo] = useState("");
  const [filtrarNombre, setFiltrarNombre] = useState("");
  const [estadoSwitch, setEstadoSwitch] = useState(true);
  const [modal, setModal] = useState(false);
  const [modalVerAcciones, setModalVerAcciones] = useState(false);
  const [grupoEliminar, setGrupoEliminar] = useState(null);
  const [accionesGrupo, setAccionesGrupo] = useState([]); //Visualiza las acciones del grupo al clickear en el boton ver acciones
  const [puedeEditarGrupo, setPuedeEditarGrupo] = useState(false);
  const [puedeEliminarGrupo, setPuedeEliminarGrupo] = useState(false);
  const [puedeVerAccionesGrupo, setPuedeVerAccionesGrupo] = useState(false);

  //Retrasa la peticion a la api en la escritura de los filtros.
  const debounceCodigo = useDebounce(filtrarCodigo, 300);
  const debounceNombre = useDebounce(filtrarNombre, 300);

  const handleClickEliminar = async (grupo) => {
    setGrupoEliminar(grupo);
    setModal(true);
  };

  const handleClickEditar = (grupo) => {
    setGrupoEditar(grupo);
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

  const respuestaGrupos = async () => {
    try {
      await listadoGrupos(
        currentPage,
        setTotalPages,
        estadoSwitch,
        debounceCodigo,
        debounceNombre
      );
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response.data.message);
    }
  };

  const handleFiltrarCodigo = (e) => {
    setFiltrarCodigo(e.target.value);
    setCurrentPage(1);
  };

  const handleFiltrarNombre = (e) => {
    setFiltrarNombre(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    respuestaGrupos();
    return;
  }, [currentPage, debounceCodigo, debounceNombre, estadoSwitch]);

  //Asignar permisos para los botones
  useEffect(() => {
    const puedeEditar = tienePermiso(
      accionesUsuarioDisponibles,
      accionesDisponibles.EDITAR_GRUPO
    );
    const puedeEliminar = tienePermiso(
      accionesUsuarioDisponibles,
      accionesDisponibles.ELIMINAR_GRUPO
    );
    const puedeVerAcciones = tienePermiso(
      accionesUsuarioDisponibles,
      accionesDisponibles.VER_ACCIONES_GRUPO
    );

    // Actualizar los estados
    setPuedeEditarGrupo(puedeEditar);
    setPuedeEliminarGrupo(puedeEliminar);
    setPuedeVerAccionesGrupo(puedeVerAcciones);
  }, [accionesUsuarioDisponibles]);

  return (
    <Card className="h-full w-full">
      {modal && (
        <ModalEliminarGrupo
          modal={modal}
          setModal={setModal}
          grupoEliminar={grupoEliminar}
        />
      )}
      {modalVerAcciones && (
        <ModalVerAcciones
          modalVerAcciones={modalVerAcciones}
          setModalVerAcciones={setModalVerAcciones}
          accionesGrupo={accionesGrupo}
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
              Listado de grupos {estadoSwitch ? "activos" : "inactivos"}
            </Typography>
          </div>
          <div className="flex w-full flex-col shrink-0 gap-2 md:w-max ">
            <div className="w-full md:w-full flex gap-2 ">
              <Input
                label="Filtrar por codigo..."
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={filtrarCodigo}
                onChange={handleFiltrarCodigo}
              />
              <Input
                label="Filtrar por nombre..."
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={filtrarNombre}
                onChange={handleFiltrarNombre}
              />
            </div>
            <CheckedSwitch
              color="blue"
              estadoSwitch={estadoSwitch}
              setEstadoSwitch={setEstadoSwitch}
              label={
                estadoSwitch ? "Ver grupos Inactivos" : "Ver grupos activos"
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
            {grupos.length > 0 ? (
              grupos.map(
                ({ id, codigo, nombre, descripcion, estado }, index) => {
                  const isLast = index === grupos.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  const grupo = {
                    id,
                    codigo,
                    nombre,
                    descripcion,
                    estado,
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
                            {codigo}
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
                            {nombre}
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
                            {descripcion}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {estado}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Editar Grupo">
                          <IconButton
                            variant="text"
                            disabled={!puedeEditarGrupo}
                            onClick={() => handleClickEditar(grupo)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Eliminar Grupo">
                          <IconButton
                            variant="text"
                            disabled={!puedeEliminarGrupo}
                            onClick={() => handleClickEliminar(grupo)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Ver Acciones">
                          <IconButton
                            variant="text"
                            disabled={!puedeVerAccionesGrupo}
                            onClick={() => handleClickVerAcciones(grupo)}
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
                    {errorMessage || "No hay grupos disponibles."}
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
