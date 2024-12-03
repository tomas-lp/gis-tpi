import React, { useState } from "react";
import { imgConsulta, imgAgregar, imgCapas, imgRegla, imgLogo, imgNorte } from "./assets/imagenes";
import Mapa from "./components/Mapa";
import ListaCapas from "./components/ListaCapas";
import { Tooltip } from "react-tooltip";
import Mensaje from "./components/Mensaje";
import InfoCapas from "./components/InfoCapas";
import Leyenda from "./components/Leyenda";
import { capas } from "./utils/capas";
import BotonEliminarPoligonos from "./components/BotonEliminarPoligonos";

import "ol/ol.css";
import './app.css';

// Estados en los que puede estar la aplicación.
export const ESTADOS = {
  defecto: 1,
  agregar: 2,
  medir: 3,
  consulta: 4
}

function MapView() {
  const [estado, setEstado] = useState(ESTADOS.defecto);
  const [verListaCapas, setVerListaCapas] = useState(false);
  const [verInfoCapas, setVerInfoCapas] = useState(false);
  const [capasActivas, setCapasActivas] = useState(capas)

  function actualizarEstado (nuevoEstado) {
    if (nuevoEstado === estado){
      setEstado(ESTADOS.defecto);
    } else {
      setEstado(nuevoEstado);
    }
  }
  
  return (
    <>

      <Mapa estado={estado} capasActivas={capasActivas} verInfoCapas={verInfoCapas} setVerInfoCapas={setVerInfoCapas}/>

      <img id="norte" src={imgNorte} alt="" />

      {estado !== ESTADOS.agregar && <p id="coordenadas">EPSG: 4326</p>}      

      
      <div id="controles">
        <div className="logo">
          <img src={imgLogo} alt="" />
        </div>
        
        <a
          className={`boton ${verListaCapas ? 'clickeado' : ''}`} 
          data-tooltip-id='tooltip' 
          data-tooltip-content="Capas"
          data-tooltip-place="top" 
          onClick={() => setVerListaCapas(!verListaCapas)}
        >
          <img src={imgCapas} alt="" />
        </a>
        
        <div> {verListaCapas && <ListaCapas className='lista-capas' capasActivas={capasActivas} setCapasActivas={setCapasActivas}/> }</div>
        
        <a 
          className={`boton ${estado === ESTADOS.agregar ? 'clickeado' : ''}`} 
          onClick={() => actualizarEstado(ESTADOS.agregar)}
          data-tooltip-id='tooltip' 
          data-tooltip-content="Agregar Polígono"
          data-tooltip-place="top"
        >
          <img src={imgAgregar} alt="" />
        </a>

        <a 
          className={`boton ${estado === ESTADOS.medir ? 'clickeado' : ''}`} 
          onClick={() => actualizarEstado(ESTADOS.medir)}
          data-tooltip-id='tooltip' 
          data-tooltip-content="Medir distancias"
          data-tooltip-place="top"
        >
          <img src={imgRegla} alt="" />
        </a>

        <a 
          className={`boton ${estado === ESTADOS.consulta ? 'clickeado' : ''}`} 
          onClick={() => actualizarEstado(ESTADOS.consulta)}
          data-tooltip-id='tooltip' 
          data-tooltip-content="Realizar consulta"
          data-tooltip-place="top"
        >
          <img src={imgConsulta} alt="" />
        </a>
      
      </div>

      <Tooltip id="tooltip" style={{padding: 0, paddingLeft: '10px', paddingRight: '10px', marginTop: '-10px'}}/>
      <Leyenda capas={capasActivas}/>

      {estado === ESTADOS.agregar && <Mensaje texto='Dibuje los puntos del polígono que desee agregar.' setEstado={setEstado}/>}
      {estado === ESTADOS.medir && <Mensaje texto='Coloque los puntos entre los que quiera calcular Ia distancia.' setEstado={setEstado}/>}
      {estado === ESTADOS.consulta && <Mensaje texto='Seleccione un punto o un área para obtener información.' setEstado={setEstado}/>}

      {estado === ESTADOS.consulta && verInfoCapas && <InfoCapas />}
      {estado === ESTADOS.agregar && <BotonEliminarPoligonos/>}

      
    </>
  );
}

export default MapView;