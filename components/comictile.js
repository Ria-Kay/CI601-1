import { useState, useEffect } from 'react';
import styles from '../styles/ComicTile.module.css';

export default function ComicTile({ comic }) {
  const {
    image,
    name,
    volume,
    issue_number,
    site_detail_url,
    description,
    cover_date
  } = comic;

  const title = name || `${volume?.name || 'Unknown'} #${issue_number || 'Unknown'}`;
  const cover = image?.small_url;
  const date = cover_date || 'Unknown';

  const [showPopup, setShowPopup] = useState(false);

  const handleSave = () => {
    alert(`Comic saved: ${title}`);
  };

  // Allow ESC to close popup
  useEffect(() => {
    const escHandler = (e) => {
      if (e.key === 'Escape') setShowPopup(false);
    };
    window.addEventListener('keydown', escHandler);
    return () => window.removeEventListener('keydown', escHandler);
  }, []);

  return (
    <>
      <div className={styles.tile} onClick={() => setShowPopup(true)}>
        {cover && <img className={styles.cover} src={cover} alt={title} />}
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
              onClick={(e) => e.stopPropagation()} // So link doesn't trigger popup
            >
              View on ComicVine
            </a>
          </div>
          <button className={styles.saveBtn} onClick={(e) => {
            e.stopPropagation(); // Prevent opening popup
            handleSave();
          }}>
            Save 📥
          </button>
        </div>
      </div>

      {showPopup && (
        <div className={styles.popupOverlay} onClick={() => setShowPopup(false)}>
          <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
            <img src={cover} alt={title} className={styles.popupImage} />
            <div className={styles.popupInfo}>
              <h2>{title}</h2>
              <p dangerouslySetInnerHTML={{ __html: description || 'No description available.' }}></p>
              <a href={site_detail_url} target="_blank" rel="noreferrer">View on ComicVine</a>
              <button onClick={() => setShowPopup(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
