import React, { useState, useEffect, Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import GroupedBar from "./Graph";
import { GraphRadar } from "./GraphRadar";
import { GraphLine } from "./GraphLine";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Mapaleaf from "./Mapa";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import clsx from "clsx";
import { lighten } from "@material-ui/core/styles";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import jsPDF from "jspdf";
import ReactDOM from "react-dom";
import { Bar } from "react-chartjs-2";
import html2canvas from "html2canvas";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function TabPanel2(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel2.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `wrapped-tab-${index}`,
    "aria-controls": `wrapped-tabpanel-${index}`,
  };
}
function a11yProps2(index) {
  return {
    id: `wrapped-tab-${index}`,
    "aria-controls": `wrapped-tabpanel-${index}`,
  };
}

// ###################################################################################################

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "titulo",
    numeric: false,
    disablePadding: true,
    label: "Titulo",
  },
  { id: "fecha", numeric: true, disablePadding: false, label: "Fecha" },
  {
    id: "temperatura",
    numeric: true,
    disablePadding: false,
    label: "Temperatura (°C)",
  },
  { id: "altura", numeric: true, disablePadding: false, label: "Altura (m)" },
  { id: "horario", numeric: true, disablePadding: false, label: "horario" },
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const numSelected = props.numSelected;
  const comuna = props.comuna;
  // console.log(numSelected)
  const selec = props.seleccionados;
  // console.log(props.seleccionados)

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} Seleccionados
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Listado de Vuelos
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon onClick={() => deleteSeleccionados(selec, comuna)} />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

const topdf = () => {
  cData = {
    labels: ["L 1", "L 2", "L 3", "L 4", "L 5"],
    datasets: [
      {
        label: "Label",
        data: [100, 150, 123, 170, 162],
        backgroundColor: ["red", "green", "yellow", "blue", "orange", "red"],
      },
    ],
  };

  div2PDF = (e) => {
    /////////////////////////////
    // Hide/show button if you need
    /////////////////////////////

    const but = e.target;
    but.style.display = "none";
    let input = window.document.getElementsByClassName("div2PDF")[0];

    html2canvas(input).then((canvas) => {
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "pt");
      pdf.addImage(
        img,
        "png",
        input.offsetLeft,
        input.offsetTop,
        input.clientWidth,
        input.clientHeight
      );
      pdf.save("chart.pdf");
      but.style.display = "block";
    });
  };
  return (
    <div>
    <div className="div2PDF">
      <Bar
        data={this.cData}
        options={{
          title: {
            display: true,
            text: "Chart to PDF Demo",
            fontSize: 32
          },
          legend: {
            display: true,
            position: "right"
          }
        }}
        height={200}
      />
    </div>
    <div>
      <button onClick={(e) => this.div2PDF(e)}>Export 2 PDF</button>
    </div>
  </div>
  );
};

