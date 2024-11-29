import { TileWMS, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';

const nombreCapasCatedra = [
  'espejo_de_agua_hid',
  'veg_arborea',
  'veg_cultivos',
  'veg_hidrofila',
  'red_vial',
]

const nombreCapasAuxiliares = []

const crearCapaSIG = (nombre) => {
  return new TileLayer({
    source: new TileWMS({
      url: 'http://localhost:8080/geoserver/gis/wms',
      params: {
        LAYERS: nombre,
        VERSION: '1.1.1',
      },
    }),
  })
}

const crearCapaAuxiliar = (nombre) => {
  return new VectorLayer({
    source: new VectorSource(),
    style: {
      'fill-color': 'rgba(255, 255, 255, 0.2)',
      'stroke-color': '#ffcc33',
      'stroke-width': 2,
      'circle-radius': 7,
      'circle-fill-color': '#ffcc33',
    },
  });
}

const capaBase = new TileLayer({
  source: new TileWMS({
    url: 'https://wms.ign.gob.ar/geoserver/ows',
    params: {
      LAYERS: 'capabaseargenmap',
      VERSION: '1.1.1',
    },
  }),
})



const capasCatedra = nombreCapasCatedra.map((nombreCapa)=> crearCapaSIG(nombreCapa))
// const capasAuxiliares = nombreCapasAuxiliares.map((nombreCapa)=> crearCapaAuxiliar(nombreCapa))

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
  capaBase
}