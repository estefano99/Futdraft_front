import {
  EllipsisHorizontalIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserGroupIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  Tooltip,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import {
  accionesDisponibles,
  tienePermiso,
} from "../../../libs/PermisosBotones";
import { useAuth } from "../../../context/AuthProvider";

export function MenuUsuarios({
  usuario,
  handleClickEditar,
  handleClickEliminar,
  handleClickVerAcciones,
  handleClickVerGrupos,
  handleClickResetearClave,
}) {
  const [open, setOpen] = useState(false);
  // Estados para las acciones de los permisos
  const [puedeEditarUsuario, setPuedeEditarUsuario] = useState(false);
  const [puedeEliminarUsuario, setPuedeEliminarUsuario] = useState(false);
  const [puedeVerAccionesUsuario, setPuedeVerAccionesUsuario] = useState(false);
  const [puedeVerGruposUsuario, setPuedeVerGruposUsuario] = useState(false);
  const [puedeResetearClave, setPuedeResetearClave] = useState(false);
  const { accionesUsuarioDisponibles } = useAuth();

  const toggleMenu = () => setOpen((prev) => !prev); // Alterna entre abrir y cerrar el menú
  const closeMenu = () => setOpen(false); // Cierra el menú

  useEffect(() => {
    if (accionesUsuarioDisponibles && accionesDisponibles) {
      setPuedeEditarUsuario(
        tienePermiso(
          accionesUsuarioDisponibles,
          accionesDisponibles.EDITAR_USUARO
        )
      );
      setPuedeEliminarUsuario(
        tienePermiso(
          accionesUsuarioDisponibles,
          accionesDisponibles.ELIMINAR_USUARO
        )
      );
      setPuedeVerAccionesUsuario(
        tienePermiso(
          accionesUsuarioDisponibles,
          accionesDisponibles.VER_ACCIONES_USUARIO
        )
      );
      setPuedeVerGruposUsuario(
        tienePermiso(
          accionesUsuarioDisponibles,
          accionesDisponibles.VER_GRUPOS_USUARO
        )
      );
      setPuedeResetearClave(
        tienePermiso(
          accionesUsuarioDisponibles,
          accionesDisponibles.RESETEAR_CLAVE_USUARO
        )
      );
    }
  }, [accionesUsuarioDisponibles, accionesDisponibles]);

  return (
    <Menu open={open} handler={setOpen}>
      <MenuHandler>
        <Tooltip content="Opciones">
          <Button variant="text" onClick={toggleMenu}>
            <EllipsisHorizontalIcon className="h-4 w-4" />
          </Button>
        </Tooltip>
      </MenuHandler>
      <MenuList>
        <MenuItem
          className={`flex ${
            !puedeEditarUsuario ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => {
            if (puedeEditarUsuario) {
              handleClickEditar(usuario);
              closeMenu();
            }
          }}
          disabled={!puedeEditarUsuario}
        >
          <PencilIcon className="h-4 w-4 text-blue-gray-500 mr-2" />
          Editar
        </MenuItem>
        <MenuItem
          className={`flex ${
            !puedeEliminarUsuario ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => {
            if (puedeEliminarUsuario) {
              handleClickEliminar(usuario);
              closeMenu();
            }
          }}
          disabled={!puedeEliminarUsuario}
        >
          <TrashIcon className="h-4 w-4 text-red-500 mr-2" />
          Eliminar
        </MenuItem>
        <MenuItem
          className={`flex ${
            !puedeVerAccionesUsuario ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => {
            if (puedeVerAccionesUsuario) {
              handleClickVerAcciones(usuario);
              closeMenu();
            }
          }}
          disabled={!puedeVerAccionesUsuario}
        >
          <EyeIcon className="h-4 w-4 text-blue-gray-500 mr-2" />
          Ver Acciones
        </MenuItem>
        <MenuItem
          className={`flex ${
            !puedeVerGruposUsuario ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => {
            if (puedeVerGruposUsuario) {
              handleClickVerGrupos(usuario);
              closeMenu();
            }
          }}
          disabled={!puedeVerGruposUsuario}
        >
          <UserGroupIcon className="h-4 w-4 text-blue-gray-500 mr-2" />
          Ver Grupos
        </MenuItem>
        <MenuItem
          className={`flex ${
            !puedeResetearClave ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => {
            if (puedeResetearClave) {
              handleClickResetearClave(usuario);
              closeMenu();
            }
          }}
          disabled={!puedeResetearClave}
        >
          <ArrowPathIcon className="h-4 w-4 text-blue-gray-500 mr-2" />
          Resetear clave
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
