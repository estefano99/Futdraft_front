import React, { useState } from 'react'
import HeaderAdmin from '../../components/admin/HeaderAdmin'
import GraficoBarra from '../../components/reportes/GraficoBarra'
import DatePickerReportes from '../../components/reportes/DatePickerReportes'

const Reportes = () => {
  const [dataTurnos, setDataTurnos] = useState([]);
  return (
    <div>
      <HeaderAdmin titulo="Reportes" />
      <div className="w-4/5 mx-auto mt-10">
        <DatePickerReportes setDataTurnos={setDataTurnos}/>
        <GraficoBarra dataTurnos={dataTurnos}/>
      </div>
    </div>
  )
}

export default Reportes
