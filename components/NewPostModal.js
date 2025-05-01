import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import styles from '../styles/NewPostModal.module.css';
import BackIcon from './icons/BackIcon';

export default function NewPostModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [caption, setCaption] = useState('');
  const [user, setUser] = useState(null);
  const captionRef = useRef();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const sessionUser = data?.user;
      if (!sessionUser) return;
      supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', sessionUser.id)
        .single()
        .then(({ data }) => setUser({ ...data, id: sessionUser.id }));
    });
  }, []);

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setStep(2);
    }
  }

  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setStep(2);
    }
  }

  async function handleSubmit() {
    if (!image || !user) return;

    const ext = image.name.split('.').pop();
    const filename = `${user.id}_${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('posts')
      .upload(filename, image);

    if (uploadError) {
      alert('Upload failed.');
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('posts')
      .getPublicUrl(filename);

    const { error: insertError, data: inserted } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        image_url: publicUrl,
        caption: caption.slice(0, 2000),
      })
      .select();

    if (insertError) return alert('Post failed.');

    onClose();
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <button
            onClick={onClose}
            className={styles.backButton}
            aria-label="Back"
          >
            <BackIcon />
          </button>
          <span className={styles.title}>Create new post</span>
          <div className={styles.rightSpacer} />
        </div>

        {step === 1 && (
          <div
            className={styles.dropZone}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <p>Drag photo here</p>
            <label className={styles.selectBtn}>
              Select from computer
              <input type="file" accept="image/*" onChange={handleFileSelect} hidden />
            </label>
          </div>
        )}

        {step === 2 && (
          <div className={styles.previewArea}>
            <img src={previewUrl} className={styles.previewImage} />

            <div className={styles.sidebar}>
              <div className={styles.profileRow}>
                <img
                  src={user?.avatar_url || '/avatar-default.png'}
                  alt="avatar"
                  className={styles.avatar}
                />
                <span>{user?.username}</span>
              </div>

              <textarea
                ref={captionRef}
                placeholder="Caption here..."
                value={caption}
                maxLength={2000}
                onChange={(e) => setCaption(e.target.value)}
                className={styles.caption}
              />
              <div className={styles.charCount}>{caption.length}/2000</div>

              <button onClick={handleSubmit} className={styles.shareBtn}>
                Share
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
