import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { GraphRadarReporte } from "./GraphRadarReporte";
import { GraphLineReporte } from "./GraphLineReporte";
import MapaleafReporte from "./MapaReporte";
import GroupedBarReporte from "./GraphReporte";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import domtoimage from "dom-to-image";
import jsPDF from "jspdf";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  titulo: {},
}));

export default function VistaPrevia() {
  const classes = useStyles();
  const ids = useParams("ids").ids;
  const [gps, setGps] = useState({ data: [] });
  const [gps10, setGps10] = useState({ data: [] });
  const [gps25, setGps25] = useState({ data: [] });

  const [totalDataMpp, setTotalDataMpp] = useState([]);
  const [totalDataLinea, setTotalDataLinea] = useState([]);
  const [totalDataRadar10, setTotalDataRadar10] = useState([]);
  const [totalDataRadar25, setTotalDataRadar25] = useState([]);
  const [totalGps, setTotalGps] = useState([]);
  const [totalGps10, setTotalGps10] = useState([]);
  const [totalGps25, setTotalGps25] = useState([]);
  const [totalTotal, setTotalTotal] = useState([]);
  const [totalVuelos, setTotalVuelos] = useState(null);

  const [totalMañana, setTotalMañana] = useState(0);
  const [totalTarde, setTotalTarde] = useState(0);
  const [totalNoche, setTotalNoche] = useState(0);
  const [general, setGeneral] = useState("");
  // const [fecha, setFecha] = useState(new Date())

  const [dataMpp, setDataMpp] = useState({
    dataMpp: {
      labels: ["Mpp 10", "Mpp 2.5"],
      datasets: [
        {
          label: "Mínima",
          data: [0, 0],
          backgroundColor: "rgb(255, 99, 132)",
        },
        {
          label: "Promedio",
          data: [0, 0],
          backgroundColor: "rgb(54, 162, 235)",
        },
        {
          label: "Máxima",
          data: [0, 0],
          backgroundColor: "rgb(75, 192, 192)",
        },
      ],
    },
  });

  const [dataLineGraph, setDataLineGraph] = useState([
    {
      dataLine: {
        labels: [0],
        datasets: [
          {
            label: "Mpp 10",
            data: [0],
            fill: true,
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)",
          },
          {
            label: "Mpp 2.5",
            data: [0],
            fill: false,
            borderColor: "#742774",
          },
        ],
      },
    },
  ]);

  const [dataRadarGraph10, setDataRadarGraph10] = useState([
    {
      dataRadar: {
        labels: ["Bueno", "Regular", "Alerta", "Preemergencia", "Emergencia"],
        datasets: [
          {
            label: "Conteo por zona",
            data: [0, 0, 0, 0, 0],
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 1,
          },
        ],
      },
    },
  ]);

  const [dataRadarGraph25, setDataRadarGraph25] = useState([
    {
      dataRadar: {
        labels: ["Bueno", "Regular", "Alerta", "Preemergencia", "Emergencia"],
        datasets: [
          {
            label: "Conteo por zona",
            data: [0, 0, 0, 0, 0],
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      },
    },
  ]);
  // console.log(ids);

  const descargaImage = (totalVuelos) => {
    var doc = new jsPDF("p", "pt");
    let date = new Date();
    doc.addFont("helvetica", "normal");
    doc.setFontSize(30);
    doc.text(100, 200, "Informe de vuelos realizados");
    doc.addImage(general, "PNG", 10, 240, 570, 200, "general");
    doc.addPage();
    for (let i = 0; i <= totalVuelos - 1; i++) {
      // console.log(i)
      var node = document.getElementById("descarga" + i);
      domtoimage.toPng(node).then(function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;
        doc.addImage(img.src, "PNG", 10, 80, 570, 600, "foto" + i);
        if (i === totalVuelos - 1) {
          doc.save(
            "reporte mpp " + date.toLocaleString().split(" ")[0] + ".pdf"
          );
        } else {
          doc.addPage();
        }
      });
    }
  };

  const getGeneral = () => {
    const node = document.getElementById("general");
    domtoimage.toPng(node).then(function (dataUrl) {
      setGeneral(dataUrl);
    });
  };

  const getAllData = async (ids) => {
    let data = [];

    await axios(`http://127.0.0.1:5000/getmppidReporte/` + ids)
      .then((response) => {
        console.log(response.data);
        data = response.data;
        setTotalVuelos(data.length);
      })
      .catch((error) => {
        console.log(error);
      });
    const ArregloFinal = [];
    const ArregloDataMpp = [];
    const ArregloGps = [];
    const ArregloGps10 = [];
    const ArregloGps25 = [];
    const ArregloDataLinea = [];
    const ArregloDataRadar10 = [];
    const ArregloDataRadar25 = [];
    let totMañana = 0;
    let totTarde = 0;
    let totNoche = 0;
    let titulo = "";
    let fecha = "";
    let temperatura = "";
    let horario = "";
    let altura = "";
    let descripcion = "";
    let cantDatos = "";
    for (let j = 0; j <= data.length - 1; j++) {
      let lendata = 0;
      let arrGps = [];
      let arrGps10 = [];
      let arrGps25 = [];
      let arrMpp25 = [];
      let arrMpp10 = [];
      let sumMpp10 = 0;
      let sumMpp25 = 0;
      let val10 = [];
      let val25 = [];
      let cont = [];
      let contBueMp10 = 0;
      let contRegMp10 = 0;
      let contAleMp10 = 0;
      let contPreMp10 = 0;
      let contEmeMp10 = 0;
      let contBueMp25 = 0;
      let contRegMp25 = 0;
      let contAleMp25 = 0;
      let contPreMp25 = 0;
      let contEmeMp25 = 0;
      titulo = data[j]["datos"][0]["titulo"];
      fecha = data[j]["datos"][0]["fecha"];
      temperatura = data[j]["datos"][0]["temperatura"];
      horario = data[j]["datos"][0]["horario"];
      if (horario === "mañana") {
        totMañana = totMañana + 1;
      }
      if (horario === "tarde") {
        totTarde = totTarde + 1;
      }
      if (horario === "noche") {
        totNoche = totNoche + 1;
      }
      altura = data[j]["datos"][0]["altura"];
      descripcion = data[j]["datos"][0]["descripcion"];
      cantDatos = data[j]["datos"][0]["lendata"];
      console.log(cantDatos);

      // lendata = data[j]["lendata"];
      for (let i = 0; i <= cantDatos - 1; i++) {
        arrGps[i] = [
          data[j]["datos"][0]["data"][i].lat,
          data[j]["datos"][0]["data"][i].lon,
        ];
        if (parseInt(data[j]["datos"][0]["data"][i].mp25) <= 50) {
          arrGps25[i] = [
            data[j]["datos"][0]["data"][i].lat,
            data[j]["datos"][0]["data"][i].lon,
            0,
            data[j]["datos"][0]["data"][i].mp25,
          ];
          contBueMp25 = contBueMp25 + 1;
        }
        if (
          parseInt(data[j]["datos"][0]["data"][i].mp25) > 50 &&
          parseInt(data[j]["datos"][0]["data"][i].mp25) <= 80
        ) {
          arrGps25[i] = [
            data[j]["datos"][0]["data"][i].lat,
            data[j]["datos"][0]["data"][i].lon,
            1,
            data[j]["datos"][0]["data"][i].mp25,
          ];
          contRegMp25 = contRegMp25 + 1;
        }
        if (
          parseInt(data[j]["datos"][0]["data"][i].mp25) > 80 &&
          parseInt(data[j]["datos"][0]["data"][i].mp25) <= 110
        ) {
          arrGps25[i] = [
            data[j]["datos"][0]["data"][i].lat,
            data[j]["datos"][0]["data"][i].lon,
            2,
            data[j]["datos"][0]["data"][i].mp25,
          ];
          contAleMp25 = contAleMp25 + 1;
        }
        if (
          parseInt(data[j]["datos"][0]["data"][i].mp25) > 110 &&
          parseInt(data[j]["datos"][0]["data"][i].mp25) <= 140
        ) {
          arrGps25[i] = [
            data[j]["datos"][0]["data"][i].lat,
            data[j]["datos"][0]["data"][i].lon,
            3,
            data[j]["datos"][0]["data"][i].mp25,
          ];
          contPreMp25 = contPreMp25 + 1;
        }
        if (parseInt(data[j]["datos"][0]["data"][i].mp25) > 140) {
          arrGps25[i] = [
            data[j]["datos"][0]["data"][i].lat,
            data[j]["datos"][0]["data"][i].lon,
            4,
            data[j]["datos"][0]["data"][i].mp25,
          ];
          contEmeMp25 = contEmeMp25 + 1;
        }

        if (parseInt(data[j]["datos"][0]["data"][i].mp10) <= 150) {
          arrGps10[i] = [
            data[j]["datos"][0]["data"][i].lat,
            data[j]["datos"][0]["data"][i].lon,
            0,
            data[j]["datos"][0]["data"][i].mp10,
          ];
          contBueMp10 = contBueMp10 + 1;
        }
        if (
          parseInt(data[j]["datos"][0]["data"][i].mp10) > 150 &&
          parseInt(data[j]["datos"][0]["data"][i].mp10) <= 195
        ) {
          arrGps10[i] = [
            data[j]["datos"][0]["data"][i].lat,
            data[j]["datos"][0]["data"][i].lon,
            1,
            data[j]["datos"][0]["data"][i].mp10,
          ];
          contRegMp10 = contRegMp10 + 1;
        }
        if (
          parseInt(data[j]["datos"][0]["data"][i].mp10) > 195 &&
          parseInt(data[j]["datos"][0]["data"][i].mp10) <= 240
        ) {
          arrGps10[i] = [
            data[j]["datos"][0]["data"][i].lat,
            data[j]["datos"][0]["data"][i].lon,
            2,
            data[j]["datos"][0]["data"][i].mp10,
          ];
          contAleMp10 = contAleMp10 + 1;
        }
        if (
          parseInt(data[j]["datos"][0]["data"][i].mp10) > 240 &&
          parseInt(data[j]["datos"][0]["data"][i].mp10) <= 285
        ) {
          arrGps10[i] = [
            data[j]["datos"][0]["data"][i].lat,
            data[j]["datos"][0]["data"][i].lon,
            3,
            data[j]["datos"][0]["data"][i].mp10,
          ];
          contPreMp10 = contPreMp10 + 1;
        }
        if (parseInt(data[j]["datos"][0]["data"][i].mp10) > 330) {
          arrGps10[i] = [
            data[j]["datos"][0]["data"][i].lat,
            data[j]["datos"][0]["data"][i].lon,
            4,
            data[j]["datos"][0]["data"][i].mp10,
          ];
          contEmeMp10 = contEmeMp10 + 1;
        }

        if (data[j]["datos"][0]["data"][i].mp25 != null) {
          arrMpp25.push(parseInt(data[j]["datos"][0]["data"][i].mp25));
          sumMpp25 = sumMpp25 + parseInt(data[j]["datos"][0]["data"][i].mp25);
        }

        if (
          data[j]["datos"][0]["data"][i].mp10 != null &&
          data[j]["datos"][0]["data"][i].mp10 !== "0"
        ) {
          arrMpp10.push(parseInt(data[j]["datos"][0]["data"][i].mp10));
          sumMpp10 = sumMpp10 + parseInt(data[j]["datos"][0]["data"][i].mp10);
        }
      }

      let avgMpp25 = sumMpp25 / cantDatos;
      //console.log(avgMpp25)
      let avgMpp10 = sumMpp10 / cantDatos;
      //console.log(avgMpp10)
      // console.log(arrMpp25)
      let minMpp25 = Math.min.apply(null, arrMpp25);
      // console.log(minMpp25)
      let minMpp10 = Math.min.apply(null, arrMpp10);
      // console.log(minMpp10)
      let maxMpp25 = Math.max.apply(null, arrMpp25);
      // console.log(maxMpp25)
      let maxMpp10 = Math.max.apply(null, arrMpp10);
      // console.log(maxMpp10)
      //console.log(arrGps)

      const datos = {
        labels: ["Mpp 10", "Mpp 2.5"],
        datasets: [
          {
            label: "Mínima",
            data: [minMpp10, minMpp25],
            backgroundColor: "rgb(255, 99, 132)",
          },
          {
            label: "Promedio",
            data: [avgMpp10.toFixed(2), avgMpp25.toFixed(2)],
            backgroundColor: "rgb(54, 162, 235)",
          },
          {
            label: "Máxima",
            data: [maxMpp10, maxMpp25],
            backgroundColor: "rgb(75, 192, 192)",
          },
        ],
      };

      setGps({ data: [arrGps] });
      ArregloGps.push([arrGps]);
      setGps10({ data: [arrGps10] });
      ArregloGps10.push([arrGps10]);
      setGps25({ data: [arrGps25] });
      ArregloGps25.push([arrGps25]);

      setDataMpp({
        dataMpp: datos,
      });

      ArregloDataMpp.push(datos);

      for (var i = 0; i < cantDatos; i++) {
        cont.push(i);
        val10.push(data[j]["datos"][0]["data"][i].mp10);
        val25.push(data[j]["datos"][0]["data"][i].mp25);
      }
      const datosLine = {
        labels: cont,
        datasets: [
          {
            label: "Mpp 10",
            data: val10,
            fill: true,
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)",
          },
          {
            label: "Mpp 2.5",
            data: val25,
            fill: false,
            borderColor: "#742774",
          },
        ],
      };
      setDataLineGraph({
        dataLine: datosLine,
      });
      ArregloDataLinea.push(datosLine);

      const datosRadar10 = {
        labels: ["Bueno", "Regular", "Alerta", "Preemergencia", "Emergencia"],
        datasets: [
          {
            label: "Conteo por zona",
            data: [
              contBueMp10,
              contRegMp10,
              contAleMp10,
              contPreMp10,
              contEmeMp10,
            ],
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 1,
          },
        ],
      };
      setDataRadarGraph10({
        dataRadar: datosRadar10,
      });
      ArregloDataRadar10.push(datosRadar10);

      const datosRadar25 = {
        labels: ["Bueno", "Regular", "Alerta", "Preemergencia", "Emergencia"],
        datasets: [
          {
            label: "Conteo por zona",
            data: [
              contBueMp25,
              contRegMp25,
              contAleMp25,
              contPreMp25,
              contEmeMp25,
            ],
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      };
      setDataRadarGraph25({
        dataRadar: datosRadar25,
      });
      ArregloDataRadar25.push(datosRadar25);
      ArregloFinal.push([
        [arrGps],
        [arrGps10],
        [arrGps25],
        datos,
        datosLine,
        datosRadar10,
        datosRadar25,
        titulo,
        fecha,
        cantDatos,
        temperatura,
        horario,
        altura,
        descripcion,
        minMpp10,
        minMpp25,
        avgMpp10.toFixed(2),
        avgMpp25.toFixed(2),
        maxMpp10,
        maxMpp25,
      ]);
    }

    setTotalDataMpp(ArregloDataMpp);
    setTotalDataLinea(ArregloDataLinea);
    setTotalDataRadar10(ArregloDataRadar10);
    setTotalDataRadar25(ArregloDataRadar25);
    setTotalGps(ArregloGps);
    setTotalGps10(ArregloGps10);
    setTotalGps25(ArregloGps25);
    setTotalTotal(ArregloFinal);
    setTotalMañana(totMañana);
    setTotalTarde(totTarde);
    setTotalNoche(totNoche);
    getGeneral();
    // console.log(ArregloFinal);
  };
  // console.
  useEffect(() => {
    getAllData(ids);
  }, [ids]);

  const seteaDate = (fecha) => {
    let datee = new Date(fecha);
    return datee.toLocaleDateString();
  };

  const getDate = () => {
    let date = new Date();
    return date.toLocaleString().split(" ")[0];
  };

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={5}
        justify="center"
        alignItems="center"
        alignContent="center"
      >
        <Typography
          className={classes.titulo}
          variant="h3"
          color="initial"
          style={{ marginRight: "100px" }}
        >
          Informe de Vuelos realizados.
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={(e) => descargaImage(totalVuelos)}
        >
          Descargar
        </Button>
      </Grid>

      <Container maxWidth="lg">
        <Grid container spacing={1}>
          <Grid item lg={12} xs={12} md={12} sm={12} id="general">
            <Typography
              style={{ marginTop: "50px" }}
              variant="h4"
              color="initial"
            >
              {" "}
              <b> Aspectos Generales.</b>
            </Typography>
            <table border="1" style={{ width: "100%", marginTop: "40px" }}>
              <tr>
                <td>
                  <Typography variant="subtitle1" color="initial">
                    {" "}
                    <b> Fecha de informe:</b> {getDate()}
                  </Typography>
                </td>
                <td colSpan={2}>
                  <Typography variant="subtitle1" color="initial">
                    {" "}
                    <b> Total de vuelos seleccionados:</b> {totalVuelos}
                  </Typography>
                </td>
              </tr>
              <tr>
                <td colSpan={1}>
                  <Typography variant="subtitle1" color="initial">
                    {" "}
                    <b>Vuelos de Mañana: </b> {totalMañana}
                  </Typography>
                </td>
                <td colSpan={1}>
                  <Typography variant="subtitle1" color="initial">
                    {" "}
                    <b> Vuelos de Tarde: </b>
                    {totalTarde}
                  </Typography>
                </td>
                <td colSpan={1}>
                  <Typography variant="subtitle1" color="initial">
                    {" "}
                    <b> Vuelos de Noche: </b> {totalNoche}
                  </Typography>
                </td>
              </tr>
              <tr></tr>
            </table>
            <Grid
              container
              spacing={1}
              direction="row"
              justify="center"
              alignItems="center"
              alignContent="center"
              wrap="nowrap"
            >
              <Grid item lg={6} xs={12} md={12} sm={12}>
                <table
                  border={1}
                  style={{ marginLeft: "35%", marginTop: "50px" }}
                >
                  <tr>
                    <th colSpan={2}>
                      <center>Mpp 10</center>
                    </th>
                  </tr>
                  <tr>
                    <th>Leyenda</th> <th>{"  \u00B5g/m\u00b3"}</th>
                  </tr>
                  <tr>
                    <td>Emergencia</td> <td>330</td>
                  </tr>
                  <tr>
                    <td>Preemergencia</td> <td>285</td>
                  </tr>
                  <tr>
                    <td>Alerta</td> <td>195</td>
                  </tr>
                  <tr>
                    <td>Regular</td> <td>150</td>
                  </tr>
                  <tr>
                    <td>Bueno</td> <td>0</td>
                  </tr>
                </table>
              </Grid>
              <Grid item lg={6} xs={12} md={12} sm={12}>
                <table
                  border={1}
                  style={{ marginLeft: "35%", marginTop: "50px" }}
                >
                  <tr>
                    <th colSpan={2}>
                      <center>Mpp 2.5</center>
                    </th>
                  </tr>
                  <tr>
                    <th>Leyenda</th> <th>{"  \u00B5g/m\u00b3  "}</th>
                  </tr>
                  <tr>
                    <td>Emergencia</td> <td>170</td>
                  </tr>
                  <tr>
                    <td>Preemergencia</td> <td>140</td>
                  </tr>
                  <tr>
                    <td>Alerta</td> <td>80</td>
                  </tr>
                  <tr>
                    <td>Regular</td> <td>50</td>
                  </tr>
                  <tr>
                    <td>Bueno</td> <td>0</td>
                  </tr>
                </table>
              </Grid>
            </Grid>
          </Grid>

          <Typography
            style={{ marginTop: "50px" }}
            variant="h4"
            color="initial"
          >
            {" "}
            <b> Vuelos Específicos.</b>
          </Typography>

          {totalTotal.map((row, index) => (
            <Grid
              container
              style={{ marginLeft: "5px" }}
              spacing={1}
              id={"descarga" + index}
            >
              <Typography
                style={{ marginTop: "20px" }}
                variant="h5"
                color="initial"
              >
                {" "}
                <b> {row[7]}.</b>
              </Typography>
              <Grid item lg={12} xs={12} md={12} sm={12}>
                <table border="1" style={{ width: "100%", marginTop: "40px" }}>
                  {/* <tr>
                <th>peo</th>
              </tr> */}
                  <tr>
                    <td>
                      <Typography variant="subtitle1" color="initial">
                        {" "}
                        <b> Fecha de vuelo:</b> {seteaDate(row[8])}
                      </Typography>
                    </td>
                    <td colSpan={1}>
                      <Typography variant="subtitle1" color="initial">
                        {" "}
                        <b> Horario:</b> {row[11]}
                      </Typography>
                    </td>
                    <td colSpan={2}>
                      <Typography variant="subtitle1" color="initial">
                        {" "}
                        <b> Cantidad de muestras:</b> {row[9]}
                      </Typography>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={1}>
                      <Typography variant="subtitle1" color="initial">
                        {" "}
                        <b>Temperatura: </b> {row[10] + "°C"}
                      </Typography>
                    </td>
                    <td colSpan={1}>
                      <Typography variant="subtitle1" color="initial">
                        {" "}
                        <b> Altura: </b>
                        {row[12] + "m"}
                      </Typography>
                    </td>
                    <td colSpan={1}>
                      <Typography variant="subtitle1" color="initial">
                        {" "}
                        <b> % Mpp10: </b> {row[16] + " \u00B5g/m\u00b3"}
                      </Typography>
                    </td>
                    <td colSpan={1}>
                      <Typography variant="subtitle1" color="initial">
                        {" "}
                        <b> % Mpp2.5: </b> {row[17] + " \u00B5g/m\u00b3"}
                      </Typography>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={1}>
                      <Typography variant="subtitle1" color="initial">
                        {" "}
                        <b>min Mpp10: </b> {row[14] + " \u00B5g/m\u00b3"}
                      </Typography>
                    </td>
                    <td colSpan={1}>
                      <Typography variant="subtitle1" color="initial">
                        {" "}
                        <b> max Mpp10: </b>
                        {row[18] + " \u00B5g/m\u00b3"}
                      </Typography>
                    </td>
                    <td colSpan={1}>
                      <Typography variant="subtitle1" color="initial">
                        {" "}
                        <b> min Mpp2.5: </b> {row[15] + " \u00B5g/m\u00b3"}
                      </Typography>
                    </td>
                    <td colSpan={1}>
                      <Typography variant="subtitle1" color="initial">
                        {" "}
                        <b> max Mpp2.5: </b> {row[18] + " \u00B5g/m\u00b3"}
                      </Typography>
                    </td>
                  </tr>
                </table>
              </Grid>

              <Grid
                style={{ marginTop: "50px" }}
                item
                lg={6}
                xs={6}
                md={6}
                sm={6}
              >
                <GroupedBarReporte dataMpp={row[3]} />
              </Grid>
              <Grid
                style={{ marginTop: "50px" }}
                item
                lg={6}
                xs={6}
                md={6}
                sm={6}
              >
                <GraphLineReporte dataLine={row[4]} />
              </Grid>
              <Grid container>
                <Grid item lg={6} xs={6} md={6} sm={6}>
                  <GraphRadarReporte title="MPP 10" dataRadar={row[5]} />
                </Grid>
                <Grid item lg={6} xs={6} md={6} sm={6}>
                  <GraphRadarReporte title="MPP 2.5" dataRadar={row[6]} />
                </Grid>
              </Grid>
              <Grid
                container
                spacing={1}
                justify="center"
                alignItems="center"
                alignContent="center"
                wrap="nowrap"
              >
                <Grid item lg={6} xs={6} md={6} sm={6}>
                  <center>
                    <Typography variant="h4" color="initial">
                      Recorrido Mpp 10
                    </Typography>
                  </center>
                  <MapaleafReporte
                    gps={row[0][0]}
                    gps10={row[1][0]}
                    id={index}
                  />
                </Grid>
                <Grid item lg={6} xs={6} md={6} sm={6}>
                  <center>
                    <Typography variant="h4" color="initial">
                      Recorrido Mpp 2.5
                    </Typography>
                  </center>
                  <MapaleafReporte
                    gps={row[0][0]}
                    gps10={row[2][0]}
                    id={index + "index"}
                  />
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}
