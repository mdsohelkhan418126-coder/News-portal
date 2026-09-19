export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;

  const start = Math.max(1, Math.min(page - 2, pages - 4));
  const numbers = Array.from({ length: Math.min(5, pages) }, (_, i) => start + i);

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
      <button className="btn-outline" disabled={page === 1} onClick={() => onChange(page - 1)}>
        Previous
      </button>
      {numbers.map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          aria-current={n === page ? 'page' : undefined}
          className={`h-10 w-10 rounded-lg text-sm font-semibold ${
            n === page ? 'bg-ink text-white' : 'border border-line bg-white hover:border-ink'
          }`}
        >
          {n}
        </button>
      ))}
      <button className="btn-outline" disabled={page === pages} onClick={() => onChange(page + 1)}>
        Next
      </button>
    </nav>
  );
}
