import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  CardFooter,
  IconButton,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { rutaAuditoriaLogBack } from "../../../libs/constantes";
import clienteAxios from "../../../config/axios";

const TABLE_HEAD = ["usuario", "evento", "fecha"];

export function TablaAuditoriaLog({}) {
  const [auditoriaLog, setAuditoriaLog] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState(""); // Estado para el mensaje de error

  const listadoAuditoriaLog = async (page, setTotalPages) => {
    try {
      const respuestaAxios = await clienteAxios.get(
        `${rutaAuditoriaLogBack}?page=${page}`
      );

      if (respuestaAxios.data.auditoriaLog.length > 0) {
        setAuditoriaLog(respuestaAxios.data.auditoriaLog);
        setTotalPages(respuestaAxios.data.meta.last_page);
      } else {
        setAuditoriaLog([]);
        setTotalPages(0);
      }
      return;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setAuditoriaLog([]);
        setTotalPages(0);
        throw error;
      } else {
        setAuditoriaLog([]);
        throw error;
      }
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    listadoAuditoriaLog(currentPage, setTotalPages);
    return;
  }, [currentPage]);

  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col flex-wrap justify-around md:flex-row gap-10 ">
          <div className="flex">
            <Typography
              variant="h5"
              className="mt-5 font-black"
              color="blue-gray"
            >
              Listado de Auditorias
            </Typography>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {auditoriaLog.length > 0 ? (
              auditoriaLog.map(({ id, evento, timestamp, usuario }, index) => {
                const isLast = index === auditoriaLog.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";
                return (
                  <tr key={index}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {`${usuario.nombre} ${usuario.apellido}`}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {evento}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {timestamp}
                        </Typography>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center">
                  <Typography variant="small" color="blue-gray">
                    {errorMessage || "No hay auditorias disponibles."}
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Button
          variant="outlined"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>
        <div className="flex items-center gap-2">
          {[...Array(totalPages).keys()].map((_, index) => (
            <IconButton
              key={index}
              variant={currentPage === index + 1 ? "outlined" : "text"}
              size="sm"
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </IconButton>
          ))}
        </div>
        <Button
          variant="outlined"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </Button>
      </CardFooter>
    </Card>
  );
}
