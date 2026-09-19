export default function EmptyState({ title, children, action }) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-white px-6 py-14 text-center">
      <h3 className="text-lg font-bold">{title}</h3>
      {children && <p className="mx-auto mt-2 max-w-md text-sm text-mute">{children}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
