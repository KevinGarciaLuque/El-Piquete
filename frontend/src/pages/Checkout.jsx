import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { obtenerZonasEntrega, crearPedido } from '../services/api';
import StepIndicator from '../components/checkout/StepIndicator';
import StepDatosCliente from '../components/checkout/StepDatosCliente';
import StepEntrega from '../components/checkout/StepEntrega';
import StepPago from '../components/checkout/StepPago';
import StepResumen from '../components/checkout/StepResumen';
import Confirmacion from '../components/checkout/Confirmacion';
import Button from '../components/ui/Button';

const DATOS_INICIALES = {
  nombre: '',
  telefono: '',
  correo: '',
  metodoEntrega: 'domicilio',
  departamento: '',
  ciudad: '',
  direccion: '',
  puntoReferencia: '',
  zonaEntregaId: '',
  metodoPago: '',
};

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clear } = useCart();

  const [paso, setPaso] = useState(1);
  const [datos, setDatos] = useState(DATOS_INICIALES);
  const [zonas, setZonas] = useState([]);
  const [cargandoZonas, setCargandoZonas] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null);

  useEffect(() => {
    obtenerZonasEntrega()
      .then(setZonas)
      .catch(() => setZonas([]))
      .finally(() => setCargandoZonas(false));
  }, []);

  useEffect(() => {
    if (items.length === 0 && !pedidoConfirmado) {
      navigate('/');
    }
  }, [items, pedidoConfirmado, navigate]);

  function actualizar(campos) {
    setDatos((actuales) => ({ ...actuales, ...campos }));
  }

  const zonaSeleccionada = zonas.find((zona) => String(zona.id) === String(datos.zonaEntregaId));
  const costoEnvio = datos.metodoEntrega === 'domicilio' && zonaSeleccionada ? Number(zonaSeleccionada.costo_envio) : 0;

  function esPasoValido() {
    if (paso === 1) return datos.nombre.trim() && datos.telefono.trim();
    if (paso === 2) {
      if (datos.metodoEntrega === 'recoger') return true;
      return datos.departamento.trim() && datos.ciudad.trim() && datos.direccion.trim() && datos.zonaEntregaId;
    }
    if (paso === 3) return Boolean(datos.metodoPago);
    return true;
  }

  async function handleConfirmar() {
    setEnviando(true);
    setError('');

    try {
      const payload = {
        cliente: { nombre: datos.nombre, telefono: datos.telefono, correo: datos.correo || undefined },
        metodoEntrega: datos.metodoEntrega,
        metodoPago: datos.metodoPago,
        items: items.map((item) => ({ varianteId: item.varianteId, cantidad: item.cantidad })),
        ...(datos.metodoEntrega === 'domicilio' && {
          direccion: {
            departamento: datos.departamento,
            ciudad: datos.ciudad,
            direccion: datos.direccion,
            puntoReferencia: datos.puntoReferencia,
          },
          zonaEntregaId: Number(datos.zonaEntregaId),
        }),
      };

      const respuesta = await crearPedido(payload);
      setPedidoConfirmado(respuesta);
      clear();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No pudimos procesar tu pedido. Intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  if (pedidoConfirmado) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <Confirmacion pedido={pedidoConfirmado} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <StepIndicator pasoActual={paso} />

      {paso === 1 && <StepDatosCliente datos={datos} actualizar={actualizar} />}
      {paso === 2 && <StepEntrega datos={datos} actualizar={actualizar} zonas={zonas} cargandoZonas={cargandoZonas} />}
      {paso === 3 && <StepPago datos={datos} actualizar={actualizar} />}
      {paso === 4 && (
        <StepResumen
          items={items}
          datos={datos}
          costoEnvio={costoEnvio}
          subtotal={subtotal}
          enviando={enviando}
          error={error}
          onConfirmar={handleConfirmar}
        />
      )}

      {paso < 4 && (
        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={() => setPaso((p) => Math.max(1, p - 1))} disabled={paso === 1}>
            Atrás
          </Button>
          <Button variant="primary" onClick={() => setPaso((p) => p + 1)} disabled={!esPasoValido()}>
            Siguiente
          </Button>
        </div>
      )}
      {paso === 4 && (
        <div className="mt-4">
          <Button variant="outline" onClick={() => setPaso(3)}>
            Atrás
          </Button>
        </div>
      )}
    </div>
  );
}
