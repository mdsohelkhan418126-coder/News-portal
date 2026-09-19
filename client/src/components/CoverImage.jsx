import { useState } from 'react';

// Shows the story image, or a tinted placeholder if it is missing / fails to load.
export default function CoverImage({ src, alt = '', category = '', className = '' }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`grid place-items-center bg-gradient-to-br from-signal-soft to-[#FFF1B8] font-display text-6xl font-extrabold text-ink/25 ${className}`}
        role="img"
        aria-label={alt || 'No cover image'}
      >
        {category ? category[0] : 'G'}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
