import { useState } from 'react';
import { initials } from '../utils/format';

export default function Avatar({ user, size = 32 }) {
  const [failed, setFailed] = useState(false);
  const style = { width: size, height: size, fontSize: size * 0.4 };

  if (user?.avatar && !failed) {
    return (
      <img
        src={user.avatar}
        alt=""
        style={style}
        onError={() => setFailed(true)}
        className="shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <span
      style={style}
      className="grid shrink-0 place-items-center rounded-full bg-flash font-display font-bold text-ink"
      aria-hidden
    >
      {initials(user?.name) || '?'}
    </span>
  );
}
