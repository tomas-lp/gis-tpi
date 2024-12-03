import './Mensaje.css';
import { imgCerrar } from '../assets/imagenes';
import { ESTADOS } from '../App';

function Mensaje({ texto, setEstado }) {
  return (
    <div id='PopUpMensaje'>
      <p>{texto}</p>
      <img className='boton' src={imgCerrar} alt='' onClick={() => setEstado(ESTADOS.defecto)} />
    </div>
  );
}

export default Mensaje;