function deleteSeleccionados(seleccionados, comuna) {
  console.log(seleccionados);
  const MySwal = withReactContent(Swal);
  MySwal.fire({
    title: "¿Seguro que quieres eliminar estos vuelos?",
    text: "No se podrán recuperar una vez eliminados.",
    icon: "warning",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Agregar",
  }).then((result) => {
    if (result.isConfirmed) {
      const f = new FormData();

      f.append("seleccionados", seleccionados.join());
      console.log(f);
      axios
        .post(`http://127.0.0.1:5000/deleteVuelos`, f, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          MySwal.fire({
            position: "center",
            icon: "success",
            title: "¡los vuelos han sido eliminados con éxito!",
            showConfirmButton: false,
            timer: 1500,
          });
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 330,
  },
  radar: {
    // maxHeight: "100%"
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));
// ###################################################################################################

export default function StickyHeadTable() {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [gps, setGps] = useState({ data: [] });
  const [gps10, setGps10] = useState({ data: [] });
  const [gps25, setGps25] = useState({ data: [] });
  const [region, setRegion] = useState("");
  const [comunas, setComunas] = useState([]);
  const [comuna, setComuna] = useState("");
  const [stateComuna, setStateComuna] = useState(true);
  const [get, setGet] = useState([]);

  const [regi, setReg] = useState([]);

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

  const [dataLineGraph, setDataLineGraph] = useState({
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
  });

  const [dataRadarGraph10, setDataRadarGraph10] = useState({
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
  });

  const [dataRadarGraph25, setDataRadarGraph25] = useState({
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
  });

  const [value, setValue] = React.useState("one");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [value2, setValue2] = React.useState("three");

  const handleChange2 = (event, newValue) => {
    setValue2(newValue);
  };

  const getMpp = async (comuna) => {
    const res = await axios(`http://127.0.0.1:5000/getmpp/` + comuna);
    setData(res.data);
    console.log(res.data);
  };

  const getRegiones = async () => {
    const res = await axios(`http://127.0.0.1:5000/getRegion`);
    console.log(Object.keys(res.data.datos));
    setGet(res.data.datos);
    setReg(Object.keys(res.data.datos));
  };

  useEffect(() => {
    getRegiones();
  }, []);

  const seteaRegion = (e) => {
    setRegion(e);
    setComunas(get[e]);
    setStateComuna(false);
  };

  const seteaComuna = (e) => {
    // console.log(comuna);
    setComuna(e);
    getMpp(e);
  };

  const avgmpp10 = (dataMp10, lenDataMp10) => {
    let sum = 0;

    for (let i = 0; i <= lenDataMp10; i++) {
      sum = sum + parseInt(dataMp10[i].mp10);
    }
    //console.log(sum/lenDataMp10)
    let promedioMp10 = sum / lenDataMp10;
    return promedioMp10.toFixed(2);
  };

  const avgmpp25 = (dataMp25, lenDataMp25) => {
    let sum = 0;

    for (let i = 0; i <= lenDataMp25; i++) {
      if (dataMp25[i].mp25 != null) {
        sum = sum + parseInt(dataMp25[i].mp25);
      }
    }
    let promedioMp25 = sum / lenDataMp25;
    return promedioMp25.toFixed(2);
  };

  const showDatarow = async (id) => {
    // console.log(id)
    let data = [];
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

    // console.log(id)

    await axios(`http://127.0.0.1:5000/getmppid/` + id)
      .then((response) => {
        data = response.data;
        // console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });

    //console.log(data['datos'][0][0].lon)
    lendata = data["lendata"];
    for (let i = 0; i <= lendata - 1; i++) {
      arrGps[i] = [data["datos"][0][i].lat, data["datos"][0][i].lon];

      if (parseInt(data["datos"][0][i].mp25) <= 50) {
        arrGps25[i] = [
          data["datos"][0][i].lat,
          data["datos"][0][i].lon,
          0,
          data["datos"][0][i].mp25,
        ];
        contBueMp25 = contBueMp25 + 1;
      }
      if (
        parseInt(data["datos"][0][i].mp25) > 50 &&
        parseInt(data["datos"][0][i].mp25) <= 80
      ) {
        arrGps25[i] = [
          data["datos"][0][i].lat,
          data["datos"][0][i].lon,
          1,
          data["datos"][0][i].mp25,
        ];
        contRegMp25 = contRegMp25 + 1;
      }
      if (
        parseInt(data["datos"][0][i].mp25) > 80 &&
        parseInt(data["datos"][0][i].mp25) <= 110
      ) {
        arrGps25[i] = [
          data["datos"][0][i].lat,
          data["datos"][0][i].lon,
          2,
          data["datos"][0][i].mp25,
        ];
        contAleMp25 = contAleMp25 + 1;
      }
      if (
        parseInt(data["datos"][0][i].mp25) > 110 &&
        parseInt(data["datos"][0][i].mp25) <= 140
      ) {
        arrGps25[i] = [
          data["datos"][0][i].lat,
          data["datos"][0][i].lon,
          3,
          data["datos"][0][i].mp25,
        ];
        contPreMp25 = contPreMp25 + 1;
      }
      if (parseInt(data["datos"][0][i].mp25) > 140) {
        arrGps25[i] = [
          data["datos"][0][i].lat,
          data["datos"][0][i].lon,
          4,
          data["datos"][0][i].mp25,
        ];
        contEmeMp25 = contEmeMp25 + 1;
      }

      if (parseInt(data["datos"][0][i].mp10) <= 150) {
        arrGps10[i] = [
          data["datos"][0][i].lat,
          data["datos"][0][i].lon,
          0,
          data["datos"][0][i].mp10,
        ];
        contBueMp10 = contBueMp10 + 1;
      }
      if (
        parseInt(data["datos"][0][i].mp10) > 150 &&
        parseInt(data["datos"][0][i].mp10) <= 195
      ) {
        arrGps10[i] = [
          data["datos"][0][i].lat,
          data["datos"][0][i].lon,
          1,
          data["datos"][0][i].mp10,
        ];
        contRegMp10 = contRegMp10 + 1;
      }
      if (
        parseInt(data["datos"][0][i].mp10) > 195 &&
        parseInt(data["datos"][0][i].mp10) <= 240
      ) {
        arrGps10[i] = [
          data["datos"][0][i].lat,
          data["datos"][0][i].lon,
          2,
          data["datos"][0][i].mp10,
        ];
        contAleMp10 = contAleMp10 + 1;
      }
      if (
        parseInt(data["datos"][0][i].mp10) > 240 &&
        parseInt(data["datos"][0][i].mp10) <= 285
      ) {
        arrGps10[i] = [
          data["datos"][0][i].lat,
          data["datos"][0][i].lon,
          3,
          data["datos"][0][i].mp10,
        ];
        contPreMp10 = contPreMp10 + 1;
      }
      if (parseInt(data["datos"][0][i].mp10) > 330) {
        arrGps10[i] = [
          data["datos"][0][i].lat,
          data["datos"][0][i].lon,
          4,
          data["datos"][0][i].mp10,
        ];
        contEmeMp10 = contEmeMp10 + 1;
      }

      if (data["datos"][0][i].mp25 != null) {
        arrMpp25.push(parseInt(data["datos"][0][i].mp25));
        sumMpp25 = sumMpp25 + parseInt(data["datos"][0][i].mp25);
      }

      if (
        data["datos"][0][i].mp10 != null &&
        data["datos"][0][i].mp10 !== "0"
      ) {
        arrMpp10.push(parseInt(data["datos"][0][i].mp10));
        sumMpp10 = sumMpp10 + parseInt(data["datos"][0][i].mp10);
      }
    }

    let avgMpp25 = sumMpp25 / lendata;
    //console.log(avgMpp25)
    let avgMpp10 = sumMpp10 / lendata;
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
          data: [avgMpp10, avgMpp25],
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
    setGps10({ data: [arrGps10] });
    setGps25({ data: [arrGps25] });
    setDataMpp({
      dataMpp: datos,
    });

    for (var i = 0; i < data["lendata"]; i++) {
      cont.push(i);
      val10.push(data["datos"][0][i].mp10);
      val25.push(data["datos"][0][i].mp25);
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
  };

  const seteaDate = (fecha) => {
    let datee = new Date(fecha);
    return datee.toLocaleDateString();
  };

  // ###########################################################################################################

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  // ###########################################################################################################

  return (
    <div>
      <Grid container spacing={5}>
        <Grid item lg={6} xs={6} md={6} sm={6}>
          <FormControl
            variant="outlined"
            className={classes.formControl}
            fullWidth
          >
            <InputLabel id="inputRegion">Región</InputLabel>
            <Select
              labelId="labelRegion"
              id="idRegion"
              label="Age"
              onChange={(e) => seteaRegion(e.target.value)}
              name="region"
            >
              {regi.map((reg) => (
                <MenuItem value={reg}>{reg}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item lg={6} xs={6} md={6} sm={6}>
          <FormControl
            variant="outlined"
            className={classes.formControl}
            fullWidth
          >
            <InputLabel id="inputComuna">Comuna</InputLabel>
            <Select
              labelId="labelComuna"
              id="idComuna"
              label="Comuna"
              name="comuna"
              disabled={stateComuna}
              onChange={(e) => seteaComuna(e.target.value)}
            >
              {comunas.map((com) => (
                <MenuItem value={com}>{com}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* ######################################################################################################## */}

      <Grid container spacing={5}>
        <Grid item xs={12}>
          {/* ##################################################################################################################### */}
          {/* TABLA*/}

          <Paper className={classes.paper}>
            <EnhancedTableToolbar
              numSelected={selected.length}
              seleccionados={selected}
              comuna={comuna}
            />
            <TableContainer>
              <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                size={dense ? "small" : "medium"}
                aria-label="enhanced table"
              >
                <EnhancedTableHead
                  classes={classes}
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={data.length}
                />
                <TableBody>
                  {stableSort(data, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row._id);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          onClick={() => showDatarow(row._id)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row._id}
                          selected={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              inputProps={{ "aria-labelledby": labelId }}
                              onClick={(event) => handleClick(event, row._id)}
                            />
                          </TableCell>
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                          >
                            {row.titulo}
                          </TableCell>

                          <TableCell align="right">
                            {seteaDate(row.fecha)}
                          </TableCell>
                          <TableCell align="right">
                            {parseInt(row.temperatura)}
                          </TableCell>
                          <TableCell align="right">
                            {parseInt(row.altura)}
                          </TableCell>
                          <TableCell align="right">{row.horario}</TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
          <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Dense padding"
          />
        </Grid>
        {/* ################################################################################################################## */}
        <Grid item lg={6} xs={12} md={12} sm={12}>
          <AppBar position="static">
            <Tabs
              value={value2}
              onChange={handleChange2}
              aria-label="wrapped label tabs example"
              centered
            >
              <Tab
                value="three"
                label="Concentración MPP"
                {...a11yProps2("three")}
              />
              <Tab value="four" label="Conteo" {...a11yProps2("four")} />
              <Tab value="five" label="Linea" {...a11yProps2("five")} />
            </Tabs>
          </AppBar>

          <TabPanel2 value={value2} index="three">
            <GroupedBar dataMpp={dataMpp} />
          </TabPanel2>

          <TabPanel2 value={value2} index="four">
            <Grid
              container
              spacing={1}
              direction="row"
              justify="center"
              alignItems="center"
              alignContent="center"
              wrap="nowrap"
            >
              <Grid item lg={6} xs={6} md={6} sm={6}>
                <div className={classes.radar}>
                  <GraphRadar title="MPP 10" dataRadar={dataRadarGraph10} />
                </div>
              </Grid>
              <Grid item lg={6} xs={6} md={6} sm={6}>
                <div className={classes.radar}>
                  <GraphRadar title="MPP 25" dataRadar={dataRadarGraph25} />
                </div>
              </Grid>
            </Grid>
          </TabPanel2>
          <TabPanel2 value={value2} index="five">
            <GraphLine dataLine={dataLineGraph} />
          </TabPanel2>
        </Grid>

        <Grid item lg={6} xs={12} md={12} sm={12}>
          <AppBar position="static">
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="wrapped label tabs example"
              centered
            >
              <Tab value="one" label="MPP 10" {...a11yProps("one")} />
              <Tab value="two" label="MPP 2.5" {...a11yProps("two")} />
            </Tabs>
          </AppBar>

          <TabPanel value={value} index="one">
            <Mapaleaf gps={gps["data"]} gps10={gps10["data"][0]} />
          </TabPanel>

          <TabPanel value={value} index="two">
            <Mapaleaf gps={gps["data"]} gps10={gps25["data"][0]} />
          </TabPanel>
        </Grid>
      </Grid>
    </div>
  );
}
