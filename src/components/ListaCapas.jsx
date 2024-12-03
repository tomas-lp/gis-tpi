import React from "react";
import './ListaCapas.css'
import {nombreCapasCatedra} from '../utils/capas'

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
        {nombreCapasCatedra.map((capa, i) => <li key={i}><label className={(i>=31 && i<=35 && 'label-bold')}><input checked={capasActivas[i].isVisible} type="checkbox" id={i} onChange={habilitarCapa}/>{nombreCapasCatedra[i]}</label></li>)}
      </ul>
    </div>
  );
};

export default ListaCapas;