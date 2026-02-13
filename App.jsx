import { useState } from "react";



function App() {
    const [mensaje, setMensaje] = useState('');
    const [numero, setNumero] = useState('');


    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [enviado, setEnviado] = useState(false);

    const enviarMensaje= async (e) => {
        e.preventDefault();
        setCargando(true);
        setError(null);
        setEnviado(false);

      try {
          const respuesta = await fetch('https://gate.whapi.cloud/messages/text', {
              method: 'POST',
              headers: {
                  'accept': 'application/json',
                  'content-type': 'application/json',
                  'authorization': 'Bearer AatE1vbsPPZtEqjClyVYxdSH2SDrp5aM'
              },
              body: JSON.stringify({ 
                typing_time: 0,
                to: numero,
                body: mensaje
              }),
            });
          if (!respuesta.ok) {
              throw new Error('Error al enviar el mensaje');
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
    return (
      <form onSubmit={enviarMensaje}  >
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
    )
}   

export default App;