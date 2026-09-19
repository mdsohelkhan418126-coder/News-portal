import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNewsStore } from '../store/newsStore';
import NewsCard, { NewsCardSkeleton } from '../components/NewsCard';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import { SearchIcon } from '../components/Icons';

export default function News() {
  const [params, setParams] = useSearchParams();
  const { news, pagination, listLoading, listError, categories, fetchNews, fetchCategories } = useNewsStore();

  const page = Number(params.get('page')) || 1;
  const category = params.get('category') || '';
  const search = params.get('search') || '';
  const sort = params.get('sort') || 'latest';

  const [query, setQuery] = useState(search);
  useEffect(() => setQuery(search), [search]);
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchNews({ page, limit: 9, category: category || undefined, search: search || undefined, sort });
  }, [page, category, search, sort, fetchNews]);

  // Update URL params; any filter change resets to page 1
  const update = (changes) => {
    const next = new URLSearchParams(params);
    if (!('page' in changes)) next.delete('page');
    Object.entries(changes).forEach(([k, v]) => (v && v !== 1 ? next.set(k, v) : next.delete(k)));
    setParams(next);
  };

  const changePage = (p) => {
    update({ page: p });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container-page py-10">
      <h1 className="text-4xl font-extrabold">All news</h1>
      <p className="mt-2 text-mute">Every story published on Ground Report, newest first.</p>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <form
          role="search"
          className="flex w-full gap-2 lg:max-w-md"
          onSubmit={(e) => {
            e.preventDefault();
            update({ search: query.trim() });
          }}
        >
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
            <input
              className="input pl-10"
              type="search"
              placeholder="Search by title, summary or tag"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search news"
            />
          </div>
          <button className="btn-dark" type="submit">
            Search
          </button>
        </form>

        <label className="flex items-center gap-2 text-sm font-semibold">
          Sort by
          <select className="input w-auto" value={sort} onChange={(e) => update({ sort: e.target.value === 'latest' ? '' : e.target.value })}>
            <option value="latest">Newest</option>
            <option value="popular">Most read</option>
            <option value="oldest">Oldest</option>
          </select>
        </label>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Filter by category">
        {[{ name: '' }, ...categories].map((c) => {
          const active = category === c.name;
          return (
            <button
              key={c.name || 'all'}
              onClick={() => update({ category: c.name })}
              aria-pressed={active}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                active ? 'border-ink bg-ink text-white' : 'border-line bg-white hover:border-ink'
              }`}
            >
              {c.name || 'All'}
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        {!listLoading && !listError && (
          <p className="mb-4 text-sm text-mute" aria-live="polite">
            {pagination.total} {pagination.total === 1 ? 'story' : 'stories'}
            {category && ` in ${category}`}
            {search && ` matching "${search}"`}
          </p>
        )}

        {listError && (
          <EmptyState title="Could not load the news" action={<button className="btn-dark" onClick={() => fetchNews({ page, limit: 9, category, search, sort })}>Try again</button>}>
            {listError}
          </EmptyState>
        )}

        {listLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <NewsCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          !listError &&
          (news.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((n) => (
                <NewsCard key={n._id} news={n} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No stories found"
              action={
                <button className="btn-outline" onClick={() => setParams({})}>
                  Clear filters
                </button>
              }
            >
              Try a different keyword or pick another topic.
            </EmptyState>
          ))
        )}

        <Pagination page={pagination.page} pages={pagination.pages} onChange={changePage} />
      </div>
    </div>
  );
}
