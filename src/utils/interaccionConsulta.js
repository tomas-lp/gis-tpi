import VectorSource from 'ol/source/Vector.js';
import { GeoJSON, WFS } from 'ol/format.js';
import { Stroke, Style } from 'ol/style.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import { DragBox } from 'ol/interaction';
import { bbox } from 'ol/format/filter.js';
import { nombreCapasCatedra, capas } from './capas';
import { always } from 'ol/events/condition';
import { transform } from 'ol/proj';

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

var selectInteraction = new DragBox({
  condition: always,
  style: new Style({
    stroke: new Stroke({
      color: [0, 0, 255, 1],
    }),
  }),
});

export const agregarInteraccionConsulta = (map, setVerInfoCapas) => {
  selectInteraction.on('boxend', function (evt) {
    setVerInfoCapas(false);
    const extent = this.getGeometry().getExtent();

    const min = transform([extent[0], extent[1]], 'EPSG:3857', 'EPSG:4326');
    const max = transform([extent[2], extent[3]], 'EPSG:3857', 'EPSG:4326');

    const transformedExtent = [min[0], min[1], max[0], max[1]];

    const nombreCapasActivas = [];

    capas.forEach((capa, i) => {
      if (capas[i].isVisible) {
        nombreCapasActivas.push(nombreCapasCatedra[i]);
      }
    });

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

        map.getView().fit(vectorSource.getExtent(), {
          padding: [50, 50, 50, 50],
          duration: 1000,
        });

        setVerInfoCapas(true);
      });
  });

  map.addInteraction(selectInteraction);
};

export const eliminarInteraccionConsulta = (map) => {
  if (map.getLayers().array_.includes(capaConsulta)) {
    vectorSource.clear();
    map.removeLayer(capaConsulta);
  }
  if (map.getInteractions().array_.includes(selectInteraction)) {
    map.removeInteraction(selectInteraction);
  }
};

export { vectorSource as sourceConsulta };
