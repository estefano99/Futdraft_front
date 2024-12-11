import { useEffect, useState } from "react";
import {
  Drawer,
  Button,
  Typography,
  IconButton,
  Input,
} from "@material-tailwind/react";
import { Controller, useForm } from "react-hook-form";
import { useGrupos } from "../../../context/GruposProvider";
import { SelectEstado } from "../SelectEstado";
import { notifyError, notifySuccess } from "../../../libs/funciones";

export function DrawerGrupo({
  setAlert,
  openDrawer,
  setOpenDrawer,
  grupoEditar,
  setGrupoEditar,
}) {
  const {
    crearGrupo,
    editarGrupo,
    listadoModulosAccionesOrganizadas,
    listadoAccionesGrupoById,
  } = useGrupos();
  const [modulosAccionesAsignadas, setModulosAccionesAsignadas] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const handleOpenDrawer = () => {
    setOpenDrawer(true);
  };

  const respuestaGruposJoin = async () => {
    if (grupoEditar) {
      // Cargar datos del grupo (incluyendo las acciones asociadas)
      const accionesGrupo = await listadoAccionesGrupoById(grupoEditar); // Obtén las acciones por grupo
      const modulos = await listadoModulosAccionesOrganizadas(); // Todas las acciones organizadas

      // Crear un conjunto de IDs de acciones del grupo unicos con el set, y con flatMap para obtener un array de IDs, aplana los array anidadados en un solo array
      const accionesGrupoIds = new Set(
        accionesGrupo.flatMap((accionGrupo) =>
          accionGrupo.formularios.flatMap((formularioGrupo) =>
            formularioGrupo.acciones.map(
              (accionGrupoDetalle) => accionGrupoDetalle.id
            )
          )
        )
      );

      const modulosActualizados = modulos.map((modulo) => ({
        ...modulo,
        formularios: modulo.formularios.map((formulario) => ({
          ...formulario,
          acciones: formulario.acciones.map((accion) => ({
            ...accion,
            checked: accionesGrupoIds.has(accion.id),
          })),
        })),
      }));
      setModulosAccionesAsignadas(modulosActualizados);

      reset({
        codigo: grupoEditar.codigo,
        nombre: grupoEditar.nombre,
        descripcion: grupoEditar.descripcion,
        estado: String(grupoEditar.estado),
      });
    } else {
      // Si es creación, solo carga las acciones sin marcarlas
      const modulos = await listadoModulosAccionesOrganizadas();
      setModulosAccionesAsignadas(modulos);
      reset({
        codigo: "",
        nombre: "",
        descripcion: "",
        estado: "",
      });
    }
  };

  useEffect(() => {
    respuestaGruposJoin();
  }, [grupoEditar]);

  useEffect(() => {
    // Sincronizar los valores de las acciones con React Hook Form
    modulosAccionesAsignadas.forEach((modulo) => {
      modulo.formularios.forEach((formulario) => {
        formulario.acciones.forEach((accion) => {
          setValue(`acciones[${accion.id}]`, !!accion.checked);
        });
      });
    });
  }, [modulosAccionesAsignadas, setValue]);

  const closeDrawer = () => {
    setOpenDrawer(false);
    setGrupoEditar(null);
    reset({
      codigo: "",
      nombre: "",
      descripcion: "",
      estado: "",
    });
  };

  const onSubmit = async (data) => {
    const accionesSeleccionadas = Object.keys(data.acciones).filter(
      (accionId) => data.acciones[accionId] === true
    );

    const payload = {
      ...data,
      acciones: accionesSeleccionadas,
    };

    try {
      if (grupoEditar) {
        const respuesta = await editarGrupo(grupoEditar.id, payload);
        setOpenDrawer(false);
        notifySuccess(respuesta.data.message);
        return;
      }

      await crearGrupo(payload);
      notifySuccess("Grupo creado exitosamente!");
      setOpenDrawer(false);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMsg = Object.values(error.response.data.errors)
          .flat()
          .join(", ");
        notifyError(errorMsg);
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        notifyError(error.response.data.message);
      } else {
        notifyError("Hubo un problema al crear el grupo");
      }
    }
  };

  return (
    <>
      <Button
        color="blue"
        className="w-full mt-4 md:mt-0 md:w-1/4"
        onClick={handleOpenDrawer}
      >
        Crear Grupo
      </Button>
      <Drawer
        open={openDrawer}
        onClose={closeDrawer}
        overlayProps={{ className: " fixed" }}
        className="overflow-y-auto max-h-screen"
      >
        <div className="flex items-center justify-between px-4 pb-2">
          <Typography variant="h5" color="blue-gray">
            {grupoEditar ? "Editar Grupo" : "Crear Grupo"}
          </Typography>
          <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>
        <form
          className="flex flex-col gap-6 p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Codigo
          </Typography>
          <Input
            type="text"
            label="Ej: adm-123"
            readOnly={grupoEditar}
            className={`${grupoEditar ? "bg-gray-100 cursor-not-allowed" : ""}`}
            {...register("codigo", {
              required: true,
            })}
          />
          {errors.codigo && (
            <span className="text-red-300">
              {errors.codigo.message
                ? errors.codigo.message
                : "Campos incompletos"}
            </span>
          )}

          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Nombre
          </Typography>
          <Input
            type="text"
            label="Ej: admin"
            {...register("nombre", {
              required: true,
            })}
          />
          {errors.nombre && (
            <span className="text-red-300">
              {errors.nombre.message
                ? errors.nombre.message
                : "Campos incompletos"}
            </span>
          )}

          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Descripcion
          </Typography>
          <Input
            type="text"
            label="ej:acceso completo"
            {...register("descripcion", {
              required: true,
            })}
          />
          {errors.descripcion && (
            <span className="text-red-300">
              {errors.descripcion.message
                ? errors.descripcion.message
                : "Campos incompletos"}
            </span>
          )}
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Estado
          </Typography>
          <Controller
            name="estado"
            control={control}
            defaultValue=""
            rules={{ required: "Estado es requerido" }}
            render={({ field }) => (
              <SelectEstado value={field.value} onChange={field.onChange} />
            )}
          />
          <Typography variant="h5" color="blue-gray" className="-mb-3">
            Acciones
          </Typography>
          {modulosAccionesAsignadas.map((modulo) => (
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
                        <Controller
                          name={`acciones[${accion.id}]`}
                          control={control}
                          defaultValue={accion.checked || false} // Default según si está asociado
                          render={({ field }) => {
                            return (
                              <input
                                type="checkbox"
                                className="mr-2"
                                checked={field.value}
                                onChange={(e) =>
                                  field.onChange(e.target.checked)
                                }
                              />
                            );
                          }}
                        />
                        <label htmlFor={`accion-${accion.id}`}>
                          {accion.nombre}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
          <Button type="submit">Guardar</Button>
        </form>
      </Drawer>
    </>
  );
}
