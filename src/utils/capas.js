import { TileWMS, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';

// Arreglo con nombres de las capas a cargar desde el servidor.
const nombreCapasCatedra = [
  'espejo_de_agua_hid',
  'veg_arborea',
  'veg_cultivos',
  'veg_hidrofila',
  'red_vial',
]

// Funcion para obtener una capa mediante WMTS.
const crearCapaSIG = (nombre) => {
  return new TileLayer({
    source: new TileWMS({
      // url: 'http://localhost:8080/geoserver/gis/wms', //GeoServer
      url: 'http://localhost:8080/cgi-bin/qgis_mapserv.fcgi.exe', //QGIS Server
      params: {
        LAYERS: nombre,
        VERSION: '1.1.1',
      },
    }),
  })
}

// Capa con mapa del mundo.
const capaBase = new TileLayer({
  source: new TileWMS({
    url: 'https://wms.ign.gob.ar/geoserver/ows',
    params: {
      LAYERS: 'capabaseargenmap', //Mapa a color. 
      // LAYERS: 'mapabase_gris', //Mapa en escala de grises.
      VERSION: '1.1.1',
    },
  }),
})

//Capa para la interaccion de agregar poligonos.
const capaAgregar = new VectorLayer({
  source: new VectorSource(),
  style: {
    'fill-color': 'rgba(255, 255, 255, 0.2)',
    'stroke-color': '#ffcc33',
    'stroke-width': 2,
    'circle-radius': 7,
    'circle-fill-color': '#ffcc33',
  },
});


// Obtener capas del servidor en funcion al arreglo con los nombres.
const capasCatedra = nombreCapasCatedra.map((nombreCapa)=> crearCapaSIG(nombreCapa))


// Crear arreglo de capas, con la capa y un booleano que indica si está activa.
let capas = []

capasCatedra.forEach((capa)=>{
  capas.push(
    {
      capaOL: capa,
      isVisible: false
    }
  )
})

export {
  nombreCapasCatedra,
  capas,
  capaBase,
  capaAgregar
}