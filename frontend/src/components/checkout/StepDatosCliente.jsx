import Field, { inputClass } from './Field';

export default function StepDatosCliente({ datos, actualizar }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-2xl font-semibold text-navy">Tus datos</h2>
      <Field label="Nombre completo" required>
        <input
          type="text"
          value={datos.nombre}
          onChange={(e) => actualizar({ nombre: e.target.value })}
          className={inputClass}
          placeholder="Nombre y apellido"
        />
      </Field>
      <Field label="Teléfono / WhatsApp" required>
        <input
          type="tel"
          value={datos.telefono}
          onChange={(e) => actualizar({ telefono: e.target.value })}
          className={inputClass}
          placeholder="9999-9999"
        />
      </Field>
      <Field label="Correo electrónico (opcional)">
        <input
          type="email"
          value={datos.correo}
          onChange={(e) => actualizar({ correo: e.target.value })}
          className={inputClass}
          placeholder="tucorreo@ejemplo.com"
        />
      </Field>
    </div>
  );
}
