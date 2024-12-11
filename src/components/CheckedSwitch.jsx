import { Switch } from "@material-tailwind/react";

export function CheckedSwitch({ color, label, estadoSwitch, setEstadoSwitch }) {
  return (
    <Switch checked={estadoSwitch} onChange={(event) => setEstadoSwitch(event.target.checked)} color={color} label={label} />
  );
}
