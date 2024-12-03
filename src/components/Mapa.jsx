import React, { useEffect, useState } from 'react';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Zoom from 'ol/control/Zoom';
import ScaleLine from 'ol/control/ScaleLine'
import { capaBase, capaAgregar } from '../utils/capas';
import { agregarInteraccionMedir, eliminarInteraccionMedir } from '../utils/interaccionMedir';
import { agregarInteraccionAgregar, eliminarInteraccionAgregar } from '../utils/interaccionAgregar';
import { agregarInteraccionConsulta, eliminarInteraccionConsulta } from '../utils/interaccionConsulta';
import { ESTADOS } from '../App';


export default function Mapa({ estado, capasActivas, verInfoCapas, setVerInfoCapas }) {
  
  const [map, setMap] = useState(null);

  // Funcion para quitar las interacciones de cada herramienta.
  // Usada al cambiar de estados en la aplicacion.
  const limpiarInteracciones = () => {
    eliminarInteraccionMedir(map);
    eliminarInteraccionAgregar(map);
    eliminarInteraccionConsulta(map);
  }

  // Crea el mapa la primera vez.
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

    const scaleControl = new ScaleLine({
      units: 'metric',
    });
    map.addControl(scaleControl);
    
    setMap(map);

    return () => {
      map.setTarget(null);
    };
  }, []);

  // Actualiza el mapa cuando se agreguen o quiten capas.
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
  
  // Actualiza las interacciones del mapa en función del estado de la aplicación.
  useEffect(()=> {
    if (map) {
      limpiarInteracciones();

      if (estado === ESTADOS.agregar) {
        agregarInteraccionAgregar(map)
      }
  
      if (estado === ESTADOS.medir) {
        agregarInteraccionMedir(map);
      }

      if (estado === ESTADOS.consulta) {
        agregarInteraccionConsulta(map, setVerInfoCapas);
      }
    }
  }, [estado])

  return <div id='map' style={{ width: '100vw', height: '100vh' }} />;
}
