import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import GestionarTurno from "./pages/cliente/GestionarTurno";
import ReservarTurno from "./pages/cliente/ReservarTurno";
import {
  rutaGeneral,
  rutaGeneralAdmin,
  rutaGestionarHorarios,
} from "./libs/constantes";
import ClienteLayout from "./layout/ClienteLayout";
import AdminLayout from "./layout/AdminLayout";
import GestionarCanchas from "./pages/admin/GestionarCanchas";
import CanchasProvider from "./context/CanchasProvider";

import HorariosProvider from "./context/HorariosProvider";
import GestionarHorarios from "./pages/admin/GestionarHorarios";
import AuthProvider from "./context/AuthProvider";
import ReservasProvider from "./context/ReservasProvider";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ReservasProvider>
          <CanchasProvider>
            <HorariosProvider>
              <Routes>
                <Route path="/" element={<Login />}></Route>

                {/* RUTA PROTEGIDA DEL CLIENTE */}
                <Route path={rutaGeneral} element={<ClienteLayout />}>
                  <Route index element={<GestionarTurno />} />
                  <Route
                    path="reservarTurno/:id/:nro_cancha/:precio"
                    element={<ReservarTurno />}
                  ></Route>
                </Route>

                {/* RUTA PROTEGIDA DEL ADMIN */}
                <Route path={rutaGeneralAdmin} element={<AdminLayout />}>
                  <Route index element={<GestionarCanchas />} />
                  <Route
                    path={rutaGestionarHorarios}
                    element={<GestionarHorarios />}
                  />
                  {/* <Route path="reservarTurno" element={<ReservarTurno />}></Route> */}
                </Route>
              </Routes>
            </HorariosProvider>
          </CanchasProvider>
        </ReservasProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
