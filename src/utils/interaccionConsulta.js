import { GeoJSON, WFS } from 'ol/format.js';
import { Stroke, Style } from 'ol/style.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import { DragBox } from 'ol/interaction';
import { bbox } from 'ol/format/filter.js';
import { nombreCapasCatedra, capas } from './capas';
import { always } from 'ol/events/condition';
import { transform } from 'ol/proj';
import { Pointer } from 'ol/interaction.js';
import { getCenter } from 'ol/extent.js';
import { fromCircle } from 'ol/geom/Polygon.js';
import { Vector as VectorSource } from 'ol/source.js';
import { Circle as CircleGeom } from 'ol/geom.js';
import Feature from 'ol/Feature.js';
import { Fill } from 'ol/style.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Zoom from 'ol/control/Zoom';


const vectorSource = new VectorSource();

const capaConsulta = new VectorLayer({
  source: vectorSource,
  style: new Style({
    stroke: new Stroke({
      color: [0, 0, 255, 1],
      width: 2,
    }),
  }),
});

let selectInteraction = new DragBox({
  condition: always, // Volver a always para que sea la interacción por defecto
  style: new Style({
    stroke: new Stroke({
      color: [0, 0, 255, 1],
    }),
  }),
});

// Crear una interacción de puntero personalizada para el círculo con Ctrl
let circleInteraction = new Pointer({});


export const agregarInteraccionConsulta = (map, setVerInfoCapas) => {

  circleInteraction.handleEvent = function (mapBrowserEvent) {
    if (
      mapBrowserEvent.type === 'click' //&& mapBrowserEvent.originalEvent.ctrlKey
    ) {
      setVerInfoCapas(false);
      const coordinate = mapBrowserEvent.coordinate;
      realizarConsultaCirculo(this.getMap(), coordinate, setVerInfoCapas);
      return false; // Detener la propagación del evento
    }
    return true;
  };
  // Interacción de DragBox (para arrastrar)
  selectInteraction.on('boxend', function (evt) {
    setVerInfoCapas(false);
    const extent = this.getGeometry().getExtent();

    const min = transform([extent[0], extent[1]], 'EPSG:3857', 'EPSG:4326');
    const max = transform([extent[2], extent[3]], 'EPSG:3857', 'EPSG:4326');

    const transformedExtent = [min[0], min[1], max[0], max[1]];

    realizarConsulta(map, transformedExtent, setVerInfoCapas);
  });

  // Añadir las interacciones al mapa
  map.addInteraction(selectInteraction);
  map.addInteraction(circleInteraction);
};

function realizarConsultaCirculo(map, centerCoord, setVerInfoCapas) {
  // Radio fijo en metros
  const currentZoom = map.getView().getZoom();
  const radius = 9999

  // Transformar el centro al sistema de coordenadas EPSG:4326
  const centerWGS84 = transform(centerCoord, 'EPSG:3857', 'EPSG:4326');

  // Crear un círculo
  const circleGeom = new CircleGeom(centerCoord, radius / map.getView().getResolution());
  const circlePolygon = fromCircle(circleGeom, radius);

  // Calcular el extent del círculo
  const extent = circlePolygon.getExtent();

  const min = transform([extent[0], extent[1]], 'EPSG:3857', 'EPSG:4326');
  const max = transform([extent[2], extent[3]], 'EPSG:3857', 'EPSG:4326');

  const transformedExtent = [min[0], min[1], max[0], max[1]];

  // Realizar la consulta
  realizarConsulta(map, transformedExtent, setVerInfoCapas);

// Crear un estilo para el círculo con animación
const circleStyle = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.6)' // Blanco semi-transparente
  }),
  stroke: new Stroke({
    color: 'rgba(255, 255, 255, 1)', // Borde azul semi-transparente
    width: 4
  })
});

// Crear una característica con el círculo
const circleFeature = new Feature({
  geometry: circlePolygon
});
circleFeature.setStyle(circleStyle);

// Limpiar la fuente anterior y añadir el nuevo círculo
vectorSource.clear();
vectorSource.addFeature(circleFeature);

// Animación de parpadeo
let opacity = 0.8;
let increasing = true;
const animateCircle = () => {
  if (increasing) {
    opacity += 0.01;
    if (opacity >= 1) increasing = false;
  } else {
    opacity -= 0.03;
    if (opacity <= 0.3) increasing = true;
  }

  circleFeature.setStyle(new Style({
    fill: new Fill({
      color: `rgba(255, 255, 255, ${opacity})`
    }),
    stroke: new Stroke({
      color: 'rgba(0, 0, 255, 0.6)',
      width: 3
    })
  }));

  // Continuar la animación
  //setTimeout(animateCircle, 150);
};

// Iniciar la animación
animateCircle();


  if (!map.getLayers().array_.includes(capaConsulta)) {
    map.addLayer(capaConsulta);
  }
}

function realizarConsulta(map, transformedExtent, setVerInfoCapas) {
  const nombreCapasActivas = [];

  capas.forEach((capa, i) => {
    if (capas[i].isVisible) {
      nombreCapasActivas.push(nombreCapasCatedra[i]);
    }
  });

  nombreCapasActivas.push('poligonos_guardados');

  const featureRequest = new WFS().writeGetFeature({
    srsName: 'EPSG:4326',
    geometryName: 'geom',
    featureTypes: nombreCapasActivas,
    outputFormat: 'application/json',
    filter: bbox('geom', transformedExtent, 'EPSG:4326'),
  });

  fetch('http://localhost:8080/cgi-bin/qgis_mapserv.fcgi.exe', {
    method: 'POST',
    body: new XMLSerializer().serializeToString(featureRequest),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      const features = new GeoJSON({
        featureProjection: 'EPSG:3857',
        dataProjection: 'EPSG:4326',
      }).readFeatures(json);
      vectorSource.clear();
      vectorSource.addFeatures(features);

      if (!map.getLayers().array_.includes(capaConsulta)) {
        map.addLayer(capaConsulta);
      }

      // map.getView().fit(vectorSource.getExtent(), {
      //   padding: [100, 100, 100, 100],
      //   duration: 1000,
      // });

      // if (typeof setVerInfoCapas === 'function') {
      //   setVerInfoCapas(true);
      // }
      setVerInfoCapas(true);
    });
}

export const eliminarInteraccionConsulta = (map) => {
  if (map.getLayers().array_.includes(capaConsulta)) {
    vectorSource.clear();
    map.removeLayer(capaConsulta);
  }
  if (map.getInteractions().array_.includes(selectInteraction)) {
    map.removeInteraction(selectInteraction);
  }
  if (map.getInteractions().array_.includes(circleInteraction)) {
    map.removeInteraction(circleInteraction);
  }
};

export { vectorSource as sourceConsulta };