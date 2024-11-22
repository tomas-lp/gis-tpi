import React from "react";
import './ListaCapas.css'


const ListaCapas = () => {
  return (
    <div id="capas">
      <ul>
        <li><label><input type="checkbox" />Capa 1</label></li>
        <li><label><input type="checkbox" />Capa 2</label></li>
        <li><label><input type="checkbox" />Capa 3</label></li>
      </ul>
    </div>
  );
};

export default ListaCapas;