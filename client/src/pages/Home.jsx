import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNewsStore } from '../store/newsStore';
import { useAuthStore } from '../store/authStore';
import NewsCard, { NewsCardSkeleton } from '../components/NewsCard';
import CoverImage from '../components/CoverImage';
import SectionHeading from '../components/SectionHeading';
import EmptyState from '../components/EmptyState';
import { timeAgo } from '../utils/format';

export default function Home() {
  const { latest, top, categories, homeLoading, fetchHome, fetchByCategory } = useNewsStore();
  const user = useAuthStore((s) => s.user);
  const [spotlight, setSpotlight] = useState([]);

  useEffect(() => {
    fetchHome();
  }, [fetchHome]);

  // Section 4: the two categories with the most stories, three fresh stories each
  useEffect(() => {
    const busiest = categories
      .filter((c) => c.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 2);
    if (!busiest.length) return;

    let cancelled = false;
    Promise.all(busiest.map(async (c) => ({ name: c.name, news: await fetchByCategory(c.name, 3) })))
      .then((result) => !cancelled && setSpotlight(result))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [categories, fetchByCategory]);

  const featured = latest[0];
  const sideStories = latest.slice(1, 5);
  const noNews = !homeLoading && latest.length === 0;

  return (
    <>
      {/* 1. Hero: newest story + latest list */}
      <section className="container-page pt-10">
        {homeLoading && (
          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="aspect-[16/10] animate-pulse rounded-2xl bg-line" />
            </div>
            <div className="space-y-5 lg:col-span-2">
              {[1, 2, 3, 4].map((i) => (
                <NewsCardSkeleton key={i} variant="row" />
              ))}
            </div>
          </div>
        )}

        {noNews && (
          <EmptyState
            title="No stories yet"
            action={
              <Link to={user ? '/dashboard/news/new' : '/register'} className="btn-primary">
                {user ? 'Write the first story' : 'Create an account to publish'}
              </Link>
            }
          >
            Once someone publishes a story it will appear here.
          </EmptyState>
        )}

        {featured && !homeLoading && (
          <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
            <article className="group lg:col-span-3">
              <Link to={`/news/${featured._id}`} tabIndex={-1} aria-hidden className="block overflow-hidden rounded-2xl">
                <CoverImage
                  src={featured.imageUrl}
                  category={featured.category}
                  className="aspect-[16/10] w-full"
                />
              </Link>
              <div className="mt-5 flex items-center gap-3">
                <span className="rounded bg-flash px-2 py-0.5 text-xs font-bold">Newest</span>
                <span className="tag">{featured.category}</span>
              </div>
              <h1 className="mt-3 text-3xl font-extrabold leading-[1.08] sm:text-5xl">
                <Link to={`/news/${featured._id}`} className="hover:text-signal">
                  {featured.title}
                </Link>
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-mute">{featured.summary}</p>
              <p className="mt-4 text-sm text-mute">
                By <span className="font-semibold text-ink">{featured.author?.name}</span>, {timeAgo(featured.createdAt)}
              </p>
            </article>

            <aside className="lg:col-span-2">
              <h2 className="border-b-2 border-ink pb-3 text-lg font-bold">Latest stories</h2>
              <div className="divide-y divide-line">
                {sideStories.map((n) => (
                  <div key={n._id} className="py-5">
                    <NewsCard news={n} variant="row" />
                  </div>
                ))}
              </div>
              <Link to="/news" className="mt-2 inline-block text-sm font-semibold text-signal hover:underline">
                Browse all news
              </Link>
            </aside>
          </div>
        )}
      </section>

      {/* 2. Most read: top 6 by views */}
      <section className="container-page mt-20">
        <SectionHeading title="Most read" subtitle="The six stories readers have opened most." linkTo="/news?sort=popular" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {homeLoading
            ? [1, 2, 3, 4, 5, 6].map((i) => <NewsCardSkeleton key={i} />)
            : top.map((n, i) => <NewsCard key={n._id} news={n} rank={i + 1} />)}
        </div>
        {!homeLoading && top.length === 0 && <p className="text-sm text-mute">Nothing has been read yet.</p>}
      </section>

      {/* 3. Browse by category */}
      <section className="container-page mt-20">
        <SectionHeading title="Browse by topic" subtitle="Jump straight to the section you care about." />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c.name}
              to={`/news?category=${c.name}`}
              className="rounded-xl border border-line bg-white p-4 transition-colors hover:border-signal hover:bg-signal-soft"
            >
              <span className="block font-display text-lg font-bold">{c.name}</span>
              <span className="text-xs text-mute">
                {c.count} {c.count === 1 ? 'story' : 'stories'}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Topic spotlights */}
      {spotlight.map((group) => (
        <section key={group.name} className="container-page mt-20">
          <SectionHeading
            title={group.name}
            subtitle={`Fresh in ${group.name.toLowerCase()}`}
            linkTo={`/news?category=${group.name}`}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {group.news.map((n) => (
              <NewsCard key={n._id} news={n} />
            ))}
          </div>
        </section>
      ))}

      {/* 5. Call to action */}
      <section className="container-page mt-20">
        <div className="grid items-center gap-6 rounded-2xl bg-ink p-8 text-white sm:p-12 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-extrabold sm:text-4xl">Saw something worth reporting?</h2>
            <p className="mt-3 max-w-xl text-white/70">
              Create a free account, write up what happened, add a photo and publish it for the whole community to
              read.
            </p>
          </div>
          <div className="md:text-right">
            <Link
              to={user ? '/dashboard/news/new' : '/register'}
              className="btn bg-flash px-6 py-3 text-ink hover:bg-yellow-300"
            >
              {user ? 'Write a story' : 'Start writing'}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
