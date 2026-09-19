export const timeAgo = (iso) => {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];
  for (const [name, size] of units) {
    const value = Math.floor(seconds / size);
    if (value >= 1) return `${value} ${name}${value > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
};

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export const formatNumber = (n = 0) => new Intl.NumberFormat('en', { notation: 'compact' }).format(n);

export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

export const readingTime = (text = '') => Math.max(1, Math.round(text.trim().split(/\s+/).length / 200));
