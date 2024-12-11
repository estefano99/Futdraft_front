//Para pasar como param las opciones en cada componente para no usar string magics.
export const accionesDisponibles = {
  CREAR_HORARIO: "crear horario",
  EDITAR_HORARIO: "editar horario",
  ELIMINAR_HORARIO: "eliminar horario",
  CREAR_CANCHA: "crear cancha",
  EDITAR_CANCHA: "editar cancha",
  ELIMINAR_CANCHA: "eliminar cancha",
  SELECCIONAR_CANCHA: "seleccionar cancha", //Este equivale al crear turno, (selecciona cancha, luego el horario y lo crea)
  EDITAR_TURNO: "editar turno",
  ELIMINAR_TURNO: "eliminar turno",
  CREAR_GRUPO: "crear grupo",
  EDITAR_GRUPO: "editar grupo",
  ELIMINAR_GRUPO: "eliminar grupo",
  VER_ACCIONES_GRUPO: "ver acciones grupo",
  CREAR_USUARO: "crear usuario",
  EDITAR_USUARO: "editar usuario",
  ELIMINAR_USUARO: "eliminar usuario",
  VER_ACCIONES_USUARIO: "ver acciones usuario",
  VER_GRUPOS_USUARO: "ver grupos usuario",
  RESETEAR_CLAVE_USUARO: "resetear clave usuario",
  CREAR_ADMIN_TURNO: "crear admin turno",
  EDITAR_ADMIN_TURNO: "editar admin turno",
  ELIMINAR_ADMIN_TURNO: "eliminar admin turno",
};

//Retorna true o false para validar los botones del form
export const tienePermiso = (acciones, accionBuscada) => {
  if (!acciones) {
    return false;
  }
  const claves = Object.values(acciones);
  const tienePermiso = claves.some((accion) => accion === accionBuscada);
  return tienePermiso;
};
