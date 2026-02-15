import { useState,useEffect, use } from "react";
import './App.css';
//CORS me la puede chupar

function App() {
    const [mensaje, setMensaje] = useState('');
    const [numero, setNumero] = useState('');


    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [enviado, setEnviado] = useState(false);

    const [listaMensajes, setListaMensajes] = useState([]);
    const obtenerMensajes = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/api/mensajes') 
        const datos = await respuesta.json();
        setListaMensajes(datos);
      } catch (error) {
        console.error('Error al obtener mensajes:', error);
      }
        }

    const enviarMensaje= async (e) => {
        e.preventDefault();
        setCargando(true);
        setError(null);
        setEnviado(false);

      try {
          const respuesta = await fetch('http://localhost:3000/api/mensajes', {
              method: 'POST',
              headers: {
                  'accept': 'application/json',
                  'content-type': 'application/json',
                  'authorization': 'Bearer AatE1vbsPPZtEqjClyVYxdSH2SDrp5aM'
              },
              body: JSON.stringify({ 
                usuario: numero,
                texto : mensaje
              }),
            });
          if (!respuesta.ok) {
              throw new Error('Error en, le server');
          }

          const datos = await respuesta.json();
          console.log("Respuesta de Whapi:",datos);
          setEnviado(true);
          setMensaje('');
          setNumero('');
      } catch (err) {
        console.error(err);
        setError('Hubo un problema' + err.message);
      } finally {
        setCargando(false);
      }
    };

    useEffect(() => {
      obtenerMensajes();
      const intervalo = setInterval(obtenerMensajes, 1000); 
      return () => clearInterval(intervalo);
    }, []);
    return (
      <>
      <div className="contenedoirmensajes">
        {listaMensajes.map((msg) => (
          <div key={msg.id} className="mensaje">
              <div className="infomansaje">
                <span className="usuario">{msg.usuario}:</span>
              </div>
              <p className="sexo"> {msg.texto}</p>
            </div>
        ))}
      </div>
      <form onSubmit={enviarMensaje} >
        <label htmlFor="mensaje">Mensaje:</label>
        <input type="text" 
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        id = "mensaje"
        />
        <label htmlFor="numero">Numero:</label>
        <input type="text" 
        value={numero}
        onChange={(e) => setNumero(e.target.value)}
        id = "numero"
        />
        <button type="submit" disabled={cargando}>
          {cargando ? "Enviando..." : "Enviar"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {enviado && <p>Mensaje enviado con éxito!</p>}
      </form>
      </>
    )
}   

export default App;
