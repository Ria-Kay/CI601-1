import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from '../styles/ComicTile.module.css';
import SaveButton from './saveButton';


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
  const [selectedCover, setSelectedCover] = useState(cover);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const escHandler = (e) => {
      if (e.key === 'Escape') setShowPopup(false);
    };
    window.addEventListener('keydown', escHandler);
    return () => window.removeEventListener('keydown', escHandler);
  }, []);

  const popup = (
    <div className={styles.popupOverlay} onClick={() => setShowPopup(false)}>
      <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
        <img src={cover} alt={title} className={styles.popupImage} />
        <div className={styles.popupInfo}>
          <h2>{title}</h2>
          <p dangerouslySetInnerHTML={{ __html: description || 'No description available.' }}></p>
          <a href={site_detail_url} target="_blank" rel="noreferrer">View on ComicVine</a>

          {comic.associated_images && comic.associated_images.length > 0 && (
            <div className={styles.variantCarousel}>
              <h4>Choose a Cover Variant:</h4>
              <div className={styles.variantTrack}>
                {[comic.image, ...comic.associated_images].map((img, index) => (
                  <img
                    key={index}
                    src={img.original_url || img}
                    alt={`Variant ${index + 1}`}
                    className={`${styles.variantImage} ${selectedCover === (img.original_url || img) ? styles.activeVariant : ''}`}
                    onClick={() => setSelectedCover(img.original_url || img)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className={styles.popupButtons}>
            <SaveButton comic={{ ...comic, preferredCover: selectedCover }} status="favourite" />
            <SaveButton comic={{ ...comic, preferredCover: selectedCover }} status="read" />
            <SaveButton comic={{ ...comic, preferredCover: selectedCover }} status="to-read" />
          </div>

          <button onClick={() => setShowPopup(false)}>Close</button>
        </div>
      </div>
    </div>
  );

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
              onClick={(e) => e.stopPropagation()}
            >
              View on ComicVine
            </a>
          </div>
          <SaveButton comic={comic} status="favourite" />
        </div>
      </div>

      {showPopup && createPortal(popup, document.body)}
    </>
  );
}
