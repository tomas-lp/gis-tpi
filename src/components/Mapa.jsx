import React, { useEffect } from 'react';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import { TileWMS } from 'ol/source';
import Zoom from 'ol/control/Zoom';

export default function Mapa({ estado }) {

  useEffect(() => {
    //Centro argentina
    //proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');
    //register(proj4);

    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new TileWMS({
            url: 'https://wms.ign.gob.ar/geoserver/ows',
            params: {
              LAYERS: 'capabaseargenmap',
              VERSION: '1.1.1',
            },
          }),
        }),
      ],
      view: new View({
        // Para preguntar
        // projection: getProjection('EPSG:4326'), // Usar EPSG:4326
        // center: fromLonLat([-64.5, -38.5]), // Coordenadas de Argentina (aproximado)
        // zoom: 4, // Nivel de zoom

        center: [-7288745, -4959008],
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

  return <div id='map' style={{ width: '100vw', height: '100vh' }} />;
}
