import React, { useState } from 'react';
import './FormAtributos.css';
import { WFS } from 'ol/format';
import { poligonosGuardados } from '../utils/capas';
import { transform } from 'ol/proj';
import { ESTADOS } from '../App';
import { capaAgregar } from '../utils/interaccionAgregar';


const FormAtributos = ({ setEstado, verFormulario, setVerFormulario }) => {
  const initialState = {
    nombre: '',
    tipo: '',
  };

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function guardarFeature() {
    const feature = verFormulario.feature;
    // feature.getGeometry().transform('EPSG:3857', 'EPSG:4326');
    console.log(feature);

    feature.set('nombre', formData.nombre);
    feature.set('tipo', formData.tipo);

    // Configurar el formato WFS
    const formatWFS = new WFS();

    // Crear la transacción WFS
    const featureRequest = formatWFS.writeTransaction([feature], null, null, {
      featureNS: 'http://localhost:8080/cgi-bin/qgis_mapserv.fcgi.exe',
      featureType: 'poligonos_guardados',
      srsName: 'EPSG:3857', // o el sistema de coordenadas que uses
    });

    // Convertir a string
    const serializer = new XMLSerializer();
    const featureRequestString = serializer.serializeToString(featureRequest);

    // Enviar al servidor WFS
    fetch('http://localhost:8080/cgi-bin/qgis_mapserv.fcgi.exe', {
      method: 'POST',
      body: featureRequestString,
      // headers: {
      //     'Content-Type': 'text/xml',
      // }
    })
      .then((response) => response.text())
      .then((data) => {
        console.log('Feature guardada exitosamente:', data);
        poligonosGuardados.getSource().changed();
        setEstado(ESTADOS.defecto);
        setVerFormulario({visible: false, feature: null})
        // Aquí puedes agregar código para manejar la respuesta exitosa
      })
      .catch((error) => {
        console.error('Error al guardar la feature:', error);
        // Aquí puedes agregar código para manejar el error
      });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    guardarFeature();
  };

  const handleCancel = () => {
    setFormData(initialState); // Restablecer el formulario al estado inicial
  };

  return (
    <div className='formAtributos'>
      <p>Atributos del Polígono</p>
      {/* <hr /> */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='nombre'>Nombre:</label>
          <br />
          <input
            type='text'
            id='nombre'
            name='nombre'
            value={formData.nombre}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor='tipo'>Tipo:</label>
          <br />
          <input
            type='text'
            id='tipo'
            name='tipo'
            value={formData.tipo}
            onChange={handleChange}
          />
        </div>

        <div id='botones'>
          <button type='button' onClick={() => {
            capaAgregar.getSource().clear();
            setEstado(ESTADOS.defecto);
            setVerFormulario({visible: false, feature: null})
          }
          }>
            Cancelar
          </button>
          <button type='submit'>Guardar</button>
        </div>
      </form>
    </div>
  );
};

export default FormAtributos;
