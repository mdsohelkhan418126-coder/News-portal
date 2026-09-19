import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useNewsStore } from '../../store/newsStore';
import { getErrorMessage } from '../../api/axios';
import CoverImage from '../../components/CoverImage';
import ConfirmModal from '../../components/ConfirmModal';
import EmptyState from '../../components/EmptyState';
import { EyeIcon, PencilIcon, PlusIcon, TrashIcon } from '../../components/Icons';
import { formatDate, formatNumber } from '../../utils/format';

export default function MyStories() {
  const { myNews, myLoading, fetchMyNews, deleteNews } = useNewsStore();
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchMyNews().catch((err) => toast.error(getErrorMessage(err)));
  }, [fetchMyNews]);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteNews(toDelete._id);
      toast.success('Story deleted');
      setToDelete(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const totalViews = myNews.reduce((sum, n) => sum + (n.views || 0), 0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-extrabold">My stories</h2>
        <Link to="/dashboard/news/new" className="btn-primary">
          <PlusIcon width={16} height={16} /> Write a story
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-line bg-white p-4">
          <p className="text-sm text-mute">Published</p>
          <p className="font-display text-3xl font-extrabold">{myNews.length}</p>
        </div>
        <div className="rounded-xl border border-line bg-white p-4">
          <p className="text-sm text-mute">Total reads</p>
          <p className="font-display text-3xl font-extrabold">{formatNumber(totalViews)}</p>
        </div>
      </div>

      <div className="mt-6">
        {myLoading && myNews.length === 0 && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-line" />
            ))}
          </div>
        )}

        {!myLoading && myNews.length === 0 && (
          <EmptyState
            title="You have not published anything yet"
            action={
              <Link to="/dashboard/news/new" className="btn-primary">
                Write your first story
              </Link>
            }
          >
            Your stories will be listed here, where you can edit or delete them.
          </EmptyState>
        )}

        <ul className="space-y-3">
          {myNews.map((n) => (
            <li key={n._id} className="flex flex-col gap-4 rounded-xl border border-line bg-white p-4 sm:flex-row sm:items-center">
              <CoverImage src={n.imageUrl} category={n.category} className="aspect-[4/3] w-full rounded-lg text-3xl sm:w-32" />
              <div className="min-w-0 flex-1">
                <span className="tag">{n.category}</span>
                <h3 className="mt-1.5 truncate text-lg font-bold">
                  <Link to={`/news/${n._id}`} className="hover:text-signal">
                    {n.title}
                  </Link>
                </h3>
                <p className="mt-1 flex items-center gap-4 text-xs text-mute">
                  <span>{formatDate(n.createdAt)}</span>
                  <span className="flex items-center gap-1">
                    <EyeIcon width={14} height={14} /> {formatNumber(n.views)}
                  </span>
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link to={`/dashboard/news/${n._id}/edit`} className="btn-outline py-2">
                  <PencilIcon width={15} height={15} /> Edit
                </Link>
                <button className="btn-outline py-2 text-alert" onClick={() => setToDelete(n)}>
                  <TrashIcon width={15} height={15} /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <ConfirmModal
        open={!!toDelete}
        busy={deleting}
        title="Delete this story?"
        message={toDelete ? `"${toDelete.title}" will be removed from Ground Report. This cannot be undone.` : ''}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
