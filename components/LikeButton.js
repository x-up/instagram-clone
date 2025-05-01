import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function LikeButton({ postId, initialLiked, initialCount }) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialCount);

  async function toggleLike() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    if (liked) {
      await supabase
        .from('likes')
        .delete()
        .match({ user_id: user.id, post_id: postId });
      setLiked(false);
      setLikes((c) => c - 1);
    } else {
      await supabase
        .from('likes')
        .insert({ user_id: user.id, post_id: postId });
      setLiked(true);
      setLikes((c) => c + 1);
    }
  }

  return (
    <button
      onClick={toggleLike}
      style={{
        background: 'none',
        border: 'none',
        color: liked ? 'red' : 'white',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      <img
        src={liked ? '/icons/heart_filled.svg' : '/icons/heart.svg'}
        alt="Like"
        width={20}
        height={20}
      />
      <span>{likes}</span>
    </button>
  );
}
