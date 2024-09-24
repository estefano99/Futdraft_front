import React from "react";
import { useNavigate } from "react-router-dom";

const BotonRegresar = ({ruta}) => {
  const navigate = useNavigate();
  return (
    <button
      className="w-14 h-14 left-3 top-3 absolute bg-sbc-yellow flex justify-center items-center rounded-full shadow-md"
      onClick={() => navigate(ruta)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-arrow-left"
        width="44"
        height="44"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="#000000"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <line x1="5" y1="12" x2="19" y2="12" />
        <line x1="5" y1="12" x2="11" y2="18" />
        <line x1="5" y1="12" x2="11" y2="6" />
      </svg>
    </button>
  );
};

export default BotonRegresar;
