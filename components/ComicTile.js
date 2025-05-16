import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from '../styles/ComicTile.module.css';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../lib/firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { showToast } from './ToastManager';

export default function ComicTile({ comic, small = false }) {
  const {
    image,
    name,
    volume,
    issue_number,
    site_detail_url,
    description,
    cover_date,
    api_detail_url,
    savedAs,
  } = comic;

  const defaultCover = comic.firebaseImage || image?.original_url || image?.small_url || image?.thumb_url;
  const title = name || `${volume?.name || 'Unknown'} #${issue_number || 'Unknown'}`;
  const date = cover_date || 'Unknown';

  const [selectedCover, setSelectedCover] = useState(defaultCover);
  const [showPopup, setShowPopup] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(savedAs || null);
  const [variantImages, setVariantImages] = useState([]);

  useEffect(() => {
    const escHandler = (e) => {
      if (e.key === 'Escape') setShowPopup(false);
    };
    window.addEventListener('keydown', escHandler);
    return () => window.removeEventListener('keydown', escHandler);
  }, []);

  useEffect(() => {
    if (!showPopup) return;

    const fetchDetailedData = async () => {
      let detailUrl = api_detail_url;
      if (!detailUrl && site_detail_url) {
        const match = site_detail_url.match(/\/(4000-\d+)\/*/);
        if (match) {
          detailUrl = `https://comicvine.gamespot.com/api/issue/${match[1]}/`;
        }
      }

      if (!detailUrl) return;

      try {
        const res = await fetch(`/api/proxy?api_detail_url=${encodeURIComponent(detailUrl)}`);
        const data = await res.json();
        const associated_images = data.results?.associated_images || [];
        const all = [image, ...associated_images];
        setVariantImages(all);
      } catch (err) {
        console.error('Failed to fetch variant data:', err);
      }
    };

    fetchDetailedData();
  }, [showPopup]);

  const uploadCoverImage = async () => {
    try {
      const proxyUrl = `/api/proxy-image?imageUrl=${encodeURIComponent(selectedCover)}`;
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error(`Proxy fetch failed: ${res.status}`);
      const blob = await res.blob();
      const fileRef = ref(storage, `covers/${comic.id}.jpg`);
      await uploadBytes(fileRef, blob);
      return await getDownloadURL(fileRef);
    } catch (err) {
      console.error('Upload failed:', err);
      return null;
    }
  };

  const handleSave = async (status) => {
    if (!auth.currentUser) return showToast('Please log in to save comics.', 'warning');
    if (status === 'to-read' && ['read', 'favourite'].includes(currentStatus)) {
      showToast("Already marked as read. Can't mark as to-read.", 'info');
      return;
    }

    const firebaseUrl = await uploadCoverImage();

    const updatedComic = {
      ...comic,
      preferredCover: selectedCover,
      firebaseImage: firebaseUrl,
      savedAs: status === 'favourite' ? 'favourite' : status,
      savedAt: new Date().toISOString(),
    };

    try {
      const docRef = doc(db, 'users', auth.currentUser.uid, 'savedComics', comic.id.toString());
      await setDoc(docRef, updatedComic);
      setCurrentStatus(updatedComic.savedAs);
      showToast(`Saved to ${updatedComic.savedAs}`, 'success');
      setShowPopup(false);
    } catch (err) {
      console.error('Failed to save comic:', err);
      showToast('Failed to save comic.', 'error');
    }
  };

  const handleUnfavourite = async () => {
    if (!auth.currentUser) return;
    try {
      const docRef = doc(db, 'users', auth.currentUser.uid, 'savedComics', comic.id.toString());
      await setDoc(docRef, { ...comic, savedAs: 'read', savedAt: new Date().toISOString() });
      setCurrentStatus('read');
      showToast('Removed from favourites.', 'info');
      setShowPopup(false);
    } catch (err) {
      console.error('Failed to unfavourite:', err);
    }
  };

  const handleUnread = async () => {
    if (!auth.currentUser) return;
    try {
      const docRef = doc(db, 'users', auth.currentUser.uid, 'savedComics', comic.id.toString());
      await setDoc(docRef, { ...comic, savedAs: 'to-read', savedAt: new Date().toISOString() });
      setCurrentStatus('to-read');
      showToast('Marked as unread.', 'info');
      setShowPopup(false);
    } catch (err) {
      console.error('Failed to mark unread:', err);
    }
  };

  const handleRemove = async () => {
    if (!auth.currentUser) return;
    try {
      const docRef = doc(db, 'users', auth.currentUser.uid, 'savedComics', comic.id.toString());
      await deleteDoc(docRef);
      setCurrentStatus(null);
      showToast('Comic removed from library.', 'info');
      setShowPopup(false);
    } catch (err) {
      console.error('Failed to delete comic:', err);
    }
  };

  const TagLabels = () => {
    if (!currentStatus) return null;

    return (
      <div className={styles.tagLabelRow}>
        {currentStatus === 'favourite' && <div className={styles.favTag}>Favourite</div>}
        {currentStatus === 'read' && <div className={styles.readTag}>Read</div>}
        {currentStatus === 'to-read' && <div className={styles.toReadTag}>To-Read</div>}
      </div>
    );
  };

  const popup = (
    <div className={styles.popupOverlay} onClick={() => setShowPopup(false)}>
      <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
        <div className={styles.actionTopRight}>
          {currentStatus === 'favourite' && (
            <button onClick={handleUnfavourite} className={styles.cornerButton}>Unfavourite</button>
          )}
          {['read', 'favourite'].includes(currentStatus) && (
            <button onClick={handleUnread} className={styles.cornerButton}>Mark as To-Read</button>
          )}
          <button onClick={handleRemove} className={styles.cornerButton}>Delete</button>
        </div>

        <img src={selectedCover} alt={title} className={styles.popupImage} />
        <div className={styles.popupInfo}>
          <TagLabels />
          <h2>{title}</h2>
          <p dangerouslySetInnerHTML={{ __html: description || 'No description available.' }}></p>
          <a href={site_detail_url} target="_blank" rel="noreferrer">View on ComicVine</a>

          {variantImages.length > 0 && (
            <div className={styles.variantCarousel}>
              <h4>Choose a Cover Variant:</h4>
              <div className={styles.variantTrack}>
                {variantImages.map((img, index) => {
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
      <div
        className={`${styles.tile} ${small ? styles.smallTile : ''}`}
        onClick={() => setShowPopup(true)}
      >
        {defaultCover && <img className={styles.cover} src={defaultCover} alt={title} />}
        <div className={styles.preview}>
          <div className={styles.info}>
            <TagLabels />
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
