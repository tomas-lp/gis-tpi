import React, { useEffect, useState } from 'react';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Zoom from 'ol/control/Zoom';
import ScaleLine from 'ol/control/ScaleLine'
import { capaBase, capaAgregar } from '../utils/capas';
import { agregarInteraccionMedir, eliminarInteraccionMedir } from '../utils/interaccionMedir';
import { agregarInteraccionAgregar, eliminarInteraccionAgregar } from '../utils/interaccionAgregar';
import { agregarInteraccionConsulta, eliminarInteraccionConsulta } from '../utils/interaccionConsulta';


export default function Mapa({ estado, capasActivas, verInfoCapas, setVerInfoCapas }) {
  
  const [map, setMap] = useState(null);

  const limpiarInteracciones = () => {
    eliminarInteraccionMedir(map);
    eliminarInteraccionAgregar(map);
    eliminarInteraccionConsulta(map);
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
      const scaleControl = new ScaleLine({
        units: 'metric',
      });
      
      map.addControl(scaleControl);

      if (verInfoCapas) {
        map.removeControl(scaleControl);
      }
    }
  }, [map, verInfoCapas])

  useEffect(()=> {
    if (map) {
      let capasAMostrar = []
      
      capasActivas.forEach(capa => {
        if(capa.isVisible === true){
          capasAMostrar.push(capa.capaOL);
        }
      });

      map.setLayers([capaBase, ...capasAMostrar, capaAgregar])
    }
  }, [capasActivas])
  
  useEffect(()=> {
    if (map) {
      limpiarInteracciones();

      if (estado === 2) {
        agregarInteraccionAgregar(map)
      }
  
      if (estado === 3) {
        agregarInteraccionMedir(map);
      }

      if (estado === 4) {
        agregarInteraccionConsulta(map, setVerInfoCapas);
      }
    }
  }, [estado])

  return <div id='map' style={{ width: '100vw', height: '100vh' }} />;
}
