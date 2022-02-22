import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";

const Mapaleaf = (gps) => {
    const arrBueno = [];
    const arrRegular = [];
    const arrAlerta = [];
    const arrPreemergencia = [];
    const arrEmergencia = [];

    const arrBuenoMP = [];
    const arrRegularMP = [];
    const arrAlertaMP = [];
    const arrPreemergenciaMP = [];
    const arrEmergenciaMP = [];

    const [showMpp, setShowMpp] = useState('');
    

    if(gps.gps10){
      for(const i in gps.gps10){
        // console.log(gps.gps10[i][2])
        if(gps.gps10[i][2] === 0){
          arrBueno.push([gps.gps10[i][0],gps.gps10[i][1]]);
          arrBuenoMP.push(gps.gps10[i][3]);
        }
        if(gps.gps10[i][2] === 1){
          arrRegular.push([gps.gps10[i][0],gps.gps10[i][1]]);
          arrRegularMP.push(gps.gps10[i][3])
        }
        if(gps.gps10[i][2] === 2){
          arrAlerta.push([gps.gps10[i][0],gps.gps10[i][1]]);
          arrAlertaMP.push(gps.gps10[i][3])
        }
        if(gps.gps10[i][2] === 3){
          arrPreemergencia.push([gps.gps10[i][0],gps.gps10[i][1]]);
          arrPreemergenciaMP.push(gps.gps10[i][3])
        }
        if(gps.gps10[i][2] === 4){
          arrEmergencia.push([gps.gps10[i][0],gps.gps10[i][1]]);
          arrEmergenciaMP.push(gps.gps10[i][3])
        }
        
      }
    }

    const mapRef = useRef(null)
    const tileRef = useRef(null)
    const controlRef = useRef(null)
    const layerRef = useRef(null)
  
    // Base tile for the map:
    tileRef.current = L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    const mapStyles = {
      overflow: "hidden",
      width: "100%",
      maxHeight: 550
    };
  
    // Options for our map instance:
    const mapParams = {
      center: [-39.27462355366598, -71.97519956180385], // USA, 
      zoom: 17,
      zoomControl: false,
      maxBounds: L.latLngBounds(L.latLng(-150, -240), L.latLng(150, 240)),
      closePopupOnClick: false,
      layers: [tileRef.current] // Start with just the base layer
    };
    
    // Map creation:
    useEffect(() => {
      mapRef.current = L.map("map", mapParams);
    }, []);
  
    // Controls:
    useEffect(() => {
      // Add the base layer to the control:
      controlRef.current = L.control.layers(
        { OpenStreetMap: tileRef.current }
      ).addTo(mapRef.current);
  
      // Add zoomControl:
      L.control.zoom({ 
        position: "topright" 
      }).addTo(mapRef.current);
    }, [])
  
    // Map events:
    useEffect(() => {
      mapRef.current.on("zoomstart", () => {
        console.log("ZOOM STARTED");
      });
    }, [])

    useEffect(() => {
      /*Legend specific*/
      var legend = L.control({ position: "bottomright" });

      legend.onAdd = function(map) {
        var div = L.DomUtil.create("div", "legend");
        div.style.cssText = 'line-height:18px ; color: #555; background: #fff; padding-left: 18px; padding-right: 18px; padding-bottom: 18px; opacity:0.9; border-radius: 10px';
        div.innerHTML += "<h4>Leyenda</h4>";
        div.innerHTML += '<i style="background: #ff0000; width:18px; height:18px; float: left; margin-right: 8px; opacity: 0.7"></i><span>Emergencia</span><br>';
        div.innerHTML += '<i style="background: #ff7608; width:18px; height:18px; float: left; margin-right: 8px; opacity: 0.7"></i><span>Preemergencia</span><br>';
        div.innerHTML += '<i style="background: #ffcd08; width:18px; height:18px; float: left; margin-right: 8px; opacity: 0.7"></i><span>Alerta</span><br>';
        div.innerHTML += '<i style="background: #f6fd14; width:18px; height:18px; float: left; margin-right: 8px; opacity: 0.7"></i><span>Regular</span><br>';
        div.innerHTML += '<i style="background: #11f504; width:18px; height:18px; float: left; margin-right: 8px; opacity: 0.7"></i><span>Bueno</span><br>';

        return div;
      };
      
      legend.addTo(mapRef.current);
    }, [])

    useEffect(() => {
      /*Legend specific*/
      const mpp = L.control({ position: "topleft" });

      mpp.onAdd = function(map) {
        var div = L.DomUtil.create("div", "mpp");
        div.id = 'divMpp'
        div.style.cssText = 'line-height:18px ; color: #555; background: #fff; padding-left: 18px; padding-right: 18px; padding-bottom: 18px; opacity:0.9; border-radius: 10px';
        div.innerHTML += "<h4>Valor</h4>";
        div.innerHTML += '<i id="iMpp" style="background: #fff; width:18px; height:18px; float: left; margin-right: 8px; opacity: 0.7"></i><span id="spanMpp">'+showMpp+'</span><br>';

        return div;
      };
      
      mpp.addTo(mapRef.current);
      
    }, [])

    useEffect(()=> {

      if (mapRef.current.hasLayer(layerRef.current)){
        mapRef.current.removeLayer(layerRef.current)
      }
      
      layerRef.current = L.layerGroup().addTo(mapRef.current);
      layerRef.current.clearLayers()

      // var polygone = L.polyline(gps['gps'], {color: 'black', fill:false}).addTo(layerRef.current);
      var polygone = L.polyline(gps['gps'], {color: 'black', fill:false}).addTo(layerRef.current);
      
      if (polygone.isEmpty() === false){
        mapRef.current.setView([polygone._bounds.getCenter().lat,polygone._bounds.getCenter().lng])
        
      }

      function a(data){
        var mpp = L.DomUtil.get('spanMpp');
        var c = L.DomUtil.get('iMpp');
        c.style.background = '#11f504'
        mpp.innerHTML = data + ' \u00B5g/m\u00b3';
      }

      function b(data){
        var mpp = L.DomUtil.get('spanMpp');
        var c = L.DomUtil.get('iMpp');
        c.style.background = '#f6fd14'
        mpp.innerHTML = data + ' \u00B5g/m\u00b3';
      }

      function c(data){
        var mpp = L.DomUtil.get('spanMpp');
        var c = L.DomUtil.get('iMpp');
        c.style.background = '#ffcd08'
        mpp.innerHTML = data + ' \u00B5g/m\u00b3';
      }

      function d(data){
        var mpp = L.DomUtil.get('spanMpp');
        var c = L.DomUtil.get('iMpp');
        c.style.background = '#ff7608'
        mpp.innerHTML = data + ' \u00B5g/m\u00b3';
      }

      function e(data){
        var mpp = L.DomUtil.get('spanMpp');
        var c = L.DomUtil.get('iMpp');
        c.style.background = '#ff0000'
        mpp.innerHTML = data + ' \u00B5g/m\u00b3';
      }


      if(gps.gps10){

        for(const j in arrBueno){
          // console.log(arrBuenoMP[j])
          L.circle(arrBueno[j], {radius:2, color:'#11f504'}).on('mouseover', () => { a(arrBuenoMP[j]) }).addTo(layerRef.current)
          
        }
        for(const j in arrRegular){
          // console.log(arrRegularMP[j])
          L.circle(arrRegular[j], {radius:2, color:'#f6fd14'}).on('mouseover', () => { b(arrRegularMP[j]) }).addTo(layerRef.current)
        }
        for(const j in arrAlerta){
          // console.log(arrAlerta[j])
          L.circle(arrAlerta[j], {radius:2, color:'#ffcd08'}).on('mouseover', () => { c(arrAlertaMP[j]) }).addTo(layerRef.current)
        }
        for(const j in arrPreemergencia){
          // console.log(arrPreemergencia[j])
          L.circle(arrPreemergencia[j], {radius:2, color:'#ff7608'}).on('mouseover', () => { d(arrPreemergenciaMP[j]) }).addTo(layerRef.current)
        }
        for(const j in arrEmergencia){
          // console.log(arrEmergencia[j])
          L.circle(arrEmergencia[j], {radius:2, color:'#ff0000'}).on('mouseover', () => { e(arrEmergenciaMP[j]) }).addTo(layerRef.current)
        }
    }

    })

  return (
    
    <div>
      <div id="map" style={mapStyles} />
    </div>
    
  )
  
}

export default Mapaleaf