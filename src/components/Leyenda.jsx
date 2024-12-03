import { useEffect, useState } from "react"
import { nombreCapasCatedra } from "../utils/capas"
import './Leyenda.css';

export default function Leyenda ({capas}) {

  const [capasLeyenda, setCapasLeyenda] = useState([]);

  // Actualiza la leyenda cada vez que se activen o desactiven capas.
  useEffect(()=> {

    // Crea un arreglo con los nombres de las capas activas.
    // Sólo se mostrará la leyenda de dichas capas.
    const nombreCapasLeyenda = [];
    capas.forEach((capa, i) => {
      if (capas[i].isVisible) {
        nombreCapasLeyenda.push(nombreCapasCatedra[i]);
      }
    });

    if(nombreCapasLeyenda.length == 0) {setCapasLeyenda([])}

    // Realiza una petición GetLegendGraphic al WFS para obtener las referencias.
    const fetchData = async () => {
      if (nombreCapasLeyenda.length > 0) {
        const data = await fetch('http://localhost:8080/cgi-bin/qgis_mapserv.fcgi.exe?' + new URLSearchParams({
          service: 'WMS',
          version: '1.3.0',
          request: 'GetLegendGraphic',
          layers: nombreCapasLeyenda.join(','),
          // Solicita la respuesta en formato JSON, para así poder darle estilos.
          format: 'application/json',
        }).toString());
        const json = await data.json();
        setCapasLeyenda([...json.nodes]);
      }
    }
    fetchData();

  }, [capas])

  if (capasLeyenda.length > 0) {
    return (
      <div className="leyenda">
        <span>Referencias</span>
        <div className="listaCapasLeyenda">
        {capasLeyenda.map((capa)=>{
            return (
            <div className="capaLeyenda">
              <p className="tituloCapa">{capa.title}</p>
              
              {capa.symbols ?
                capa.symbols.map((simbolo)=> {
                  if (simbolo.title) {
                    return(
                      <div className="filaLeyenda">
                        <img src={`data:image/png;base64, ${simbolo.icon}`} alt="Imagen Leyenda" />
                        <p>{simbolo.title}</p>
                      </div>
                    )
                  }
                })
                : 
                  <div className="filaLeyenda">
                    <img src={`data:image/png;base64, ${capa.icon}`} alt="Imagen leyenda" />
                    <p>{capa.title}</p>
                  </div>                
              }
              
            </div>
          )
        })}
        </div>
      </div>
    )
  }
}