import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useNewsStore } from '../store/newsStore';
import { useAuthStore } from '../store/authStore';
import { getErrorMessage } from '../api/axios';
import CoverImage from '../components/CoverImage';
import Avatar from '../components/Avatar';
import NewsCard from '../components/NewsCard';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import SectionHeading from '../components/SectionHeading';
import { EyeIcon, LinkIcon, PencilIcon, TrashIcon } from '../components/Icons';
import { formatDate, formatNumber, readingTime } from '../utils/format';

export default function NewsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { current: news, related, detailLoading, detailError, fetchNewsById, deleteNews } = useNewsStore();
  const user = useAuthStore((s) => s.user);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fetchedFor = useRef(null); // stops React StrictMode from counting a view twice

  useEffect(() => {
    if (fetchedFor.current === id) return;
    fetchedFor.current = id;
    fetchNewsById(id);
    window.scrollTo(0, 0);
  }, [id, fetchNewsById]);

  const isOwner = user && news && news.author?._id === user._id;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteNews(news._id);
      toast.success('Story deleted');
      navigate('/dashboard');
    } catch (err) {
      toast.error(getErrorMessage(err));
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied');
    } catch {
      toast.error('Could not copy the link');
    }
  };

  if (detailLoading || (!news && !detailError)) {
    return (
      <div className="container-page max-w-3xl animate-pulse py-12">
        <div className="h-5 w-24 rounded bg-line" />
        <div className="mt-4 h-10 w-full rounded bg-line" />
        <div className="mt-3 h-10 w-2/3 rounded bg-line" />
        <div className="mt-8 aspect-[16/9] rounded-2xl bg-line" />
      </div>
    );
  }

  if (detailError) {
    return (
      <div className="container-page max-w-3xl py-16">
        <EmptyState
          title="Story not found"
          action={
            <Link to="/news" className="btn-dark">
              Back to all news
            </Link>
          }
        >
          {detailError}. It may have been removed by its author.
        </EmptyState>
      </div>
    );
  }

  const paragraphs = news.content.split(/\n{2,}/).filter(Boolean);

  return (
    <>
      <article className="container-page max-w-3xl py-10">
        <div className="flex items-center gap-3">
          <Link to={`/news?category=${news.category}`} className="tag hover:bg-signal hover:text-white">
            {news.category}
          </Link>
          <span className="text-sm text-mute">{readingTime(news.content)} min read</span>
        </div>

        <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] sm:text-5xl">{news.title}</h1>
        <p className="mt-4 text-xl leading-relaxed text-mute">{news.summary}</p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
          <div className="flex items-center gap-3">
            <Avatar user={news.author} size={40} />
            <div>
              <p className="text-sm font-semibold">{news.author?.name}</p>
              <p className="text-xs text-mute">{formatDate(news.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-mute">
            <span className="flex items-center gap-1.5">
              <EyeIcon width={16} height={16} /> {formatNumber(news.views)} reads
            </span>
            <button onClick={copyLink} className="flex items-center gap-1.5 font-semibold text-ink hover:text-signal">
              <LinkIcon width={16} height={16} /> Copy link
            </button>
          </div>
        </div>

        {isOwner && (
          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl bg-flash/40 px-4 py-3">
            <p className="mr-auto text-sm font-semibold">This is your story.</p>
            <Link to={`/dashboard/news/${news._id}/edit`} className="btn-outline py-1.5">
              <PencilIcon width={15} height={15} /> Edit
            </Link>
            <button onClick={() => setConfirmOpen(true)} className="btn-outline py-1.5 text-alert">
              <TrashIcon width={15} height={15} /> Delete
            </button>
          </div>
        )}

        <CoverImage
          src={news.imageUrl}
          alt={news.title}
          category={news.category}
          className="mt-8 aspect-[16/9] w-full rounded-2xl"
        />

        <div className="mt-10 space-y-6 font-serif text-[1.2rem] leading-[1.75]">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {news.tags?.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {news.tags.map((t) => (
              <Link
                key={t}
                to={`/news?search=${encodeURIComponent(t)}`}
                className="rounded-full border border-line bg-white px-3 py-1 text-sm hover:border-ink"
              >
                #{t}
              </Link>
            ))}
          </div>
        )}

        {news.author?.bio && (
          <div className="mt-10 flex gap-4 rounded-xl border border-line bg-white p-5">
            <Avatar user={news.author} size={52} />
            <div>
              <p className="font-display font-bold">Written by {news.author.name}</p>
              <p className="mt-1 text-sm text-mute">{news.author.bio}</p>
            </div>
          </div>
        )}
      </article>

      {related.length > 0 && (
        <section className="container-page mt-6">
          <SectionHeading title={`More in ${news.category}`} linkTo={`/news?category=${news.category}`} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((n) => (
              <NewsCard key={n._id} news={n} />
            ))}
          </div>
        </section>
      )}

      <ConfirmModal
        open={confirmOpen}
        busy={deleting}
        title="Delete this story?"
        message="It will be removed from Ground Report for everyone. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
