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
} from "@heroicons/react/24/solid";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  rutaGeneral,
  rutaGeneralAdmin,
  rutaGestionarHorarios,
  rutaAuthLogout
} from "../libs/constantes";
import { useAuth } from "../context/AuthProvider";

export function Sidebar() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const { user, logout, setUser, setIsLoading, setErrorAuth } = useAuth();
  const navigate = useNavigate();

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const handleLogout = async () => {
    try {
      const respuesta = await logout();
      if (respuesta) {
        navigate("/"); // Redirige al login después de cerrar sesión
      }
    } catch (error) {
      console.log("Hubo un error al desconectarse")
    }
  }

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
            {user?.tipo_usuario === "admin" && (
              <>
                <ListItem onClick={() => navigate(rutaGeneralAdmin)}>
                  <ListItemPrefix>
                    <InboxIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Canchas
                </ListItem>
                <ListItem onClick={() => navigate(rutaGestionarHorarios)}>
                  <ListItemPrefix>
                    <ClockIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Horarios
                </ListItem>
              </>
            )}
            {user?.tipo_usuario === "cliente" && (
              <ListItem onClick={() => navigate(rutaGeneral)}>
                <ListItemPrefix>
                  <BookmarkIcon className="h-5 w-5" />
                </ListItemPrefix>
                Turnos
              </ListItem>
            )}
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
