import { TileWMS, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';

// Arreglo con nombres de las capas a cargar desde el servidor.
const nombreCapasCatedra = [
  'actividades_agropecuarias',
  'actividades_economicas',
  'complejo_de_energia_ene',
  'edif_construcciones_turisticas',
  'edif_depor_y_esparcimiento',
  'edif_educacion',
  'edif_religiosos',
  'edificio_de_salud_ips',
  'edificio_de_seguridad_ips',
  'edificio_publico_ips',
  'edificios_ferroviarios',
  'localidades',
  'marcas_y_se?ales',
  'estructuras_portuarias',
  'infraestructura_aeroportuaria_punto',
  'infraestructura_hidro',
  'obra_de_comunicaci?n',
  'obra_portuaria',
  'otras_edificaciones',
  'puente_red_vial_puntos',
  'puntos_de_alturas_topograficas',
  'puntos_del_terreno',
  'salvado_de_obstaculo',
  'se?alizaciones',
  'curso_de_agua_hid',
  'curvas_de_nivel',
  'muro_embalse',
  'l?neas_de_conducci?n_ene',
  'limite_politico_administrativo_lim',
  'red_ferroviaria',
  'vias_secundarias',
  'red_vial',
  'veg_cultivos',
  'veg_arborea',
  'veg_hidrofila',
  'espejo_de_agua_hid',
  'ejido',
  'isla',
  'sue_consolidado',
  'sue_costero',
  'sue_hidromorfologico',
  'sue_no_consolidado',
  'sue_congelado',
  'veg_arbustiva',
  'veg_suelo_desnudo',
  'provincias',
  'pais_lim',
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