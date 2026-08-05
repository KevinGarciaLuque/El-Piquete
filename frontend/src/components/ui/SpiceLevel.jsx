const NIVELES = {
  suave: { emoji: '🌶️', label: 'Suave' },
  tradicional: { emoji: '🌶️🌶️', label: 'Tradicional' },
  picante: { emoji: '🌶️🌶️🌶️', label: 'Picante' },
  extra_picante: { emoji: '🌶️🌶️🌶️🌶️', label: 'Extra picante' },
};

export default function SpiceLevel({ nivel }) {
  const info = NIVELES[nivel] ?? NIVELES.tradicional;

  return (
    <span className="inline-flex items-center gap-1 text-sm text-chili">
      <span aria-hidden="true">{info.emoji}</span>
      <span className="text-ink/70">{info.label}</span>
    </span>
  );
}
