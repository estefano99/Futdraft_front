import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { PresentationChartBarIcon } from "@heroicons/react/24/outline";

const chartConfig = {
  type: "bar",
  height: 300,
  options: {
    chart: { toolbar: { show: false } },
    dataLabels: { enabled: false },
    colors: ["#e9f803", "#0394f8", "#03f819", "#f80303"],
    plotOptions: {
      bar: { columnWidth: "50%", borderRadius: 2 },
    },
    xaxis: {
      categories: [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ],
      labels: { style: { colors: "#616161", fontSize: "12px" } },
    },
    yaxis: { labels: { style: { colors: "#616161", fontSize: "12px" } } },
    grid: {
      show: true,
      borderColor: "#dddddd",
      strokeDashArray: 5,
      padding: { top: 5, right: 20 },
    },
    tooltip: { theme: "dark" },
  },
};

export default function GraficoBarraEstados({ dataMantenimientos }) {
  return (
    <Card className="w-full mb-5">
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
      >
        <div className="w-max rounded-lg bg-gray-900 p-5 text-white">
          <PresentationChartBarIcon className="h-6 w-6" />
        </div>
        <div>
          <Typography variant="h6" color="blue-gray">
            Mantenimientos por mes
          </Typography>
          <Typography
            variant="small"
            color="gray"
            className="max-w-sm font-normal"
          >
            Cantidad de mantenimientos por mes, desglosados por estado.
          </Typography>
        </div>
      </CardHeader>
      <CardBody className="px-2 pb-0">
        <Chart
          {...{
            ...chartConfig,
            series:
              dataMantenimientos.length > 0
                ? dataMantenimientos
                : Array(12).fill(0),
          }}
        />
      </CardBody>
    </Card>
  );
}
