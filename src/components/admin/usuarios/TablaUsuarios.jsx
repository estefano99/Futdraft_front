import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  CardFooter,
  IconButton,
  Input,
} from "@material-tailwind/react";
import { useCallback, useEffect, useState } from "react";
import {
  notifyError,
  notifySuccess,
  useDebounce,
} from "../../../libs/funciones";
import { CheckedSwitch } from "../../CheckedSwitch";
import { ModalVerAcciones } from "./ModalVerAcciones";
import { useAuth } from "../../../context/AuthProvider";
import { MenuUsuarios } from "./MenuUsuarios";
import {ModalVerGrupos} from "./ModalVerGrupos";
import ModalEliminarUsuario from "./ModalEliminarUsuario";
import ModalResetearClave from "./ModalResetearClave";

const TABLE_HEAD = [
  "nombre",
  "apellido",
  "dni",
  "email",
  "telefono",
  "estado",
  "acciones",
];

export function TablaUsuarios({ setOpenDrawer, setUsuarioEditar }) {
  const {
    usuarios,
    listadoUsuarios,
    cargando,
    listadoAccionesUsuarioById,
    listadoGruposUsuarioById,
  } = useAuth();
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [filtrarApellido, setFiltrarApellido] = useState("");
  const [filtrarNombre, setFiltrarNombre] = useState("");
  const [estadoSwitch, setEstadoSwitch] = useState(true);
  const [modal, setModal] = useState(false);
  const [modalVerAcciones, setModalVerAcciones] = useState(false);
  const [modalVerGrupos, setModalVerGrupos] = useState(false);
  const [modalResetearClave, setModalResetearClave] = useState(false);
  const [usuarioResetearClave, setUsuarioResetearClave] = useState(null); //Tiene el usuario para mandar a resetear la clave
  const [usuarioEliminar, setUsuarioEliminar] = useState(null);
  const [accionesUsuario, setAccionesUsuario] = useState([]); //Visualiza las acciones del grupo al clickear en el boton ver acciones
  const [gruposUsuario, setGruposUsuario] = useState([]); //Visualiza los grupos asociados al usario al clickear en ver grupos dentro del menu

  //Retrasa la peticion a la api en la escritura de los filtros.
  const debounceNombre = useDebounce(filtrarNombre, 300);
  const debounceApellido = useDebounce(filtrarApellido, 300);

  const handleClickResetearClave = async (usuario) => {
    setUsuarioResetearClave(usuario);
    setModalResetearClave(true);
  }

  const handleClickEliminar = async (usuario) => {
    setUsuarioEliminar(usuario);
    setModal(true);
  };

  const handleClickEditar = (usuario) => {
    console.log(usuario)
    setUsuarioEditar(usuario);
    setOpenDrawer(true);
  };

  const handleClickVerAcciones = async (usuario) => {
    try {
      const respuesta = await listadoAccionesUsuarioById(usuario);
      setAccionesUsuario(respuesta);
      setModalVerAcciones(true);
    } catch (error) {
      console.log(error);
      setModalVerGrupos(false);
      notifyError(error.response.data.message || "Error al obtener acciones");
    }
  };

  const handleClickVerGrupos = async (usuario) => {
    try {
      const respuesta = await listadoGruposUsuarioById(usuario);
      setGruposUsuario(respuesta);
      setModalVerGrupos(true);
    } catch (error) {
      console.log(error);
      setModalVerGrupos(false);
      notifyError(error.response.data.message || "Error al obtener grupos");
    }
  };

  const respuestaUsuarios = useCallback(async () => {
    try {
      await listadoUsuarios(
        currentPage,
        setTotalPages,
        estadoSwitch,
        debounceNombre,
        debounceApellido
      );
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message || "Error al cargar usuarios"
      );
    }
  }, [currentPage, estadoSwitch, debounceNombre, debounceApellido]);

  const handleFiltrarNombre = (e) => {
    setFiltrarNombre(e.target.value);
    setCurrentPage(1);
  };

  const handleFiltrarApellido = (e) => {
    setFiltrarApellido(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    respuestaUsuarios();
  }, [currentPage, estadoSwitch, debounceNombre, debounceApellido]);

  return (
    <Card className="h-full w-full">
      {modal && (
        <ModalEliminarUsuario
          modal={modal}
          setModal={setModal}
          usuarioEliminar={usuarioEliminar}
        />
      )}
      {modalVerAcciones && (
        <ModalVerAcciones
          modalVerAcciones={modalVerAcciones}
          setModalVerAcciones={setModalVerAcciones}
          accionesUsuario={accionesUsuario}
        />
      )}
      {modalVerGrupos && (
        <ModalVerGrupos
          modalVerGrupos={modalVerGrupos}
          setModalVerGrupos={setModalVerGrupos}
          gruposUsuario={gruposUsuario}
        />
      )}
      {modalResetearClave && (
        <ModalResetearClave
          modalResetearClave={modalResetearClave}
          setModalResetearClave={setModalResetearClave}
          usuarioResetearClave={usuarioResetearClave}
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
              Listado de usuarios {estadoSwitch ? "activos" : "inactivos"}
            </Typography>
          </div>
          <div className="flex w-full flex-col shrink-0 gap-2 md:w-max ">
            <div className="w-full md:w-full flex gap-2 ">
              <Input
                label="Filtrar por nombre..."
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={filtrarNombre}
                onChange={handleFiltrarNombre}
              />
              <Input
                label="Filtrar por apellido..."
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={filtrarApellido}
                onChange={handleFiltrarApellido}
              />
            </div>
            <CheckedSwitch
              color="blue"
              estadoSwitch={estadoSwitch}
              setEstadoSwitch={setEstadoSwitch}
              label={
                estadoSwitch ? "Ver usuarios Inactivos" : "Ver usuarios activos"
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
            {cargando ? (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  Cargando usuarios...
                </td>
              </tr>
            ) : usuarios.length > 0 ? (
              usuarios.map(
                (
                  { id, nombre, apellido, dni, email, nro_celular, estado },
                  index
                ) => {
                  const isLast = index === usuarios.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  const usuario = {
                    id,
                    nombre,
                    apellido,
                    dni,
                    email,
                    nro_celular,
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
                            {apellido}
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
                            {dni ?? "-"}
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
                            {email}
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
                            {nro_celular ?? "-"}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {String(estado)}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <MenuUsuarios
                          usuario={usuario}
                          handleClickEditar={handleClickEditar}
                          handleClickEliminar={handleClickEliminar}
                          handleClickVerAcciones={handleClickVerAcciones}
                          handleClickVerGrupos={handleClickVerGrupos}
                          handleClickResetearClave={handleClickResetearClave}
                        />
                      </td>
                    </tr>
                  );
                }
              )
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center">
                  <Typography variant="small" color="blue-gray">
                    {errorMessage || "No hay usuarios disponibles."}
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
