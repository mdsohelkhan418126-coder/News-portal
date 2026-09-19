// Label + control + hint/error, so every form reads the same way.
export default function Field({ label, htmlFor, error, hint, children, className = '' }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-alert" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-mute">{hint}</p>
      )}
    </div>
  );
}
