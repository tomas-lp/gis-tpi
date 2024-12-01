import Map from 'ol/Map.js';
import View, { isNoopAnimation } from 'ol/View.js';
import {Draw, Modify, Select, Snap} from 'ol/interaction.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import { capaAgregar } from './capas';

const TYPE = 'Polygon';

const raster = new TileLayer({
  source: new OSM(),
});

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
    });
  },
  setActive: function (active) {
    this.select.setActive(active);
    this.modify.setActive(active);
  },
};


// const optionsForm = document.getElementById('options-form');

const ExampleDraw = {
  init: function (map) {
    map.addInteraction(this.Point);
    this.Point.setActive(false);
    map.addInteraction(this.LineString);
    this.LineString.setActive(false);
    map.addInteraction(this.Polygon);
    this.Polygon.setActive(false);
    map.addInteraction(this.Circle);
    this.Circle.setActive(false);
    
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
      // const type = optionsForm.elements['draw-type'].value;
      const type = TYPE;
      this.activeDraw = this[type];
      this.activeDraw.setActive(true);
    }
  },
};


/**
 * Let user change the geometry type.
 * @param {Event} e Change event.
 */
// optionsForm.onchange = function (e) {
//   const type = e.target.getAttribute('name');
//   if (type == 'draw-type') {
//     ExampleModify.setActive(false);
//     ExampleDraw.setActive(true);
//     optionsForm.elements['interaction'].value = 'draw';
//   } else if (type == 'interaction') {
//     const interactionType = e.target.value;
//     if (interactionType == 'modify') {
//       ExampleDraw.setActive(false);
//       ExampleModify.setActive(true);
//     } else if (interactionType == 'draw') {
//       ExampleDraw.setActive(true);
//       ExampleModify.setActive(false);
//     }
//   }
// };

// ExampleDraw.setActive(false);
// ExampleModify.setActive(false);

export function agregarInteraccionAgregar(map) {
  ExampleDraw.init(map);
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
    // map.removeLayer(capaAgregar);
  }
}

// The snap interaction must be added after the Modify and Draw interactions
// in order for its map browser event handlers to be fired first. Its handlers
// are responsible of doing the snapping.
const snap = new Snap({
  source: capaAgregar.getSource(),
});