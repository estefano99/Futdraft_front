import React from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Drawer,
  Card,
} from "@material-tailwind/react";
import {
  BookmarkIcon,
  InboxIcon,
  PowerIcon,
  ClockIcon,
  UsersIcon,
  UserGroupIcon,
  GlobeAltIcon,
  UserCircleIcon,
  ChartBarIcon,
  RectangleStackIcon
} from "@heroicons/react/24/solid";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  rutaAdminTurnos,
  rutaGestionarCanchas,
  rutaGestionarGrupos,
  rutaGestionarHorarios,
  rutaGestionarTurnos,
  rutaGestionarUsuarios,
  rutaMiPerfil,
  rutaReportes,
  rutaSeleccionarCancha,
} from "../libs/constantes";
import { useAuth } from "../context/AuthProvider";
import { notifyError } from "../libs/funciones";

export function Sidebar() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const { logout, modulos } = useAuth();
  const navigate = useNavigate();

  const normalizeModuleName = (name) => name.toLowerCase().replace(/ /g, "-"); // Reemplaza espacios por guiones

  const moduleMap = {
    "gestionar-usuarios": {
      route: `${rutaGestionarUsuarios}`,
      icon: <UsersIcon className="h-5 w-5" />,
      label: "Usuarios",
    },
    "gestionar-horarios": {
      route: `${rutaGestionarHorarios}`,
      icon: <ClockIcon className="h-5 w-5" />,
      label: "Horarios",
    },
    "gestionar-grupos": {
      route: `${rutaGestionarGrupos}`,
      icon: <UserGroupIcon className="h-5 w-5" />,
      label: "Grupos",
    },
    "gestionar-canchas": {
      route: `${rutaGestionarCanchas}`,
      icon: <GlobeAltIcon className="h-5 w-5" />,
      label: "Canchas",
    },
    "gestionar-turnos": {
      route: `${rutaGestionarTurnos}`,
      icon: <BookmarkIcon className="h-5 w-5" />,
      label: "Mis turnos",
    },
    "reservar-turno-cliente": {
      route: `${rutaSeleccionarCancha}`,
      icon: <InboxIcon className="h-5 w-5" />,
      label: "Reservar turno",
    },
    "reportes": {
      route: `${rutaReportes}`,
      icon: <ChartBarIcon className="h-5 w-5" />,
      label: "Reportes",
    },
    "administrar-turnos": {
      route: `${rutaAdminTurnos}`,
      icon: <RectangleStackIcon className="h-5 w-5" />,
      label: "Administrar turnos",
    },
  };

  const modules = (modulos || []).map((modulo) =>
    normalizeModuleName(modulo.nombre)
  );
  // console.log(modulos)
  // console.log(modules)

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const handleLogout = async () => {
    try {
      const respuesta = await logout();
      if (respuesta) {
        navigate("/"); // Redirige al login después de cerrar sesión
      }
    } catch (error) {
      console.log(error);
      notifyError("Hubo un error al desconectarse");
    }
  };

  return (
    <>
      <IconButton variant="text" color="white" size="lg" onClick={openDrawer}>
        {isDrawerOpen ? (
          <XMarkIcon className="h-8 w-8 stroke-2" />
        ) : (
          <Bars3Icon className="h-8 w-8 stroke-2" />
        )}
      </IconButton>
      <Drawer open={isDrawerOpen} onClose={closeDrawer}>
        <Card
          color="transparent"
          shadow={false}
          className="h-[calc(100vh-2rem)] w-full p-4"
        >
          <div className="mb-2 flex items-center gap-4 p-4">
            <img
              src="https://docs.material-tailwind.com/img/logo-ct-dark.png"
              alt="brand"
              className="h-8 w-8"
            />
            <Typography variant="h5" color="blue-gray">
              FutDraft
            </Typography>
          </div>
          <List>
            <ListItem key="mi-perfil" onClick={() => navigate(rutaMiPerfil)}>
              <ListItemPrefix>
                <UserCircleIcon className="h-5 w-5" />
              </ListItemPrefix>
              Mi perfil
            </ListItem>
            {modules.map((module) => {
              const mappedModule = moduleMap[module];
              return (
                mappedModule && (
                  <ListItem
                    key={module}
                    onClick={() => navigate(mappedModule.route)}
                  >
                    <ListItemPrefix>{mappedModule.icon}</ListItemPrefix>
                    {mappedModule.label}
                  </ListItem>
                )
              );
            })}
            <hr className="my-2 border-blue-gray-50" />
            <ListItem onClick={handleLogout}>
              <ListItemPrefix>
                <PowerIcon className="h-5 w-5" />
              </ListItemPrefix>
              Log Out
            </ListItem>
          </List>
        </Card>
      </Drawer>
    </>
  );
}
