const PASOS = ['Tus datos', 'Entrega', 'Pago', 'Confirmar'];

export default function StepIndicator({ pasoActual }) {
  return (
    <ol className="mb-8 flex items-center justify-center gap-2 sm:gap-4">
      {PASOS.map((nombre, indice) => {
        const numero = indice + 1;
        const activo = numero === pasoActual;
        const completado = numero < pasoActual;

        return (
          <li key={nombre} className="flex items-center gap-2">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                activo
                  ? 'bg-chili text-cream'
                  : completado
                    ? 'bg-olive-dark text-cream'
                    : 'bg-olive/15 text-ink/50'
              }`}
            >
              {numero}
            </span>
            <span className={`hidden text-xs font-medium sm:inline ${activo ? 'text-navy' : 'text-ink/50'}`}>
              {nombre}
            </span>
            {numero < PASOS.length && <span className="h-px w-4 bg-olive/20 sm:w-8" />}
          </li>
        );
      })}
    </ol>
  );
}
