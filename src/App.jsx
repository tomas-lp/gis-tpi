import React, { useState } from "react";
import { consulta, agregar, capas, regla, logo } from "./assets/imagenes";
import Mapa from "./components/mapa";
import ListaCapas from "./components/ListaCapas";
import { Tooltip } from "react-tooltip";
import Mensaje from "./components/Mensaje";
import InfoCapas from "./components/InfoCapas";

// import { fromLonLat, get as getProjection } from 'ol/proj';
// import proj4 from 'proj4';
// import { register } from 'ol/proj/proj4';

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
  
  return (
    <>
      <Mapa estado={estado}/>
      
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

      <Tooltip id="tooltip" style={{padding: 0, paddingLeft: '10px', paddingRight: '10px', marginTop: '-10px'}}/>

      {estado === 2 && <Mensaje texto='Dibuje los puntos del polígono que desee agregar.' setEstado={setEstado}/>}
      {estado === 3 && <Mensaje texto='Coloque los puntos entre los que quiera calcular Ia distancia.' setEstado={setEstado}/>}
      {estado === 4 && <Mensaje texto='Seleccione un punto o un área para obtener información.' setEstado={setEstado}/>}

      {estado === 4 && <InfoCapas />}
      
    </>
  );
}

export default MapView;