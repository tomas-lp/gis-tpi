import React, { useEffect, useState } from 'react';
import './InfoCapas.css';
import { sourceConsulta } from '../utils/interaccionConsulta';


function InfoCapas() {
  
  const [infoFeatures, setInfoFeatures] = useState([]);
  const [infoSeleccionada, setInfoSeleccionada] = useState(null);

  // Extrae de la consulta un arreglo con las features devueltas.
  // Cada elemento es un objeto que contiene los atributos de la feature.
  useEffect(()=>{
    const features = sourceConsulta.getFeatures();
    const info = features.map(feature => feature.values_);
    setInfoFeatures(info);
  },[])

  function handleSelect(feature) {
    const info = { ...feature };
    delete info['geometry'];
    setInfoSeleccionada(info);
  }


  return (
    <>
      {infoFeatures && 
        <div className='infoCapas'>
          <p>Estás seleccionando:</p>
          <hr/>
          <details open>
            <summary>{infoFeatures.length} elementos:</summary>
            {infoFeatures.map(feature => {
              return(
              <>
                <p onClick={() => handleSelect(feature)}><strong>{feature.gid || `PG${feature.id}`}:</strong> {feature.nombre || feature.tipo || feature.provincia }</p>
              </>
              )
            })}
          </details>
        </div>
      }

      {infoSeleccionada && 
        <div className='fullInfo'>
          {Object.entries(infoSeleccionada).map((col)=> <p><strong>{col[0]}</strong>: {col[1]}</p>)}
        </div>
      }
    </>
  );
}

export default InfoCapas;
