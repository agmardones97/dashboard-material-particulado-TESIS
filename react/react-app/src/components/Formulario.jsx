import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import * as regioneschile from "../comunas-regiones.json";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import "date-fns";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function LayoutTextFields() {
  const regiones = regioneschile.default.regiones;

  const MySwal = withReactContent(Swal);

  const classes = useStyles();
  const [errTituloText, setErrTituloText] = useState("");
  const [errTitulo, setErrTitulo] = useState(null);

  const [errDescripcionText, setErrDescripcionText] = useState("");
  const [errDescripcion, setErrDescripcion] = useState(null);

  const [errArchivoText, setErrArchivoText] = useState("");
  const [errArchivo, setErrArchivo] = useState(null);

  const [errComunaText, setErrComunaText] = useState("");
  const [errComuna, setErrComuna] = useState(null);

  const [errRegionText, setErrRegionText] = useState("");
  const [errRegion, setErrRegion] = useState(null);

  const [errTemperaturaText, setErrTemperaturaText] = useState("");
  const [errTemperatura, setErrTemperatura] = useState(null);

  const [errHorarioText, setErrHorarioText] = useState("");
  const [errHorario, setErrHorario] = useState(null);

  const [errAlturaText, setErrAlturaText] = useState("");
  const [errAltura, setErrAltura] = useState(null);

  const [archivos, setArchivos] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [region, setRegion] = useState("");
  const [comunas, setComunas] = useState([]);
  const [comuna, setComuna] = useState("");
  const [horario, setHorario] = useState("");
  const [altura, setAltura] = useState("");

  const [stateComuna, setStateComuna] = useState(true);

  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [errFechaText, setErrFechaText] = useState("");
  const [errFecha, setErrFecha] = useState(null);

  const handleDateChange = (date) => {
    console.log(date);
    setSelectedDate(date);
  };

  const subirArchivos = (e) => {
    setArchivos(e);
  };
  const seteaTitulo = (e) => {
    setTitulo(e);
  };
  const seteaDescripcion = (e) => {
    setDescripcion(e);
  };

  const seteaTemperatura = (e) => {
    setTemperatura(e);
  };

  const seteaHorario = (e) => {
    setHorario(e);
  };

  const seteaAltura = (e) => {
    setAltura(e);
  };

  const seteaRegion = (e) => {
    setRegion(e);
    regiones.map((reg) => {
      if (reg.region === e) {
        setComunas(reg.comunas);
        setStateComuna(false);
      }
    });
  };

  const seteaComuna = (e) => {
    console.log(comuna);
    setComuna(e);
  };

  const insertarArchivos = (e) => {
    e.preventDefault();
    let tit = false;
    let desc = false;
    let file = false;
    let file2 = false;
    let reg = false;
    let com = false;
    let tem = false;
    let hor = false;
    let alt = false;
    let fec = false;
    let ahora = new Date();

    if (selectedDate >= ahora) {
      setErrFechaText("La fecha no puede ser mayor a la actual.");
      setErrFecha(true);
      fec = false;
    } else {
      if (selectedDate === null) {
        setErrFechaText("No se ha seleccionado fecha.");
        setErrFecha(true);
        fec = false;
      } else {
        setErrFechaText("");
        setErrFecha(false);
        fec = true;
      }
    }

    if (titulo.trim() === "") {
      setErrTituloText("No se ha Ingresado Titulo.");
      setErrTitulo(true);
      tit = false;
    } else {
      setErrTituloText("");
      setErrTitulo(false);
      tit = true;
    }

    if (isNaN(temperatura)) {
      setErrTemperaturaText("Temperatura no válida.");
      setErrTemperatura(true);
      tem = false;
    } else {
      if (temperatura === "") {
        setErrTemperaturaText("No se ha ingresado Temperatura.");
        setErrTemperatura(true);
        tem = false;
      } else {
        setErrTemperaturaText("");
        setErrTemperatura(false);
        tem = true;
      }
    }

    if (isNaN(altura)) {
      setErrAlturaText("Altura no válida.");
      setErrAltura(true);
      alt = false;
    } else {
      if (altura === "") {
        setErrAlturaText("No se ha ingresado Altura de vuelo.");
        setErrAltura(true);
        alt = false;
      } else {
        if (parseInt(altura) <= 0) {
          setErrAlturaText("Altura de vuelo incorrecta.");
          setErrAltura(true);
          alt = false;
        } else {
          setErrAlturaText("");
          setErrAltura(false);
          alt = true;
        }
      }
    }

    if (horario === "") {
      setErrHorarioText("No se ha seleccionado Horario de Vuelo.");
      setErrHorario(true);
      hor = false;
    } else {
      setErrHorarioText("");
      setErrHorario(false);
      hor = true;
    }

    if (region === "") {
      setErrRegionText("No se ha seleccionado Región.");
      setErrRegion(true);
      reg = false;
    } else {
      setErrRegionText("");
      setErrRegion(false);
      reg = true;
    }

    if (comuna === "") {
      setErrComunaText("No se ha seleccionado Comuna.");
      setErrComuna(true);
      reg = false;
    } else {
      setErrComunaText("");
      setErrComuna(false);
      reg = true;
    }

    if (descripcion.trim() === "") {
      setErrDescripcionText("No se ha Ingresado Descripcion.");
      setErrDescripcion(true);
      desc = false;
    } else {
      setErrDescripcionText("");
      setErrDescripcion(false);
      desc = true;
    }

    if (archivos === null) {
      setErrArchivoText("No se ha Ingresado Archivo.");
      setErrArchivo(true);
      file = false;
    } else {
      setErrArchivoText("");
      setErrArchivo(false);
      file = true;
    }

    if (archivos !== null) {
      if (archivos.name.split(".")[1] !== "CSV") {
        setErrArchivoText("Tipo de archivo incorrecto, debe ser csv.");
        setErrArchivo(true);
        file2 = false;
      } else {
        setErrArchivoText("");
        setErrArchivo(false);
        file2 = true;
      }
    }

    if (
      errArchivo === false &&
      errDescripcion === false &&
      errArchivo === false &&
      errRegion === false &&
      errComuna === false &&
      errTemperatura === false &&
      errHorario === false &&
      errAltura === false &&
      errFecha === false
    ) {
      MySwal.fire({
        title: "¿Seguro que quieres agregar este vuelo?",
        text: "Posteriormente podrás eliminarlo si lo deseas.",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Agregar",
      }).then((result) => {
        if (result.isConfirmed) {
          const f = new FormData();

          f.append("files", archivos);
          f.append("titulo", titulo);
          f.append("descripcion", descripcion);
          f.append("region", region);
          f.append("comuna", comuna);
          f.append("temperatura", temperatura);
          f.append("horario", horario);
          f.append("altura", altura);
          f.append("fecha", selectedDate);

          axios.post(`http://127.0.0.1:5000/agregarfile`, f, {
              headers: { "Content-Type": "multipart/form-data" },
            })
            .then((response) => {
              MySwal.fire({
                position: "center",
                icon: "success",
                title: "¡El vuelo ha sido agregado con éxito!",
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
    } else {
      console.log(tit);
      console.log(desc);
      console.log(file);
      console.log(file2);
      console.log(reg);
      console.log(com);
    }
  };

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={3}
        direction="row"
        justify="center"
        alignItems="center"
        alignContent="center"
        wrap="nowrap"
      >
        <Grid item xs={1}></Grid>
        <Grid item xs={10}>
          <div>
            <Typography
              variant="h2"
              color="initial"
              style={{ marginBottom: "40px" }}
            >
              Ingrese los datos.
            </Typography>

            <form encType="multipart/form-data">
              <TextField
                error={errTitulo}
                id="outlined-full-width"
                label="Titulo"
                style={{ margin: 8 }}
                placeholder=""
                name="Titulo"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                onChange={(e) => seteaTitulo(e.target.value)}
              />
              <Typography style={{ margin: 8 }} variant="caption" color="error">
                {errTituloText}
              </Typography>
              <TextField
                error={errDescripcion}
                id="outlined-full-width"
                label="Descripción"
                style={{ margin: 8 }}
                placeholder=""
                name="Descripción"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                onChange={(e) => seteaDescripcion(e.target.value)}
              />
              <Typography style={{ margin: 8 }} variant="caption" color="error">
                {errDescripcionText}
              </Typography>
              <TextField
                error={errTemperatura}
                id="outlined-full-width"
                label="Temperatura (°C)"
                style={{ margin: 8 }}
                placeholder=""
                name="Temperatura"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                onChange={(e) => seteaTemperatura(e.target.value)}
              />
              <Typography style={{ margin: 8 }} variant="caption" color="error">
                {errTemperaturaText}
              </Typography>
              <TextField
                error={errAltura}
                id="outlined-full-width"
                label="Altura (m)"
                style={{ margin: 8 }}
                placeholder=""
                name="Altura"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                onChange={(e) => seteaAltura(e.target.value)}
              />
              <Typography style={{ margin: 8 }} variant="caption" color="error">
                {errAlturaText}
              </Typography>

              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  error={errFecha}
                  id="date-picker-dialog"
                  label="Fecha de vuelo"
                  format="dd/MM/yyyy"
                  value={selectedDate}
                  onChange={handleDateChange}
                  fullWidth
                  style={{ margin: 8 }}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
              <Typography style={{ margin: 8 }} variant="caption" color="error">
                {errFechaText}
              </Typography>

              <FormControl
                variant="outlined"
                className={classes.formControl}
                fullWidth
              >
                <InputLabel id="inputRegion">Horario de vuelo</InputLabel>
                <Select
                  labelId="labelHorario"
                  id="idHorario"
                  label="Age"
                  error={errHorario}
                  // helperText={error ? error.message : null}
                  onChange={(e) => seteaHorario(e.target.value)}
                  name="horario"
                >
                  <MenuItem value="mañana">Mañana (06:00 - 12:00)</MenuItem>
                  <MenuItem value="tarde">Tarde (13:00 - 19:00)</MenuItem>
                  <MenuItem value="noche">Noche (19:00 - 06:00)</MenuItem>
                </Select>
              </FormControl>
              <Typography style={{ margin: 8 }} variant="caption" color="error">
                {errHorarioText}
              </Typography>
              <TextField
                error={errArchivo}
                id="outlined-full-width"
                label="Subir archivo .csv"
                style={{ margin: 8 }}
                placeholder=""
                type="file"
                name="files"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                onChange={(e) => subirArchivos(e.target.files[0])}
              />
              <Typography style={{ margin: 8 }} variant="caption" color="error">
                {errArchivoText}
              </Typography>
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
                  error={errRegion}
                  // helperText={error ? error.message : null}
                  onChange={(e) => seteaRegion(e.target.value)}
                  name="region"
                >
                  {regiones.map((reg) => (
                    <MenuItem value={reg.region}>{reg.region}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography style={{ margin: 8 }} variant="caption" color="error">
                {errRegionText}
              </Typography>

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
                  error={errComuna}
                  // helperText={error ? error.message : null}
                  disabled={stateComuna}
                  onChange={(e) => seteaComuna(e.target.value)}
                  name="comuna"
                >
                  {comunas.map((com) => (
                    <MenuItem value={com}>{com}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography style={{ margin: 8 }} variant="caption" color="error">
                {errComunaText}
              </Typography>
              <Grid
                container
                spacing={1}
                direction="row"
                justify="center"
                alignItems="center"
                alignContent="center"
                wrap="nowrap"
              >
                <Button
                  onClick={(e) => insertarArchivos(e)}
                  type="submit"
                  size="large"
                  variant="contained"
                  color="primary"
                  style={{ align: "center" }}
                >
                  Guardar
                </Button>
              </Grid>
            </form>
          </div>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </div>
  );
}
