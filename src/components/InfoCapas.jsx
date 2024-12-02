import React, { useEffect, useState } from 'react';
import './InfoCapas.css';
import { sourceConsulta } from '../utils/interaccionConsulta';


function InfoCapas() {
  
  const [infoFeatures, setInfoFeatures] = useState([])

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
