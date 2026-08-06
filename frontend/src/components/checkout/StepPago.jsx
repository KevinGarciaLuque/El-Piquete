function OpcionPago({ valor, actual, disabled, titulo, descripcion, onSelect }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(valor)}
      className={`flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-colors ${
        actual === valor ? 'border-olive-dark bg-olive/10' : 'border-olive/20 bg-white hover:border-olive/40'
      } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      <span className="font-medium text-navy">{titulo}</span>
      <span className="text-xs text-ink/60">{descripcion}</span>
    </button>
  );
}

export default function StepPago({ datos, actualizar }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-2xl font-semibold text-navy">Método de pago</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        <OpcionPago
          valor="tarjeta"
          actual={datos.metodoPago}
          onSelect={(valor) => actualizar({ metodoPago: valor })}
          titulo="Tarjeta (BAC Compra-Click)"
          descripcion="Te enviamos un enlace de pago seguro"
        />
        <OpcionPago
          valor="transferencia"
          actual={datos.metodoPago}
          onSelect={(valor) => actualizar({ metodoPago: valor })}
          titulo="Transferencia bancaria"
          descripcion="Te enviamos los datos de la cuenta"
        />
        <OpcionPago
          valor="contra_entrega"
          actual={datos.metodoPago}
          onSelect={(valor) => actualizar({ metodoPago: valor })}
          titulo="Pago contra entrega"
          descripcion="Pagas al recibir o recoger tu pedido"
        />
        <OpcionPago valor="paypal" actual={datos.metodoPago} disabled titulo="PayPal" descripcion="Próximamente" onSelect={() => {}} />
      </div>

      {datos.metodoPago === 'tarjeta' && (
        <p className="rounded-xl border border-olive/15 bg-white/60 p-4 text-sm text-ink/70">
          Al confirmar tu pedido te enviaremos por WhatsApp un enlace de pago seguro (BAC Compra-Click) para pagar con
          tarjeta de crédito o débito.
        </p>
      )}
      {datos.metodoPago === 'transferencia' && (
        <p className="rounded-xl border border-olive/15 bg-white/60 p-4 text-sm text-ink/70">
          Al confirmar tu pedido te compartiremos los datos de la cuenta bancaria por WhatsApp para completar la
          transferencia.
        </p>
      )}
      {datos.metodoPago === 'contra_entrega' && (
        <p className="rounded-xl border border-olive/15 bg-white/60 p-4 text-sm text-ink/70">
          Pagas en efectivo al momento de recibir o recoger tu pedido.
        </p>
      )}
    </div>
  );
}
