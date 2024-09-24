import {
  Card,
  Typography,
  Tooltip,
  IconButton,
  Button,
} from "@material-tailwind/react";
import { PencilIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { rutaReservarTurno } from "../../libs/constantes";

const TABLE_HEAD = ["Cancha", "Turno", "Acciones"];

const TABLE_ROWS = [
  {
    cancha: "John Michael",
    turno: "23/04/18",
  },
  {
    cancha: "Alexa Liras",
    turno: "23/04/18",
  },
  {
    cancha: "Laurent Perrier",
    turno: "19/09/17",
  },
  {
    cancha: "Michael Levi",
    turno: "19/09/17",
  },
  {
    cancha: "Richard Gran",
    turno: "04/10/21",
  },
];

export function TablaGestionar() {
  const navigate = useNavigate();
  return (
    <Card className="h-full w-full overflow-scroll mt-5">
      <div className="flex justify-end p-3">
        <Button className="w-1/4" color="blue" onClick={() => navigate(rutaReservarTurno)}>
          Reservar turno
        </Button>
      </div>
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th
                key={head}
                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
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
          {TABLE_ROWS.map(({ cancha, turno }, index) => {
            const isLast = index === TABLE_ROWS.length - 1;
            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

            return (
              <tr key={cancha}>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {cancha}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {turno}
                  </Typography>
                </td>
                <td className={classes}>
                  <Tooltip content="Edit User">
                    <IconButton variant="text">
                      <PencilIcon className="h-4 w-4" />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
