import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import GestionarTurno from "./pages/cliente/GestionarTurno";
import ReservarTurno from "./pages/cliente/ReservarTurno";
import {
  rutaAdminTurnos,
  rutaAuditoriaLog,
  rutaAuditoriaMantenimiento,
  rutaAuditoriaReserva,
  rutaGeneralAdmin,
  rutaGestionarCanchas,
  rutaGestionarGrupos,
  rutaGestionarHorarios,
  rutaGestionarTurnos,
  rutaGestionarUsuarios,
  rutaMantenimiento,
  rutaMiPerfil,
  rutaReportes,
  rutaReservarTurno,
  rutaSeleccionarCancha,
  rutaTareas,
  rutaTipoMantenimiento,
} from "./libs/constantes";
import AdminLayout from "./layout/AdminLayout";
import GestionarCanchas from "./pages/admin/GestionarCanchas";
import CanchasProvider from "./context/CanchasProvider";
import GruposProvider from "./context/GruposProvider";

import HorariosProvider from "./context/HorariosProvider";
import GestionarHorarios from "./pages/admin/GestionarHorarios";
import AuthProvider from "./context/AuthProvider";
import ReservasProvider from "./context/ReservasProvider";
import SeleccionarCancha from "./pages/cliente/SeleccionarCancha";
import GestionarGrupos from "./pages/admin/GestionarGrupos";
import GestionarUsuarios from "./pages/admin/GestionarUsuarios";
import Perfil from "./pages/perfil/Perfil";
import Reportes from "./pages/admin/Reportes";
import AdminTurnos from "./pages/admin/AdminTurnos";
import AdminCalendarioPage from "./pages/admin/AdminCalendarioPage";
import TipoMantenimientoProvider from "./context/TipoMantProvider";
import GestionarTipoMantenimiento from "./pages/admin/GestionarTipoMantenimiento";
import MantenimientoProvider from "./context/MantenimientosProvider";
import GestionarMantenimientos from "./pages/admin/GestionarMantenimientos";
import TareasProvider from "./context/TareasProvider";
import GestionarTareas from "./pages/admin/GestionarTareas";
import AuditoriaLog from "./pages/admin/AuditoriaLog";
import AuditoriaMantenimiento from "./pages/admin/AuditoriaMantenimiento";
import AuditoriaReserva from "./pages/admin/AuditoriaReserva";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GruposProvider>
          <ReservasProvider>
            <CanchasProvider>
              <HorariosProvider>
                <TipoMantenimientoProvider>
                  <MantenimientoProvider>
                    <TareasProvider>
                        <Routes>
                          <Route path="/" element={<Login />}></Route>

                          {/* RUTA PROTEGIDA DEL ADMIN */}
                          <Route
                            path={rutaGeneralAdmin}
                            element={<AdminLayout />}
                          >
                            <Route
                              path={rutaGestionarCanchas}
                              element={<GestionarCanchas />}
                            />
                            <Route
                              path={rutaGestionarHorarios}
                              element={<GestionarHorarios />}
                            />
                            <Route
                              path={rutaGestionarGrupos}
                              element={<GestionarGrupos />}
                            />
                            <Route
                              path={rutaGestionarUsuarios}
                              element={<GestionarUsuarios />}
                            />
                            <Route
                              path={rutaGestionarTurnos}
                              element={<GestionarTurno />}
                            />
                            <Route
                              path={rutaSeleccionarCancha}
                              element={<SeleccionarCancha />}
                            />
                            <Route path={rutaMiPerfil} element={<Perfil />} />
                            <Route path={rutaReportes} element={<Reportes />} />
                            <Route
                              path={rutaTipoMantenimiento}
                              element={<GestionarTipoMantenimiento />}
                            />
                            <Route
                              path={rutaMantenimiento}
                              element={<GestionarMantenimientos />}
                            />
                            <Route
                              path={rutaTareas}
                              element={<GestionarTareas />}
                            />
                            <Route
                              path={rutaAuditoriaLog}
                              element={<AuditoriaLog />}
                            />
                            <Route
                              path={rutaAuditoriaMantenimiento}
                              element={<AuditoriaMantenimiento />}
                            />
                            <Route
                              path={rutaAuditoriaReserva}
                              element={<AuditoriaReserva />}
                            />

                            {/* Esta ruta es para el cliente, permite al cliente reservar turnos */}
                            <Route
                              path={`${rutaReservarTurno}/:id/:nro_cancha/:precio/:usuario_id`}
                              element={<ReservarTurno />}
                            ></Route>
                            <Route
                              path={rutaAdminTurnos}
                              element={<AdminTurnos />}
                            ></Route>
                            {/* Esta ruta es para administrar turnos, permite al que tenga permisos administ. turnos */}
                            <Route
                              path={`${rutaAdminTurnos}/:id/:nro_cancha/:precio/:usuario_id`}
                              element={<AdminCalendarioPage />}
                            ></Route>
                          </Route>
                        </Routes>
                    </TareasProvider>
                  </MantenimientoProvider>
                </TipoMantenimientoProvider>
              </HorariosProvider>
            </CanchasProvider>
          </ReservasProvider>
        </GruposProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
