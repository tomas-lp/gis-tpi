import React, { useState } from "react";
import './ListaCapas.css'
import {capas, nombreCapasCatedra} from '../utils/capas'

const ListaCapas = ({capasActivas, setCapasActivas}) => {

  function habilitarCapa(event) {
    const numeroCapa = event.target.getAttribute('id');

    let nuevoCapas = [ ...capasActivas ];

    nuevoCapas[numeroCapa].isVisible = !nuevoCapas[numeroCapa].isVisible;

    setCapasActivas(nuevoCapas);
  }

  return (
    <div id="capas">
      <ul>
        {nombreCapasCatedra.map((capa, i) => <li key={i}><label><input checked={capasActivas[i].isVisible} type="checkbox" id={i} onChange={habilitarCapa}/>{nombreCapasCatedra[i]}</label></li>)}
      </ul>
    </div>
  );
};

export default ListaCapas;