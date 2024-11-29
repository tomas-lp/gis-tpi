import React, { useEffect, useState } from 'react';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Zoom from 'ol/control/Zoom';
import { capaBase } from '../utils/capas';
import { agregarInteraccionMedir, eliminarInteraccionMedir } from '../utils/interaccionMedir';


export default function Mapa({ estado, capasActivas }) {

  const [map, setMap] = useState(null);

  const limpiarInteracciones = () => {
    eliminarInteraccionMedir(map);
  }

  useEffect(() => {

    const map = new Map({
      target: 'map',
      layers: [capaBase],
      view: new View({

        center: [-7288745, -4959008],
        zoom: 4.5,
      }),
      controls: [],
    });

    const zoomControl = new Zoom({
      target: '',
    });
    map.addControl(zoomControl);

    // agregarInteraccionMedir(map);
    setMap(map);

    return () => {
      map.setTarget(null);
    };
  }, []);

  useEffect(()=> {
    if (map) {
      let capasAMostrar = []
      
      capasActivas.forEach(capa => {
        if(capa.isVisible === true){
          capasAMostrar.push(capa.capaOL);
        }
      });

      map.setLayers([capaBase, ...capasAMostrar])
    }
  }, [capasActivas])
  
  useEffect(()=> {
    if (map) {
      limpiarInteracciones();
  
      if (estado === 3) {
        agregarInteraccionMedir(map);
      }
    }
  }, [estado])

  return <div id='map' style={{ width: '100vw', height: '100vh' }} />;
}
