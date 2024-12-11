import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { notifyError } from "../../libs/funciones";
import { DialogBody, Typography } from "@material-tailwind/react";

const GruposPerfil = () => {
  const { listadoGruposUsuarioById, user } = useAuth();
  const [gruposPerfil, setGruposPerfil] = useState([]);

  const obtenerGrupos = async () => {
    try {
      const respuesta = await listadoGruposUsuarioById(user);
      console.log(respuesta);
      setGruposPerfil(respuesta);
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
    obtenerGrupos();
  }, []);

  return (
    <div className="bg-white rounded-lg">
      <Typography
        variant="h3"
        color="blue-gray"
        className="text-blue-700 font-semibold p-4"
      >Grupos a los que perteneces</Typography>
      <DialogBody className="flex-grow overflow-y-auto p-4">
        {gruposPerfil.length > 0
          ? gruposPerfil.map((grupo) => (
              <div
                key={grupo.id}
                className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm"
              >
                <Typography
                  variant="h6"
                  color="blue-gray"
                  className="text-blue-700 font-semibold"
                >
                  codigo: {grupo.codigo}
                </Typography>
                <Typography
                  variant="h6"
                  color="blue-gray"
                  className="text-blue-700 font-semibold"
                >
                  nombre: {grupo.nombre}
                </Typography>
                <Typography
                  variant="h6"
                  color="blue-gray"
                  className="text-blue-700 font-semibold"
                >
                  descripcion: {grupo.descripcion}
                </Typography>
                <Typography
                  variant="h6"
                  color="blue-gray"
                  className="text-blue-700 font-semibold"
                >
                  estado: {grupo.estado}
                </Typography>
              </div>
            ))
          : "No se encontraron grupos"}
      </DialogBody>
    </div>
  );
};

export default GruposPerfil;
