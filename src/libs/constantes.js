
// RUTAS AMDIN FRONT
const rutaGeneralAdmin = "/admin";
const rutaGestionarCanchas = `${rutaGeneralAdmin}/gestionar-canchas`;
const rutaGestionarHorarios = `${rutaGeneralAdmin}/gestionar-horarios`;

// RUTAS CLIENTE FRONT
const rutaGeneral = "/gestionarTurno";
const rutaReservarTurno = `${rutaGeneral}/reservarTurno`;

//Rutas al backend
const rutaGeneralAdminBack = "/api/admin";
const rutaGeneralClienteBack = "/api/cliente";
const rutaCanchas = `${rutaGeneralAdminBack}/canchas`;
const rutaHorarios = `${rutaGeneralAdminBack}/horarios`;
const rutaReservas = `${rutaGeneralClienteBack}/reservas`;
const rutaAuthLogin = `api/auth/login`;
const rutaAuthUser = `api/auth/user`;
const rutaAuthRegister = `api/auth/register`;
const rutaAuthLogout = `api/auth/logout`;

export {
  rutaReservarTurno, 
  rutaGeneral,
  rutaGeneralAdmin,
  rutaGestionarCanchas,
  rutaCanchas,
  rutaGestionarHorarios,
  rutaHorarios,
  rutaAuthLogin,
  rutaAuthUser,
  rutaAuthLogout,
  rutaAuthRegister,
  rutaReservas
};
