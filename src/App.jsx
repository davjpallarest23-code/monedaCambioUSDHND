
import './App.css'
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';

function App() {
  const [dolares, setDolares] = useState('');
  const [tasa, setTasa] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error('Error al consultar la API');
        }

        return respuesta.json();
      })
      .then((datos) => {
        if (datos.result !== 'success' || !datos.rates?.HNL) {
          throw new Error('La tasa de cambio no está disponible');
        }

        setTasa(datos.rates.HNL);
      })
      .catch(() => {
        setError('No se pudo obtener la tasa de cambio.');
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  const cantidad = Number(dolares);
  const total = cantidad * tasa;

  const resultado =
    tasa !== null &&
    dolares !== '' &&
    Number.isFinite(cantidad) &&
    Number.isFinite(total) &&
    cantidad >= 0
      ? total.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      : '0.00';

  return (
    <div className="Principal">
      <h1>Conversor de dólares a lempiras</h1>

      {cargando && <p>Cargando tasa de cambio</p>}

      {error && <p className="error">{error}</p>}

      {!cargando && !error && tasa !== null && (
        <p>
          Tasa actual: 1 USD = {tasa.toFixed(4)} HNL
        </p>
      )}

      <form onSubmit={(evento) => evento.preventDefault()}>
        <TextField
          label="Cantidad en dólares (USD)"
          value={dolares}
          onChange={(evento) => setDolares(evento.target.value)}
          fullWidth
        />
      </form>

      <h2>Resultado: L {resultado}</h2>

      <footer>
        <p>DAVID PALLARES</p>
      </footer>
    </div>
  );
}

export default App;
