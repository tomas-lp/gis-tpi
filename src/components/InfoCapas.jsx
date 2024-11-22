import React from 'react';
import './InfoCapas.css';

function InfoCapas() {
  return (
    <div className='infoCapas'>
      <p>Estás seleccionando:</p>
      <hr/>
      <details>
        <summary>Capa 1</summary>
        <p>Elemento 1</p>
        <p>Elemento 2</p>
        <p>Elemento 3</p>
      </details>
    </div>
  );
}

export default InfoCapas;
