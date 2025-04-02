import { useState, useEffect } from 'react';
import styles from '../styles/ComicTilePop.module.css';

export default function ComicTilePopup({ comic }) {
  const {
    image,
    name,
    volume,
    issue_number,
    site_detail_url,
    description
  } = comic;

  const [showPopup, setShowPopup] = useState(false);

  const title = name || `${volume?.name || 'Unknown'} #${issue_number || 'Unknown'}`;
  const cover = image?.small_url;

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setShowPopup(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <>
      <div
        className={styles.slideTile}
        onClick={() => setShowPopup(true)}
      >
        <img src={cover} alt={title} className={styles.cover} />
        <h2>{title}</h2>
      </div>

      {showPopup && (
        <div className={styles.popupOverlay} onClick={() => setShowPopup(false)}>
          <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
            <img src={cover} alt={title} />
            <div className={styles.info}>
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
