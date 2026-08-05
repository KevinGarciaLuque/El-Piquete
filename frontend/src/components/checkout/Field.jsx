export const inputClass =
  'rounded-lg border border-olive/30 bg-white px-3 py-2 text-sm text-ink focus:border-olive-dark focus:outline-none focus:ring-1 focus:ring-olive-dark';

export default function Field({ label, required, children }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-navy">
        {label} {required && <span className="text-chili">*</span>}
      </span>
      {children}
    </label>
  );
}
