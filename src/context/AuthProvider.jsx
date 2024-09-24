import { createContext, useContext, useEffect, useState } from "react";
import clienteAxios from "../config/axios";
import { rutaAuthLogin, rutaCanchas, rutaAuthUser, rutaAuthLogout, rutaAuthRegister } from "../libs/constantes";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth debe estar dentro del proveedor CanchasContext"
    );
  }
  return context;
};

const AuthProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [errorAuth, setErrorAuth] = useState(null);
  console.log(user)

  const getUser = async () => {
    try {
      setIsLoading(true);
      const respuestaAxios = await clienteAxios.get(rutaAuthUser);
      setUser(respuestaAxios.data)
    } catch (error) {
      setErrorAuth(true);
    } finally {
      setIsLoading(false);
    }
  };
  const registerUser = async (user) => {
    try {
      const respuestaAxios = await clienteAxios.post(rutaAuthRegister, user);
      localStorage.setItem("AUTH_TOKEN", respuestaAxios.data.token);
      return respuestaAxios.data.user;
    } catch (error) {
      throw error;
    }
  }

  const login = async (user) => {
    try {
      const respuestaAxios = await clienteAxios.post(rutaAuthLogin, user);
      localStorage.setItem("AUTH_TOKEN", respuestaAxios.data.token);
      setUser(respuestaAxios.data.user)
    } catch (error) {
      // setErrorAuth(true);
      throw error;
    }
  }

  const logout = async () => {
    try {
      const respuestaAxios = await clienteAxios.post(rutaAuthLogout);
      localStorage.removeItem("AUTH_TOKEN");
      setUser(null);
      return respuestaAxios.data;
    } catch (error) {
      setErrorAuth(true);
      throw error
    }
  }

  useEffect(() => {
    getUser();
  }, [])
  

  return (
    <AuthContext.Provider value={{ login, getUser, isLoading, user, errorAuth, setIsLoading, setUser, setErrorAuth, logout, registerUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
