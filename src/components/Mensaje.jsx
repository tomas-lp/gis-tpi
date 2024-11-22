import './Mensaje.css';
import cerrar from '../assets/cerrar.png';

function Mensaje({ texto, setEstado }) {
  return (
    <div id='PopUpMensaje'>
      <p>{texto}</p>
      <img className='boton' src={cerrar} alt='' onClick={() => setEstado(0)} />
    </div>
  );
}

export default Mensaje;
