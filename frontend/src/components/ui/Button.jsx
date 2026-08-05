const VARIANTS = {
  primary: 'bg-chili text-cream hover:bg-chili/90 focus-visible:outline-chili',
  secondary: 'bg-olive-dark text-cream hover:bg-olive-dark/90 focus-visible:outline-olive-dark',
  outline: 'border-2 border-navy text-navy hover:bg-navy hover:text-cream focus-visible:outline-navy',
};

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  className = '',
  children,
  ...props
}) {
  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
