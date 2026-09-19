import { Link } from 'react-router-dom';
import CoverImage from './CoverImage';
import { EyeIcon } from './Icons';
import { formatNumber, timeAgo } from '../utils/format';

/**
 * variant "card"   - image on top (default)
 * variant "row"    - small thumbnail on the left, for compact lists
 * `rank` adds a large readership rank numeral (used for the most-read section)
 */
export default function NewsCard({ news, variant = 'card', rank }) {
  const to = `/news/${news._id}`;

  if (variant === 'row') {
    return (
      <article className="group flex gap-4">
        <Link to={to} className="block w-28 shrink-0 sm:w-36" tabIndex={-1} aria-hidden>
          <CoverImage src={news.imageUrl} category={news.category} className="aspect-[4/3] w-full rounded-lg" />
        </Link>
        <div className="min-w-0">
          <span className="tag">{news.category}</span>
          <h3 className="mt-1.5 text-base font-bold leading-snug group-hover:text-signal">
            <Link to={to}>{news.title}</Link>
          </h3>
          <p className="mt-1 text-xs text-mute">{timeAgo(news.createdAt)}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white transition-colors hover:border-ink">
      <Link to={to} tabIndex={-1} aria-hidden className="block overflow-hidden">
        <CoverImage src={news.imageUrl} category={news.category} className="aspect-[3/2] w-full" />
      </Link>
      <div className="flex flex-1 gap-4 p-5">
        {rank && (
          <span className="font-display text-5xl font-extrabold leading-none text-signal" aria-label={`Rank ${rank}`}>
            {rank}
          </span>
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="tag self-start">{news.category}</span>
          <h3 className="mt-2 text-xl font-bold leading-snug group-hover:text-signal">
            <Link to={to}>{news.title}</Link>
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-mute">{news.summary}</p>
          <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-xs text-mute">
            <span className="truncate font-medium text-ink">{news.author?.name || 'Unknown'}</span>
            <span className="flex shrink-0 items-center gap-3">
              <span>{timeAgo(news.createdAt)}</span>
              <span className="flex items-center gap-1">
                <EyeIcon width={14} height={14} />
                {formatNumber(news.views)}
              </span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export function NewsCardSkeleton({ variant = 'card' }) {
  if (variant === 'row') {
    return (
      <div className="flex animate-pulse gap-4">
        <div className="aspect-[4/3] w-28 rounded-lg bg-line sm:w-36" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 w-16 rounded bg-line" />
          <div className="h-4 w-full rounded bg-line" />
          <div className="h-4 w-2/3 rounded bg-line" />
        </div>
      </div>
    );
  }
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-line bg-white">
      <div className="aspect-[3/2] bg-line" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-20 rounded bg-line" />
        <div className="h-5 w-full rounded bg-line" />
        <div className="h-5 w-3/4 rounded bg-line" />
        <div className="h-3 w-full rounded bg-line" />
      </div>
    </div>
  );
}
