import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useNewsStore } from '../../store/newsStore';
import { useAuthStore } from '../../store/authStore';
import { getErrorMessage } from '../../api/axios';
import Field from '../../components/Field';
import CoverImage from '../../components/CoverImage';

const EMPTY = { title: '', summary: '', category: '', imageUrl: '', tags: '', content: '' };

// Used for both "Write a story" (/dashboard/news/new) and "Edit" (/dashboard/news/:id/edit)
export default function NewsEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { categories, fetchCategories, fetchNewsById, createNews, updateNews } = useNewsStore();

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const loadedFor = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (!isEdit) {
      setForm(EMPTY);
      setLoading(false);
      return;
    }
    if (loadedFor.current === id) return;
    loadedFor.current = id;

    setLoading(true);
    fetchNewsById(id, { edit: true }).then((story) => {
      if (!story) {
        toast.error('Story not found');
        return navigate('/dashboard', { replace: true });
      }
      if (story.author?._id !== user?._id) {
        toast.error('You can only edit your own stories');
        return navigate('/dashboard', { replace: true });
      }
      setForm({
        title: story.title,
        summary: story.summary,
        category: story.category,
        imageUrl: story.imageUrl || '',
        tags: (story.tags || []).join(', '),
        content: story.content,
      });
      setLoading(false);
    });
  }, [id, isEdit, fetchNewsById, navigate, user?._id]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    const title = form.title.trim();
    if (title.length < 5 || title.length > 150) e.title = 'Title must be 5 to 150 characters';
    const summary = form.summary.trim();
    if (summary.length < 10 || summary.length > 300) e.summary = 'Summary must be 10 to 300 characters';
    if (!form.category) e.category = 'Choose a category';
    if (form.imageUrl.trim() && !/^https?:\/\/.+/i.test(form.imageUrl.trim())) {
      e.imageUrl = 'Enter a full image link starting with http:// or https://';
    }
    if (form.content.trim().length < 50) e.content = 'The story must be at least 50 characters';
    return e;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) {
      toast.error('Fix the highlighted fields');
      return;
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      summary: form.summary.trim(),
      imageUrl: form.imageUrl.trim(),
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    setSaving(true);
    try {
      const story = isEdit ? await updateNews(id, payload) : await createNews(payload);
      toast.success(isEdit ? 'Story updated' : 'Story published');
      navigate(`/news/${story._id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
      setSaving(false);
    }
  };

  const cls = (n) => `input ${errors[n] ? 'input-error' : ''}`;

  if (loading) {
    return <div className="h-96 animate-pulse rounded-xl bg-line" aria-label="Loading story" />;
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6 rounded-xl border border-line bg-white p-6 sm:p-8">
      <div>
        <h2 className="text-2xl font-extrabold">{isEdit ? 'Edit story' : 'Write a story'}</h2>
        <p className="mt-1 text-sm text-mute">
          {isEdit ? 'Changes go live as soon as you save.' : 'Your story goes live as soon as you publish it.'}
        </p>
      </div>

      <Field label="Headline" htmlFor="title" error={errors.title}>
        <input id="title" name="title" className={cls('title')} value={form.title} onChange={onChange} maxLength={150} />
      </Field>

      <Field
        label="Summary"
        htmlFor="summary"
        error={errors.summary}
        hint={`${form.summary.length}/300. Shown on cards and at the top of the story.`}
      >
        <textarea id="summary" name="summary" rows={3} className={cls('summary')} value={form.summary} onChange={onChange} maxLength={300} />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Category" htmlFor="category" error={errors.category}>
          <select id="category" name="category" className={cls('category')} value={form.category} onChange={onChange}>
            <option value="">Choose a category</option>
            {categories.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Tags" htmlFor="tags" hint="Separate with commas, up to 6">
          <input id="tags" name="tags" className="input" placeholder="flood, relief, dhaka" value={form.tags} onChange={onChange} />
        </Field>
      </div>

      <Field label="Cover image link" htmlFor="imageUrl" error={errors.imageUrl} hint="Optional. Paste the link of an image on the web.">
        <input id="imageUrl" name="imageUrl" className={cls('imageUrl')} placeholder="https://" value={form.imageUrl} onChange={onChange} />
      </Field>
      {form.imageUrl && /^https?:\/\/.+/i.test(form.imageUrl) && (
        <CoverImage key={form.imageUrl} src={form.imageUrl} alt="Cover preview" className="aspect-[16/7] w-full rounded-lg" />
      )}

      <Field label="Story" htmlFor="content" error={errors.content} hint="Leave a blank line between paragraphs.">
        <textarea id="content" name="content" rows={14} className={`${cls('content')} font-serif text-base leading-relaxed`} value={form.content} onChange={onChange} />
      </Field>

      <div className="flex flex-wrap gap-3">
        <button className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Publish story'}
        </button>
        <Link to="/dashboard" className="btn-outline">
          Cancel
        </Link>
      </div>
    </form>
  );
}
