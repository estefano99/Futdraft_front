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
  Accordion,
  AccordionHeader,
  AccordionBody,
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
  RectangleStackIcon,
  TagIcon,
  ClipboardDocumentIcon,
  WrenchIcon,
  ClipboardDocumentCheckIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  rutaAdminTurnos,
  rutaAuditoriaLog,
  rutaAuditoriaMantenimiento,
  rutaAuditoriaReserva,
  rutaGestionarCanchas,
  rutaGestionarGrupos,
  rutaGestionarHorarios,
  rutaGestionarTurnos,
  rutaGestionarUsuarios,
  rutaMantenimiento,
  rutaMiPerfil,
  rutaReportes,
  rutaSeleccionarCancha,
  rutaTareas,
  rutaTipoMantenimiento,
} from "../libs/constantes";
import { useAuth } from "../context/AuthProvider";
import { notifyError } from "../libs/funciones";

export function Sidebar() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [openGroupTurnos, setOpenGroupTurnos] = React.useState(0);
  const [openGroupMantenimiento, setOpenGroupMantenimiento] = React.useState(0);
  const [openGroupAuditoria, setOpenGroupAuditoria] = React.useState(0);
  const [openGroupReportes, setOpenGroupReportes] = React.useState(0);
  const [openGroupSeguridad, setOpenGroupSeguridad] = React.useState(0);
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
    "gestionar-tipos-mantenimiento": {
      route: `${rutaTipoMantenimiento}`,
      icon: <TagIcon className="h-5 w-5" />,
      label: "Tipos mantenimiento",
    },
    "gestionar-mantenimientos": {
      route: `${rutaMantenimiento}`,
      icon: <WrenchIcon className="h-5 w-5" />,
      label: "Mantenimientos",
    },
    "gestionar-tareas": {
      route: `${rutaTareas}`,
      icon: <ClipboardDocumentIcon className="h-5 w-5" />,
      label: "Tareas",
    },
    "auditoria-log": {
      route: `${rutaAuditoriaLog}`,
      icon: <ClipboardDocumentCheckIcon className="h-5 w-5" />,
      label: "Auditoria de log",
    },
    "auditoria-mantenimiento": {
      route: `${rutaAuditoriaMantenimiento}`,
      icon: <ClipboardDocumentCheckIcon className="h-5 w-5" />,
      label: "Auditoria de mantenimiento",
    },
    "auditoria-turnos": {
      route: `${rutaAuditoriaReserva}`,
      icon: <ClipboardDocumentCheckIcon className="h-5 w-5" />,
      label: "Auditoria de turnos",
    },
  };

  const modules = (modulos || []).map((modulo) =>
    normalizeModuleName(modulo.nombre)
  );
  // console.log(modulos)
  // console.log(modules)

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const handleGroupTurnos = (value) => {
    setOpenGroupTurnos(openGroupTurnos === value ? 0 : value);
    setOpenGroupMantenimiento(0);
    setOpenGroupSeguridad(0);
    setOpenGroupAuditoria(0);
    setOpenGroupReportes(0);
  };
  const handleGroupMantenimiento = (value) => {
    setOpenGroupMantenimiento(openGroupMantenimiento === value ? 0 : value);
    setOpenGroupTurnos(0);
    setOpenGroupSeguridad(0);
    setOpenGroupAuditoria(0);
    setOpenGroupReportes(0);
  };
  const handleGroupSeguridad = (value) => {
    setOpenGroupSeguridad(openGroupSeguridad === value ? 0 : value);
    setOpenGroupTurnos(0);
    setOpenGroupMantenimiento(0);
    setOpenGroupAuditoria(0);
    setOpenGroupReportes(0);
  };
  const handleGroupAuditoria = (value) => {
    setOpenGroupAuditoria(openGroupAuditoria === value ? 0 : value);
    setOpenGroupTurnos(0);
    setOpenGroupMantenimiento(0);
    setOpenGroupSeguridad(0);
    setOpenGroupReportes(0);
  };
  const handleGroupReportes = (value) => {
    setOpenGroupReportes(openGroupReportes === value ? 0 : value);
    setOpenGroupTurnos(0);
    setOpenGroupMantenimiento(0);
    setOpenGroupSeguridad(0);
    setOpenGroupAuditoria(0);
  };

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
            {/* Grupo: turnos, (Primera iteracion)*/}
            <Accordion
              open={openGroupTurnos === 1}
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`mx-auto h-4 w-4 transition-transform ${
                    openGroupTurnos === 1 ? "rotate-180" : ""
                  }`}
                />
              }
            >
              <ListItem className="p-0" selected={openGroupTurnos === 1}>
                <AccordionHeader
                  onClick={() => handleGroupTurnos(1)}
                  className="border-b-0 p-3"
                >
                  <Typography color="blue-gray" className="mr-auto font-normal">
                    Turnos
                  </Typography>
                </AccordionHeader>
              </ListItem>
              <AccordionBody className="py-1">
                <List className="p-0">
                  {modules
                    .filter((module) =>
                      [
                        "gestionar-canchas",
                        "gestionar-horarios",
                        "reservar-turno-cliente",
                        "gestionar-turnos",
                        "administrar-turnos",
                      ].includes(module)
                    )
                    .map((module) => {
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
                </List>
              </AccordionBody>
            </Accordion>
            {/* Grupo: Mantenimiento (Segunda iteracion) */}
            <Accordion
              open={openGroupMantenimiento === 1}
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`mx-auto h-4 w-4 transition-transform ${
                    openGroupMantenimiento === 1 ? "rotate-180" : ""
                  }`}
                />
              }
            >
              <ListItem className="p-0" selected={openGroupMantenimiento === 1}>
                <AccordionHeader
                  onClick={() => handleGroupMantenimiento(1)}
                  className="border-b-0 p-3"
                >
                  <Typography color="blue-gray" className="mr-auto font-normal">
                    Mantenimiento
                  </Typography>
                </AccordionHeader>
              </ListItem>
              <AccordionBody className="py-1">
                <List className="p-0">
                  {modules
                    .filter((module) =>
                      [
                        "gestionar-tipos-mantenimiento",
                        "gestionar-mantenimientos",
                        "gestionar-tareas",
                      ].includes(module)
                    )
                    .map((module) => {
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
                </List>
              </AccordionBody>
            </Accordion>
            {/* Grupo: Modulo de seguridad */}
            <Accordion
              open={openGroupSeguridad === 1}
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`mx-auto h-4 w-4 transition-transform ${
                    openGroupSeguridad === 1 ? "rotate-180" : ""
                  }`}
                />
              }
            >
              <ListItem className="p-0" selected={openGroupSeguridad === 1}>
                <AccordionHeader
                  onClick={() => handleGroupSeguridad(1)}
                  className="border-b-0 p-3"
                >
                  <Typography color="blue-gray" className="mr-auto font-normal">
                    Usuarios / Grupos
                  </Typography>
                </AccordionHeader>
              </ListItem>
              <AccordionBody className="py-1">
                <List className="p-0">
                  {modules
                    .filter((module) =>
                      ["gestionar-usuarios", "gestionar-grupos"].includes(
                        module
                      )
                    )
                    .map((module) => {
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
                </List>
              </AccordionBody>
            </Accordion>
            {/* Grupo: Reportes */}
            <Accordion
              open={openGroupReportes === 1}
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`mx-auto h-4 w-4 transition-transform ${
                    openGroupReportes === 1 ? "rotate-180" : ""
                  }`}
                />
              }
            >
              <ListItem className="p-0" selected={openGroupReportes === 1}>
                <AccordionHeader
                  onClick={() => handleGroupReportes(1)}
                  className="border-b-0 p-3"
                >
                  <Typography color="blue-gray" className="mr-auto font-normal">
                    Reportes
                  </Typography>
                </AccordionHeader>
              </ListItem>
              <AccordionBody className="py-1">
                <List className="p-0">
                  {modules
                    .filter((module) => ["reportes"].includes(module))
                    .map((module) => {
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
                </List>
              </AccordionBody>
            </Accordion>
            {/* Grupo: Auditoria */}
            <Accordion
              open={openGroupAuditoria === 1}
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`mx-auto h-4 w-4 transition-transform ${
                    openGroupAuditoria === 1 ? "rotate-180" : ""
                  }`}
                />
              }
            >
              <ListItem className="p-0" selected={openGroupAuditoria === 1}>
                <AccordionHeader
                  onClick={() => handleGroupAuditoria(1)}
                  className="border-b-0 p-3"
                >
                  <Typography color="blue-gray" className="mr-auto font-normal">
                    Auditorias
                  </Typography>
                </AccordionHeader>
              </ListItem>
              <AccordionBody className="py-1">
                <List className="p-0">
                  {modules
                    .filter((module) => ["auditoria-log", "auditoria-mantenimiento", "auditoria-turnos"].includes(module))
                    .map((module) => {
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
                </List>
              </AccordionBody>
            </Accordion>
            {/* {modules.map((module) => {
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
            })} */}
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
