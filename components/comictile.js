import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from '../styles/ComicTile.module.css';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { storage } from '../lib/firebase';

export default function ComicTile({ comic }) {
  const {
    image,
    name,
    volume,
    issue_number,
    site_detail_url,
    description,
    cover_date,
    associated_images = [],
  } = comic;

  const defaultCover = image?.original_url || image?.small_url || image?.thumb_url;
  const title = name || `${volume?.name || 'Unknown'} #${issue_number || 'Unknown'}`;
  const date = cover_date || 'Unknown';

  const [selectedCover, setSelectedCover] = useState(defaultCover);
  const [showPopup, setShowPopup] = useState(false);
  const [firebaseImageUrl, setFirebaseImageUrl] = useState(null);

  useEffect(() => {
    const escHandler = (e) => {
      if (e.key === 'Escape') setShowPopup(false);
    };
    window.addEventListener('keydown', escHandler);
    return () => window.removeEventListener('keydown', escHandler);
  }, []);
  const uploadCoverImage = async () => {
    try {
      const proxyUrl = `/api/proxy-image?imageUrl=${encodeURIComponent(selectedCover)}`;
      console.log('🔄 Fetching image from proxy:', proxyUrl);

      const res = await fetch(proxyUrl);
      if (!res.ok) {
        throw new Error(`Proxy fetch failed: ${res.status}`);
      }

      const blob = await res.blob();
      console.log('📦 Blob size:', blob.size, 'type:', blob.type);

      // const storage = getStorage();
      const fileRef = ref(storage, `covers/${comic.id}.jpg`);

      console.log('📤 Uploading to Firebase Storage at:', `covers/${comic.id}.jpg`);
      await uploadBytes(fileRef, blob);
      console.log('✅ Upload complete');

      const downloadUrl = await getDownloadURL(fileRef);
      console.log('🌐 Firebase image URL:', downloadUrl);

      setFirebaseImageUrl(downloadUrl);
      return downloadUrl;
    } catch (err) {
      console.error('🔥 Upload failed:', err);
      return null;
    }
  };

  const handleSave = async (status) => {
    if (!auth.currentUser) return alert('Please log in to save comics.');

    const firebaseUrl = await uploadCoverImage();

    const updatedComic = {
      ...comic,
      preferredCover: selectedCover,
      firebaseImage: firebaseUrl,
      savedAs: status,
      savedAt: new Date().toISOString(),
    };

    try {
      const docRef = doc(db, 'users', auth.currentUser.uid, 'savedComics', comic.id.toString());
      await setDoc(docRef, updatedComic);
      alert(`Saved to ${status}`);
    } catch (err) {
      console.error('❌ Failed to save comic to Firestore:', err);
    }
  };

  const popup = (
    <div className={styles.popupOverlay} onClick={() => setShowPopup(false)}>
      <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
        <img src={selectedCover} alt={title} className={styles.popupImage} />
        <div className={styles.popupInfo}>
          <h2>{title}</h2>
          <p dangerouslySetInnerHTML={{ __html: description || 'No description available.' }}></p>
          <a href={site_detail_url} target="_blank" rel="noreferrer">View on ComicVine</a>

          {associated_images.length > 0 && (
            <div className={styles.variantCarousel}>
              <h4>Choose a Cover Variant:</h4>
              <div className={styles.variantTrack}>
                {[image, ...associated_images].map((img, index) => {
                  const url = img.original_url || img;
                  return (
                    <img
                      key={index}
                      src={url}
                      alt={`Variant ${index + 1}`}
                      className={`${styles.variantImage} ${selectedCover === url ? styles.activeVariant : ''}`}
                      onClick={() => setSelectedCover(url)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          <div className={styles.popupButtons}>
            <button onClick={() => handleSave('favourite')}>Save as Favourite</button>
            <button onClick={() => handleSave('read')}>Save as Read</button>
            <button onClick={() => handleSave('to-read')}>Save as To-Read</button>
          </div>

          <button onClick={() => setShowPopup(false)}>Close</button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className={styles.tile} onClick={() => setShowPopup(true)}>
        {defaultCover && <img className={styles.cover} src={defaultCover} alt={title} />}
        <div className={styles.preview}>
          <div className={styles.info}>
            <h3>{title}</h3>
            <p>Issue #{issue_number || '?'}</p>
            <p>{date}</p>
            <a
              href={site_detail_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              onClick={(e) => e.stopPropagation()}
            >
              View on ComicVine
            </a>
          </div>
        </div>
      </div>

      {showPopup && createPortal(popup, document.body)}
    </>
  );
}
