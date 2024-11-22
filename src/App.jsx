import React, { useEffect, useState } from "react";
import Map from "ol/Map.js";
import View from "ol/View.js";
import TileLayer from "ol/layer/Tile.js";
import { TileWMS } from "ol/source";
import Zoom from 'ol/control/Zoom';

import consulta from './assets/consulta.png';
import agregar from './assets/agregar.png';
import capas from './assets/capas.png';
import regla from './assets/regla.png';
import logo from './assets/mundo.png';
import ListaCapas from "./components/ListaCapas";
import { Tooltip } from "react-tooltip";
import Mensaje from "./components/Mensaje";
import InfoCapas from "./components/InfoCapas";

import { fromLonLat, get as getProjection } from 'ol/proj';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';

import "ol/ol.css";
import './app.css';

const ESTADOS = {
  defecto: 0,
  capas: 1,
  agregar: 2,
  medir: 3,
  consulta: 4
}

function MapView() {
  const [estado, setEstado] = useState(0);

  function actualizarEstado (numero) {
    if (numero === estado){
      setEstado(0);
    } else {
      setEstado(numero);
    }
  }
  
  useEffect(() => {
    //Centro argentina
    //proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');
    //register(proj4);

    const map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new TileWMS({
            url: "https://wms.ign.gob.ar/geoserver/ows",
            params: {
              LAYERS: 'capabaseargenmap',
              VERSION: '1.1.1'
          }}),
          }),
      ],
      view: new View({
        // Para preguntar
        // projection: getProjection('EPSG:4326'), // Usar EPSG:4326
        // center: fromLonLat([-64.5, -38.5]), // Coordenadas de Argentina (aproximado)
        // zoom: 4, // Nivel de zoom

        center: [-7288745,-4959008],
        zoom: 4.5,
      }),
      controls: [],
    });

    const zoomControl = new Zoom({
      target: '',
    });
    map.addControl(zoomControl);
    
    return () => {
      map.setTarget(null);
    };
  }, []);
  
  
  return (
    <>

      <div id="map" style={{ width: "100vw", height: "100vh"}} />
      <div id="controles">
        <div className="logo">
          <img src={logo} alt="" />
        </div>
        
        <a
          className={`boton ${estado === 1 ? 'clickeado' : ''}`} 
          data-tooltip-id='tooltip' 
          data-tooltip-content="Capas"
          data-tooltip-place="top" 
          onClick={() => actualizarEstado(1)}
        >
          <img src={capas} alt="" />
        </a>
        
        <div> {estado === 1 && <ListaCapas className='lista-capas'/> }</div>
        
        <a 
          className={`boton ${estado === 2 ? 'clickeado' : ''}`} onClick={() => actualizarEstado(2)}
          data-tooltip-id='tooltip' 
          data-tooltip-content="Agregar Polígono"
          data-tooltip-place="top"
        >
          <img src={agregar} alt="" />
        </a>

        <a 
          className={`boton ${estado === 3 ? 'clickeado' : ''}`} onClick={() => actualizarEstado(3)}
          data-tooltip-id='tooltip' 
          data-tooltip-content="Medir distancias"
          data-tooltip-place="top"
        >
          <img src={regla} alt="" />
        </a>

        <a 
          className={`boton ${estado === 4 ? 'clickeado' : ''}`} onClick={() => actualizarEstado(4)}
          data-tooltip-id='tooltip' 
          data-tooltip-content="Realizar consulta"
          data-tooltip-place="top"
        >
          <img src={consulta} alt="" />
        </a>

      
      </div>
      

      <div id="medir-distancia">
        
      </div>

      <Tooltip id="tooltip" style={{padding: 0, paddingLeft: '10px', paddingRight: '10px', marginTop: '-10px'}}/>

      {estado === 2 && <Mensaje texto='Dibuje los puntos del polígono que desee agregar.' setEstado={setEstado}/>}
      {estado === 3 && <Mensaje texto='Coloque los puntos entre los que quiera calcular Ia distancia.' setEstado={setEstado}/>}
      {estado === 4 && <Mensaje texto='Seleccione un punto o un área para obtener información.' setEstado={setEstado}/>}

      {estado === 4 && <InfoCapas />}
      
    </>
  );
}

export default MapView;