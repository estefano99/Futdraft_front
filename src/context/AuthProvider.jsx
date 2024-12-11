import { createContext, useContext, useEffect, useState } from "react";
import clienteAxios from "../config/axios";
import {
  rutaAuthLogin,
  rutaAuthUser,
  rutaAuthLogout,
  rutaAuthRegister,
  rutaUsuarios,
  rutaListadoAccionesUsuarioById,
  rutaListadoGruposUsuarioById,
  rutaUsuariosResetearClave,
  rutaCambiarClave,
  rutaSoloAcciones,
  rutaGetUsuariosSinPaginacion,
} from "../libs/constantes";
import { notifyError } from "../libs/funciones";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe estar dentro del proveedor CanchasContext");
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null); //User data
  const [modulos, setModulos] = useState([]); //modulos con form y acciones para ruteo
  const [usuarios, setUsuarios] = useState([]); //Lista de usuarios
  const [accionesUsuarioDisponibles, setAccionesUsuarioDisponibles] = useState(
    []
  ); //acciones para validar botones
  const [errorAuth, setErrorAuth] = useState(null);
  // console.log(user)

  const getUser = async () => {
    try {
      setIsLoading(true);
      const respuestaAxios = await clienteAxios.get(rutaAuthUser);
      setUser(respuestaAxios.data.user);
      // console.log(user);
      setModulos(respuestaAxios.data.modulos);
    } catch (error) {
      setErrorAuth(true);
    } finally {
      setIsLoading(false);
    }
  };
  const registerUser = async (user) => {
    try {
      const respuestaAxios = await clienteAxios.post(rutaAuthRegister, user);
      const { user: userBack, modulos } = respuestaAxios.data;
      localStorage.setItem("AUTH_TOKEN", respuestaAxios.data.token);
      setUser(userBack);
      setModulos(modulos);
      return { user, modulos };
    } catch (error) {
      console.error("Error en el register:", error);
      throw error;
    }
  };

  const login = async (user) => {
    try {
      const respuestaAxios = await clienteAxios.post(rutaAuthLogin, user);
      const { user: userBack, modulos } = respuestaAxios.data; // Extraer datos del backend.

      localStorage.setItem("AUTH_TOKEN", respuestaAxios.data.token);

      // Guardar usuario y módulos en el estado
      setUser(userBack);
      setModulos(modulos);
      return { user, modulos };
    } catch (error) {
      console.error("Error en el login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const respuestaAxios = await clienteAxios.post(rutaAuthLogout);
      localStorage.removeItem("AUTH_TOKEN");
      setUser(null);
      setModulos([]);
      return respuestaAxios.data;
    } catch (error) {
      setErrorAuth(true);
      throw error;
    }
  };

  const listadoUsuarios = async (
    currentPage,
    setTotalPages,
    estadoSwitch,
    debounceNombre,
    debounceApellido
  ) => {
    try {
      const respuestaAxios = await clienteAxios.get(
        `${rutaUsuarios}?page=${currentPage}&estado=${estadoSwitch}&nombre=${debounceNombre}&apellido=${debounceApellido}`
      );
      setUsuarios(respuestaAxios.data.usuarios || []);
      setTotalPages(respuestaAxios.data.meta.last_page || 1);
    } catch (error) {
      setUsuarios([]); // Limpia usuarios si hay error
      setTotalPages(1); // Resetea el total de páginas si falla
    }
  };

  const listadoUsuariosSinPaginacion = async () => {
    try {
      const respuestaAxios = await clienteAxios.get(rutaGetUsuariosSinPaginacion);
      return respuestaAxios.data;
    } catch (error) {
      throw error;
    }
  };

  //Trae acciones, form y modulo por id del usuario
  const listadoAccionesUsuarioById = async (usuario) => {
    try {
      const respuestaAxios = await clienteAxios.get(
        `${rutaListadoAccionesUsuarioById}/${usuario.id}`
      );
      return respuestaAxios.data.modulos;
    } catch (error) {
      throw error;
    }
  };

  //Trae solamente las acciones del usuario, para habilitar botones
  const obtenerSoloAcciones = async (id) => {
    if (!id) {
      return;
    }
    try {
      const response = await clienteAxios.get(
        `${rutaSoloAcciones}/${id}/acciones`
      );
      setAccionesUsuarioDisponibles(response.data.acciones);
    } catch (error) {
      notifyError(
        error.response.data.message || "Error al obtener las acciones"
      );
      console.error("Error al obtener las acciones:", error);
    }
  };

  //Trae usuarios y grupos asignados
  const listadoGruposUsuarioById = async (usuario) => {
    try {
      const respuestaAxios = await clienteAxios.get(
        `${rutaListadoGruposUsuarioById}/${usuario.id}`
      );
      return respuestaAxios.data.grupos;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  //*Este usuario a su vez tiene grupos y acciones para guardar en la tabla intermedia.
  const crearUsuario = async (usuario) => {
    try {
      const respuestaAxios = await clienteAxios.post(rutaUsuarios, usuario);
      console.log(respuestaAxios.data);
      setUsuarios((prevUsuarios) => [
        ...prevUsuarios,
        respuestaAxios.data.user,
      ]);
      return respuestaAxios.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const editarUsuario = async (id, usuario) => {
    try {
      const respuestaAxios = await clienteAxios.put(
        `${rutaUsuarios}/${id}`,
        usuario
      );
      const usuariosActualizados = usuarios.map((usuario) =>
        usuario.id === id ? respuestaAxios.data.usuario : usuario
      );
      setUsuarios(usuariosActualizados);
      setModulos(respuestaAxios.data.modulos);
      //Si el usuario actualizado es el que esta logueado, actualiza el estado user
      if (user && user.id === id) {
        console.log("entro");
        setUser(respuestaAxios.data.usuario);
      }
      return respuestaAxios;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const eliminarUsuario = async (id) => {
    try {
      const respuestaAxios = await clienteAxios.delete(`${rutaUsuarios}/${id}`);
      const usuariosActualizados = usuarios.filter(
        (usuario) => usuario.id !== id
      );
      setUsuarios(usuariosActualizados);
      return respuestaAxios.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const resetearClave = async (id) => {
    try {
      const respuestaAxios = await clienteAxios.post(
        `${rutaUsuariosResetearClave}/${id}`
      );
      return respuestaAxios.data.message;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const cambiarClave = async (id, claveActual, nuevaClave, confirmarClave) => {
    try {
      const respuesta = await clienteAxios.put(`${rutaCambiarClave}/${id}`, {
        claveActual: claveActual,
        nuevaClave: nuevaClave,
        nuevaClave_confirmation: confirmarClave,
      });
      return respuesta.data; // Mensaje de éxito del backend
    } catch (error) {
      throw error.response?.data?.error || "Error al cambiar la clave.";
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      obtenerSoloAcciones(user.id);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        login,
        getUser,
        isLoading,
        user,
        errorAuth,
        setIsLoading,
        setUser,
        setErrorAuth,
        logout,
        registerUser,
        listadoUsuarios,
        usuarios,
        setUsuarios,
        crearUsuario,
        listadoAccionesUsuarioById,
        listadoGruposUsuarioById,
        editarUsuario,
        eliminarUsuario,
        resetearClave,
        modulos,
        cambiarClave,
        accionesUsuarioDisponibles,
        obtenerSoloAcciones,
        listadoUsuariosSinPaginacion
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
