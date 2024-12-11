// RUTAS AMDIN FRONT
const rutaGeneralAdmin = "/dashboard";
const rutaGestionarCanchas = `${rutaGeneralAdmin}/gestionar-canchas`;
const rutaGestionarHorarios = `${rutaGeneralAdmin}/gestionar-horarios`;
const rutaGestionarGrupos = `${rutaGeneralAdmin}/gestionar-grupos`;
const rutaGestionarUsuarios = `${rutaGeneralAdmin}/gestionar-usuarios`;
const rutaGestionarTurnos = `${rutaGeneralAdmin}/gestionar-turnos`;
const rutaMiPerfil = `${rutaGeneralAdmin}/mi-perfil`;
const rutaReportes = `${rutaGeneralAdmin}/reportes`;

// RUTAS CLIENTE FRONT
const rutaGeneral = "/gestionar-turno";
const rutaSeleccionarCancha = `${rutaGeneralAdmin}/seleccionar-cancha`;
const rutaReservarTurno = `${rutaGeneralAdmin}/reservar-turno`;
const rutaAdminTurnos = `${rutaGeneralAdmin}/administrar-turnos`;

//Rutas al backend
const rutaGeneralAdminBack = "/api/admin";
const rutaGeneralClienteBack = "/api/cliente";
const rutaGeneralAuthBack = "api/auth";
//Rutas gestionar
const rutaCanchas = `${rutaGeneralAdminBack}/canchas`;
const rutaHorarios = `${rutaGeneralAdminBack}/horarios`;
const rutaReservas = `${rutaGeneralClienteBack}/reservas`;
const rutaAdminReservasBack = `${rutaGeneralClienteBack}/reservas/admin-reservas`;
const rutaHorariosConFechas = `${rutaGeneralAdminBack}/horarios/fechas`;
//Rutas auth y usuarios
const rutaAuthLogin = `${rutaGeneralAuthBack}/login`;
const rutaAuthUser = `${rutaGeneralAuthBack}/user`;
const rutaAuthRegister = `${rutaGeneralAuthBack}/register`;
const rutaAuthLogout = `${rutaGeneralAuthBack}/logout`;
const rutaUsuarios = `${rutaGeneralAuthBack}/usuarios`;
const rutaGetUsuariosSinPaginacion = `${rutaGeneralAuthBack}/usuarios-sin-paginacion`;
const rutaUsuariosResetearClave = `${rutaGeneralAuthBack}/usuarios-resetear-clave`;
const rutaListadoAccionesUsuarioById = `${rutaGeneralAuthBack}/usuarios-acciones`; //Esta ruta trae un usuario con acciones, form y modulo por el id del grupo
const rutaListadoGruposUsuarioById = `${rutaGeneralAuthBack}/usuarios-grupos`; //Esta ruta trae un usuario con acciones, form y modulo por el id del grupo
const rutaSoloAcciones = `${rutaGeneralAuthBack}/usuarios`;
const rutaCambiarClave = `${rutaGeneralAuthBack}/usuarios-cambiar-clave`; //Esta ruta trae un usuario con acciones, form y modulo por el id del grupo

//Ruta grupos con modulos y acciones
const rutaGrupos = `${rutaGeneralAdminBack}/grupos`;
const rutaModulosAccionesOrganizadas = `${rutaGeneralAdminBack}/modulos/acciones-organizadas`;
const rutaListadoAccionesGrupoById = `${rutaGeneralAdminBack}/grupos`; //Esta ruta trae un grupo con acciones, form y modulo por el id del grupo

//Ruta reportes
const rutaReportesBack = `${rutaGeneralClienteBack}/reservas/reportes`;

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
  rutaReservas,
  rutaSeleccionarCancha,
  rutaGestionarGrupos,
  rutaGrupos,
  rutaModulosAccionesOrganizadas,
  rutaListadoAccionesGrupoById,
  rutaGestionarUsuarios,
  rutaUsuarios,
  rutaListadoAccionesUsuarioById,
  rutaListadoGruposUsuarioById,
  rutaUsuariosResetearClave,
  rutaGestionarTurnos,
  rutaMiPerfil,
  rutaCambiarClave,
  rutaSoloAcciones,
  rutaReportes,
  rutaReportesBack,
  rutaAdminTurnos,
  rutaAdminReservasBack,
  rutaGetUsuariosSinPaginacion,
  rutaHorariosConFechas,
};
