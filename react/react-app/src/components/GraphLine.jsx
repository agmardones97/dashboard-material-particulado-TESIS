import React from "react";
import Typography from "@material-ui/core/Typography";
import { Line } from "react-chartjs-2";



export function GraphLine(props) {
  console.log(props);
  return (
    <div>
      <div className="header">
        <Typography variant="h4" align="center" color="initial">
          Gráfico de Linea
        </Typography>
      </div>
      <Line data={props.dataLine['dataLine']} />
    </div>
  );
}
