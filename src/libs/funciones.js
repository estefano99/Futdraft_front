import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const notifySuccess = (message) => {
  toast.success(message);
};
export const notifyError = (message) => toast.error(message);
export const notifyInfo = (message) => toast.info(message);

const convertTimeToMinutes = (timeString) => {
  // Divide la cadena en horas, minutos y segundos
  const [hours, minutes, seconds = 0] = timeString.split(":").map(Number);

  // Crea una duración usando las horas, minutos y segundos
  const timeDuration = dayjs.duration({
    hours,
    minutes,
    seconds,
  });

  // Devuelve la duración en minutos
  return timeDuration.asMinutes();
}

const validarFormatoTiempo = (timeString) => {
  // Verifica si el tiempo ya tiene el formato HH:mm:ss
  const parts = timeString.split(":");
  
  if (parts.length === 3) {
    return timeString; // Ya está en formato HH:mm:ss
  } else if (parts.length === 2) {
    return `${timeString}:00`; // Agrega los segundos si faltan
  } else {
    throw new Error("Formato de tiempo inválido");
  }
};

const useDebounceNroCancha = (value, delay) => {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);
  
    return () => {
      clearTimeout(handler);
    }
  }, [value, delay]);

  return debounceValue;
}

const useDebounceFecha = (value, delay) => {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);
  
    return () => {
      clearTimeout(handler);
    }
  }, [value, delay]);

  return debounceValue;
}

const useDebounceHoraApertura = (value, delay) => {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);
  
    return () => {
      clearTimeout(handler);
    }
  }, [value, delay]);

  return debounceValue;
}

const useDebounce = (value, delay) => {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);
  
    return () => {
      clearTimeout(handler);
    }
  }, [value, delay]);

  return debounceValue;
}


export {
  convertTimeToMinutes,
  useDebounceNroCancha,
  useDebounceFecha,
  validarFormatoTiempo,
  useDebounceHoraApertura,
  useDebounce
}