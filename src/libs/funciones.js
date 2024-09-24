import dayjs from "dayjs";

const convertTimeToMinutes = (timeString) => {
  // Divide la cadena en horas, minutos y segundos
  const [hours, minutes, seconds] = timeString.split(":").map(Number);

  // Crea una duración usando las horas, minutos y segundos
  const timeDuration = dayjs.duration({
    hours,
    minutes,
    seconds,
  });

  // Devuelve la duración en minutos
  return timeDuration.asMinutes();
}

export {
  convertTimeToMinutes
}