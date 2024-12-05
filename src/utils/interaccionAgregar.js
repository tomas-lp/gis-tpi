import {Draw, Modify, Select, Snap} from 'ol/interaction.js';
import { GML, WFS } from 'ol/format';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

export const capaAgregar = new VectorLayer({
  source: new VectorSource({
    
  }),
  style: {
    'fill-color': 'rgba(255, 255, 255, 0.2)',
    'stroke-color': '#ffcc33',
    'stroke-width': 2,
    'circle-radius': 7,
    'circle-fill-color': '#ffcc33',
  },
});

const TYPE = 'Polygon';

const ExampleModify = {
  init: function (map) {
    this.select = new Select();
    map.addInteraction(this.select);

    this.modify = new Modify({
      features: this.select.getFeatures(),
    });
    map.addInteraction(this.modify);

    this.setEvents();
  },
  destroy: function (map) {
    this.select = new Select();
    map.removeInteraction(this.select);

    this.modify = new Modify({
      features: this.select.getFeatures(),
    });
    map.removeInteraction(this.modify);

    this.setEvents();
  },
  setEvents: function () {
    const selectedFeatures = this.select.getFeatures();

    this.select.on('change:active', function () {
      selectedFeatures.forEach(function (each) {
        
        selectedFeatures.remove(each);
      });

      console.log('Change')
    });
  },
  setActive: function (active) {
    this.select.setActive(active);
    this.modify.setActive(active);
  },
};

function guardarFeature(evt, map, verFormulario, setVerFormulario) {
  const featureAGuardar = evt.feature;
  ExampleDraw.destroy(map);
  return setVerFormulario({visible:true, feature: featureAGuardar});
}

const ExampleDraw = {
  init: function (map, verFormulario, setVerFormulario) {
    map.addInteraction(this.Point);
    this.Point.setActive(false);
    map.addInteraction(this.LineString);
    this.LineString.setActive(false);
    map.addInteraction(this.Polygon);
    this.Polygon.setActive(false);
    map.addInteraction(this.Circle);
    this.Circle.setActive(false);

    this.Polygon.on('drawend', (e) => guardarFeature(e, map, verFormulario, setVerFormulario))
    
    if (!map.getLayers().array_.includes(capaAgregar)) {
      map.addLayer(capaAgregar)
    }
  },
  destroy: function (map) {
    map.removeInteraction(this.Point);
    this.Point.setActive(false);
    map.removeInteraction(this.LineString);
    this.LineString.setActive(false);
    map.removeInteraction(this.Polygon);
    this.Polygon.setActive(false);
    map.removeInteraction(this.Circle);
    this.Circle.setActive(false);
  },
  Point: new Draw({
    source: capaAgregar.getSource(),
    type: 'Point',
  }),
  LineString: new Draw({
    source: capaAgregar.getSource(),
    type: 'LineString',
  }),
  Polygon: new Draw({
    source: capaAgregar.getSource(),
    type: 'Polygon',
  }),
  Circle: new Draw({
    source: capaAgregar.getSource(),
    type: 'Circle',
  }),
  activeDraw: null,
  setActive: function (active) {
    if (this.activeDraw) {
      this.activeDraw.setActive(false);
      this.activeDraw = null;
    }
    if (active) {
      const type = TYPE;
      this.activeDraw = this[type];
      this.activeDraw.setActive(true);
    }
  },
};

export function agregarInteraccionAgregar(map, verFormulario, setVerFormulario) {
  ExampleDraw.init(map, verFormulario, setVerFormulario);
  ExampleModify.init(map);
  ExampleDraw.setActive(true);
  ExampleModify.setActive(false);
  map.addInteraction(snap);
}

export function eliminarInteraccionAgregar(map) {
  if (map.getLayers().array_.includes(capaAgregar)) {
    ExampleDraw.destroy(map);
    ExampleModify.destroy(map);
    ExampleDraw.setActive(false);
    ExampleModify.setActive(false);
    map.removeInteraction(snap);
    //Si se elimina la capa, los objetos agregados no permanecen en el mapa
    capaAgregar.getSource().clear();
    map.removeLayer(capaAgregar);
  }
}

const snap = new Snap({
  source: capaAgregar.getSource(),
});