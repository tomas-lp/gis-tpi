import { imgEliminar } from '../assets/imagenes';
import './BotonEliminarPoligonos.css';
import { Tooltip } from "react-tooltip";
import { capaAgregar } from '../utils/interaccionAgregar';

function BotonEliminarPoligonos() {

  return (
    <>
      <div id='botonEliminarPoligonos' 
          data-tooltip-id='tooltip2' 
          data-tooltip-content="Eliminar polígonos"
          data-tooltip-place="left"
          onClick={() => capaAgregar.getSource().clear()}
          >
        <img src={imgEliminar} alt=''/>
      </div>

      <Tooltip id="tooltip2" style={{padding: 0, paddingLeft: '10px', paddingRight: '10px', marginTop: '0px'}}/>
    </>
  );
}

export default BotonEliminarPoligonos;
