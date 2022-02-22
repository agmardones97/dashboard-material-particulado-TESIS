import React from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import Typography from '@material-ui/core/Typography'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export const data = {
  labels: ["Bueno", "Regular", "Alerta", "Preemergencia", "Emergencia"],
  datasets: [
    {
      label: "Conteo por zona",
      data: [100, 9, 3, 5, 2],
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
    },
  ],
};

export function GraphRadarReporte(props) {
  return (
    <>
      <div className="header">
        <Typography variant="h4" align="center" color="initial">
          {props.title}
        </Typography>
      </div>
      <Radar data={props.dataRadar} style={{height:"100px"}}/>
    </>
  );
}
