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
import { useAuth } from "../../../context/AuthProvider";
import { set } from "lodash";

export function DrawerUsuarios({
  openDrawer,
  setOpenDrawer,
  usuarioEditar,
  setUsuarioEditar,
}) {
  const {
    grupos,
    listadoGruposSinPaginacion,
    listadoModulosAccionesOrganizadas,
  } = useGrupos();
  const {
    crearUsuario,
    editarUsuario,
    listadoGruposUsuarioById,
    listadoAccionesUsuarioById,
  } = useAuth();
  const [modulosAccionesAsignadas, setModulosAccionesAsignadas] = useState([]);
  const [gruposAsignados, setGruposAsignados] = useState([]);
  const [cargando, setCargando] = useState(false);
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

  // Crear un conjunto de IDs de acciones del usuario unicos con el set, y con flatMap para obtener un array de IDs, aplana los array anidadados en un solo array
  const obtenerAccionesIds = (acciones) => {
    return new Set(
      acciones.flatMap((accion) =>
        accion.formularios.flatMap((formulario) =>
          formulario.acciones.map((detalleAccion) => detalleAccion.id)
        )
      )
    );
  };

  // Función para actualizar módulos con las acciones seleccionadas
  const actualizarModulos = (modulos, accionesIds) => {
    return modulos.map((modulo) => ({
      ...modulo,
      formularios: modulo.formularios.map((formulario) => ({
        ...formulario,
        acciones: formulario.acciones.map((accion) => ({
          ...accion,
          checked: accionesIds.has(accion.id),
        })),
      })),
    }));
  };

  // Obtener IDs de grupos asociados
  const obtenerGruposIds = (grupos) => {
    return new Set(grupos.map((grupo) => grupo.id));
  };

  // Actualizar la lista de grupos con los seleccionados
  const actualizarGrupos = (todosLosGrupos, gruposIds) => {
    return todosLosGrupos.map((grupo) => ({
      ...grupo,
      checked: gruposIds.has(grupo.id),
    }));
  };

  // Función principal para los grupos
  const gruposUsuarioChecked = (gruposUsuario, todosLosGrupos) => {
    const gruposIds = obtenerGruposIds(gruposUsuario); // Obtener IDs de los grupos asignados
    const gruposActualizados = actualizarGrupos(todosLosGrupos, gruposIds); // Actualizar grupos con el estado "checked"
    return gruposActualizados;
  };

  const respuestaGruposJoin = async () => {
    if (usuarioEditar) {
      //* Ponemos el check en true las acciones del usuario que ya estan asignadas, osea en la tabla pivote entre acciones y usuarios

      // Acciones
      const accionesUsuario = await listadoAccionesUsuarioById(usuarioEditar); // Obtiene las acciones del usuario
      const modulos = await listadoModulosAccionesOrganizadas(); // Todas las acciones organizadas
      const accionesUsuarioIds = obtenerAccionesIds(accionesUsuario); // Obtener IDs de acciones asociadas
      const modulosActualizados = actualizarModulos(
        modulos,
        accionesUsuarioIds
      ); // Actualizar módulos con las acciones seleccionadas
      setModulosAccionesAsignadas(modulosActualizados);

      // Grupos
      const gruposUsuario = await listadoGruposUsuarioById(usuarioEditar); // Obtiene los grupos del usuario
      const gruposAsignados = gruposUsuarioChecked(gruposUsuario, grupos); // Actualiza la lista de grupos
      setGruposAsignados(gruposAsignados); // Actualiza el estado de los grupos asignados
      reset({
        nombre: usuarioEditar.nombre,
        apellido: usuarioEditar.apellido,
        dni: usuarioEditar.dni,
        email: usuarioEditar.email,
        nro_celular: usuarioEditar.nro_celular,
        estado: String(usuarioEditar.estado),
      });
    } else {
      // Si es creación, solo carga las acciones sin marcarlas
      const modulos = await listadoModulosAccionesOrganizadas();
      setModulosAccionesAsignadas(modulos);
      reset({
        nombre: "",
        apellido: "",
        dni: "",
        email: "",
        nro_celular: "",
        estado: "",
      });
    }
  };

  const closeDrawer = () => {
    setOpenDrawer(false);
    setUsuarioEditar(null);
    reset({
      nombre: "",
      apellido: "",
      dni: "",
      email: "",
      nro_celular: "",
      estado: "",
    });
  };

  const onSubmit = async (data) => {
    //Filtra los Id que tienen el checked en true, dejandodolos en un arrray para mandarlos al back
    const accionesSeleccionadas = Object.keys(data.acciones).filter(
      (accionId) => data.acciones[accionId] === true
    );
    const gruposSeleccionados = Object.keys(data.grupos).filter(
      (grupoId) => data.grupos[grupoId] === true
    );

    const payload = {
      ...data,
      acciones: accionesSeleccionadas,
      grupos: gruposSeleccionados,
    };

    try {
      //Edita el usuario y en el context el useEffect actualiza las acciones
      if (usuarioEditar) {
        setCargando(true);
        const respuesta = await editarUsuario(usuarioEditar.id, payload);
        setOpenDrawer(false);
        notifySuccess(respuesta.data.message);
        setCargando(false);
        return;
      }
      //Crea el usuario si no es editar
      setCargando(true);
      await crearUsuario(payload);
      notifySuccess("Usuario creado exitosamente!");
      setCargando(false);
      reset({
        nombre: "",
        apellido: "",
        dni: "",
        email: "",
        nro_celular: "",
        estado: "",
      });
      setOpenDrawer(false);
    } catch (error) {
      setCargando(false);
      console.log(error);
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

  //Trae grupos, acciones y modulos para el alta y editar en el form
  useEffect(() => {
    respuestaGruposJoin();
  }, [usuarioEditar]);

  //Trae los grupos para el alta y editar en el form
  useEffect(() => {
    listadoGruposSinPaginacion();
  }, []);

  useEffect(() => {
    if (!usuarioEditar) return;

    modulosAccionesAsignadas.forEach((modulo) => {
      modulo.formularios.forEach((formulario) => {
        formulario.acciones.forEach((accion) => {
          setValue(`acciones[${accion.id}]`, !!accion.checked);
        });
      });
    });

    gruposAsignados.forEach((grupo) => {
      setValue(`grupos[${grupo.id}]`, !!grupo.checked);
    });
  }, [usuarioEditar, modulosAccionesAsignadas, gruposAsignados, setValue]);

  return (
    <>
      <Button
        color="blue"
        className="w-full mt-4 md:mt-0 md:w-1/4"
        onClick={handleOpenDrawer}
      >
        Crear Usuario
      </Button>
      <Drawer
        open={openDrawer}
        onClose={closeDrawer}
        size={500}
        overlayProps={{ className: " fixed" }}
        className="overflow-y-auto max-h-screen"
      >
        <div className="flex items-center justify-between px-4 pb-2">
          <Typography variant="h5" color="blue-gray">
            {usuarioEditar ? "Editar Usuario" : "Crear Usuario"}
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
            Nombre <span className="text-red-300">*</span>
          </Typography>
          <Input
            type="text"
            label="nombre..."
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
            Apellido <span className="text-red-300">*</span>
          </Typography>
          <Input
            type="text"
            label="apellido..."
            {...register("apellido", {
              required: true,
            })}
          />
          {errors.apellido && (
            <span className="text-red-300">
              {errors.apellido.message
                ? errors.apellido.message
                : "Campos incompletos"}
            </span>
          )}
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            DNI
          </Typography>
          <Input type="text" label="DNI..." {...register("dni")} />
          {errors.dni && (
            <span className="text-red-300">
              {errors.dni.message ? errors.dni.message : "Campos incompletos"}
            </span>
          )}
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            email <span className="text-red-300">*</span>
          </Typography>
          <Input
            type="text"
            label="email..."
            {...register("email", {
              required: true,
            })}
          />
          {errors.email && (
            <span className="text-red-300">
              {errors.email.message
                ? errors.email.message
                : "Campos incompletos"}
            </span>
          )}
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Telefono
          </Typography>
          <Input type="text" label="telefono..." {...register("nro_celular")} />
          {errors.nro_celular && (
            <span className="text-red-300">
              {errors.nro_celular.message
                ? errors.nro_celular.message
                : "Campos incompletos"}
            </span>
          )}
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Estado <span className="text-red-300">*</span>
          </Typography>
          <Controller
            name="estado"
            control={control}
            defaultValue={usuarioEditar ? String(usuarioEditar.estado) : ""}
            rules={{ required: "Estado es requerido" }}
            render={({ field }) => (
              <SelectEstado value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.estado && (
            <span className="text-red-500 text-sm">
              {errors.estado.message}
            </span>
          )}
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
          {/* Grupos (Nueva sección) */}
          <Typography variant="h5" color="blue-gray" className="-mb-3">
            Grupos
          </Typography>
          <div className="w-1/3 border-l border-gray-300 pl-4">
            <ul>
              {grupos.length > 0
                ? grupos.map((grupo) => (
                    <li key={grupo.id} className="flex items-center gap-2 mb-2">
                      <Controller
                        name={`grupos[${grupo.id}]`}
                        control={control}
                        defaultValue={grupo.checked || false} // Default según si está asociado
                        render={({ field }) => {
                          return (
                            <input
                              type="checkbox"
                              className="mr-2"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          );
                        }}
                      />
                      <label htmlFor={`grupo-${grupo.id}`}>
                        <Typography variant="small" color="blue-gray">
                          {grupo.nombre}
                        </Typography>
                      </label>
                    </li>
                  ))
                : "No existen grupos"}
            </ul>
          </div>

          <Button loading={cargando} type="submit">
            {cargando ? "Cargando" : "Guardar"}
          </Button>
        </form>
      </Drawer>
    </>
  );
}
