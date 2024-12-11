import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { notifyError } from "../../libs/funciones";
import { DialogBody, Typography } from "@material-tailwind/react";

const AccionesPerfil = () => {
  const { listadoAccionesUsuarioById, user } = useAuth();
  const [accionesPerfil, setAccionesPerfil] = useState([]);

  const obtenerAcciones = async () => {
    try {
      const respuesta = await listadoAccionesUsuarioById(user);
      console.log(respuesta);
      setAccionesPerfil(respuesta);
    } catch (error) {
      console.log(error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        notifyError(error.response.data.messag);
        return;
      }
      notifyError("Hubo un error al cargar los grupos");
      return;
    }
  };

  useEffect(() => {
    obtenerAcciones();
  }, []);
  return (
    <div className="bg-white rounded-lg">
      <Typography
        variant="h3"
        color="blue-gray"
        className="text-blue-700 font-semibold p-4"
      >
        Acciones disponibles
      </Typography>
      <DialogBody className="flex-grow overflow-y-auto p-4">
        {accionesPerfil.map((modulo) => (
          <div key={modulo.id} className="border rounded-lg p-4 mb-4">
            <Typography variant="h6" color="blue-gray">
              {modulo.nombre}
            </Typography>
            {modulo.formularios.map((formulario) => (
              <div key={formulario.id} className="ml-4">
                <Typography variant="h6" color="blue-gray" className="mt-2">
                  {formulario.nombre}
                </Typography>
                <ul className="ml-4">
                  {formulario.acciones.map((accion) => (
                    <li key={accion.id} className="flex items-center gap-2">
                      <Typography
                        variant="h6"
                        color="blue-gray"
                        className="text-blue-700 font-semibold"
                      >
                        {accion.nombre}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </DialogBody>
    </div>
  );
};

export default AccionesPerfil;
