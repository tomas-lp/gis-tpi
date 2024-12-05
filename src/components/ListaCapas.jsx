import React from "react";
import './ListaCapas.css'
import {nombreCapasCatedra, poligonosGuardados} from '../utils/capas'
import { useState,useEffect } from "react";
import { imgLupa } from "../assets/imagenes";
import { imgOcultar } from "../assets/imagenes";
import { Tooltip } from "react-tooltip";

const ListaCapas = ({capasActivas, setCapasActivas}) => {
  const [buscador, setbuscador] = useState("");
  const [capasBuscadas, setCapasBuscadas] = useState([]);

  function habilitarCapa(event) {
    const numeroCapa = event.target.getAttribute('id');

    let nuevoCapas = [ ...capasActivas ];

    nuevoCapas[numeroCapa].isVisible = !nuevoCapas[numeroCapa].isVisible;
    
    setCapasActivas(nuevoCapas);
  }

  function ocultarCapas() {
    let nuevoCapas = [ ...capasActivas ];

    nuevoCapas.forEach(capa => {
      capa.isVisible = false;
    });
    
    setCapasActivas(nuevoCapas);
  }

  
  useEffect(() => {
    const filtradas = nombreCapasCatedra.filter((capa) => capa.toLowerCase().includes(buscador.toLowerCase()));
    setCapasBuscadas(filtradas);
  }, [buscador]); 

  return (
    <>
      <div id="capas">
        <div id='seccionBusqueda'>
          <div id='barraBusqueda'>
            <input id='inputBuscador' type="text" placeholder="Buscar capas" value={buscador} onChange={(e) => setbuscador(e.target.value)}/>
            <img  id='lupita' src={imgLupa} alt="" />
          </div>
          <a
            data-tooltip-id='tooltipListaCapas' 
            data-tooltip-content="Desactivar capas"
            data-tooltip-place="top"
          >
            <img id="ocultar" src={imgOcultar} alt="" onClick={ocultarCapas}/>        
          </a>
        </div>
        
        <ul>          
          {nombreCapasCatedra.map((capa, i) => capasBuscadas.includes(capa) && <li key={i}><label className={(i>=31 && i<=35 && 'label-bold')}><input checked={capasActivas[i].isVisible} type="checkbox" id={i} onChange={habilitarCapa}/>{nombreCapasCatedra[i].replaceAll('_',' ')}</label></li>)}
        </ul>
      </div>

      <Tooltip id="tooltipListaCapas" style={{padding: 0, paddingLeft: '10px', paddingRight: '10px', marginTop: '-14px', marginLeft: '5px'}}/>
    </>
  );
};

export default ListaCapas;