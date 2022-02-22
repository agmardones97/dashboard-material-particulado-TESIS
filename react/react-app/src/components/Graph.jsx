import React from 'react';
import { Bar } from 'react-chartjs-2';
import Typography from '@material-ui/core/Typography'



const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
  maintainAspectRatio: true,

};

const GroupedBar = (props) => (
  <>
    <div className='header'>
      <Typography variant="h4" align="center" color="initial">Concentración de Material Particulado</Typography>
      
    </div>
    <Bar data={props.dataMpp['dataMpp']} width={100} height={50} options={options} />
  </>
);

export default GroupedBar;