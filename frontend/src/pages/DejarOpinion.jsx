import { useState } from 'react';
import { enviarOpinion } from '../services/api';
import Field, { inputClass } from '../components/checkout/Field';
import Button from '../components/ui/Button';

const VACIO = { codigoPedido: '', telefono: '', nombre: '', comentario: '' };

function SelectorEstrellas({ valor, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} estrellas`}
          className={`text-2xl leading-none ${n <= valor ? 'text-carrot' : 'text-olive/20'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function DejarOpinion() {
  const [form, setForm] = useState(VACIO);
  const [calificacion, setCalificacion] = useState(5);
  const [foto, setFoto] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [enviado, setEnviado] = useState(false);

  function actualizar(campo, valor) {
    setForm((actual) => ({ ...actual, [campo]: valor }));
  }

  async function enviar(e) {
    e.preventDefault();

    if (!form.codigoPedido || !form.telefono || !form.nombre || !form.comentario) {
      setError('Completa todos los campos obligatorios');
      return;
    }

    setError('');
    setEnviando(true);

    try {
      const formData = new FormData();
      formData.append('codigoPedido', form.codigoPedido.trim());
      formData.append('telefono', form.telefono.trim());
      formData.append('nombre', form.nombre.trim());
      formData.append('comentario', form.comentario.trim());
      formData.append('calificacion', calificacion);
      if (foto) formData.append('imagen', foto);

      await enviarOpinion(formData);
      setEnviado(true);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No pudimos enviar tu opinión, intenta de nuevo');
    } finally {
      setEnviando(false);
    }
  }

  if (enviado) {
    return (
      <section className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-3xl font-semibold text-navy">¡Gracias por tu opinión!</h1>
        <p className="mt-3 text-ink/70">
          La revisaremos y la publicaremos pronto en la sección de Opiniones.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-navy">Déjanos tu opinión</h1>
      <p className="mt-2 text-ink/70">
        Si ya recibiste tu pedido, cuéntanos qué te pareció. Verificamos con el código de pedido y el teléfono
        que usaste al comprar.
      </p>

      <form onSubmit={enviar} className="mt-8 flex flex-col gap-4">
        <Field label="Código de pedido" required>
          <input
            className={inputClass}
            placeholder="ENC-000123"
            value={form.codigoPedido}
            onChange={(e) => actualizar('codigoPedido', e.target.value)}
          />
        </Field>

        <Field label="Teléfono usado en la compra" required>
          <input
            className={inputClass}
            value={form.telefono}
            onChange={(e) => actualizar('telefono', e.target.value)}
          />
        </Field>

        <Field label="Nombre a mostrar" required>
          <input
            className={inputClass}
            placeholder="Ej. María G."
            value={form.nombre}
            onChange={(e) => actualizar('nombre', e.target.value)}
          />
        </Field>

        <Field label="Calificación" required>
          <SelectorEstrellas valor={calificacion} onChange={setCalificacion} />
        </Field>

        <Field label="Tu opinión" required>
          <textarea
            className={`${inputClass} min-h-[100px]`}
            value={form.comentario}
            onChange={(e) => actualizar('comentario', e.target.value)}
          />
        </Field>

        <Field label="Foto (opcional)">
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setFoto(e.target.files[0] || null)} />
        </Field>

        {error && <p className="text-sm text-chili">{error}</p>}

        <Button type="submit" variant="primary" disabled={enviando} className="mt-2">
          {enviando ? 'Enviando…' : 'Enviar opinión'}
        </Button>
      </form>
    </section>
  );
}
