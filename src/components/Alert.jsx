import { Alert } from "@material-tailwind/react";

export function AlertColors({ alert }) {
  return (
    <div className="flex w-full flex-col gap-2 my-5">
      {alert.color === "blue" && <Alert color="blue">{alert.message}</Alert>}
      {alert.color === "red" && <Alert color="red">{alert.message}</Alert>}
      {alert.color === "green" && <Alert color="green">{alert.message}</Alert>}
      {alert.color === "amber" && <Alert color="amber">{alert.message}</Alert>}
    </div>
  );
}
