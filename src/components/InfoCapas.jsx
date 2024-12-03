import React, { useEffect, useState } from 'react';
import './InfoCapas.css';
import { sourceConsulta } from '../utils/interaccionConsulta';


function InfoCapas() {
  
  const [infoFeatures, setInfoFeatures] = useState([])

  // Extrae de la consulta un arreglo con las features devueltas.
  // Cada elemento es un objeto que contiene los atributos de la feature.
  useEffect(()=>{
    const features = sourceConsulta.getFeatures();
    const info = features.map(feature => feature.values_);
    setInfoFeatures(info);
  },[])


  return (
    <>
      {infoFeatures && 
        <div className='infoCapas'>
          <p>Estás seleccionando:</p>
          <hr/>
          <details open>
            <summary>{infoFeatures.length} elementos:</summary>
            {infoFeatures.map(feature => <p><strong>{feature.gid}:</strong> {feature.tipo}</p>)}
          </details>
        </div>
      }
    </>
  );
}

export default InfoCapas;
