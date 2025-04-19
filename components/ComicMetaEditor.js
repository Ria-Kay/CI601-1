import { useState, useEffect } from 'react';
import styles from '../styles/ComicMetaEditor.module.css';

export default function MetadataEditor({ missingFields = {}, onSave, onCancel }) {
  const [publisher, setPublisher] = useState('');
  const [characters, setCharacters] = useState('');
  const [authors, setAuthors] = useState('');

  useEffect(() => {
    if (missingFields.publisher) setPublisher(missingFields.publisher);
    if (missingFields.characters?.length) setCharacters(missingFields.characters.join(', '));
    if (missingFields.authors?.length) setAuthors(missingFields.authors.join(', '));
  }, [missingFields]);

  const handleSubmit = () => {
    const updatedFields = {
      publisher: publisher.trim() || null,
      characters: characters.split(',').map(c => c.trim()).filter(Boolean),
      authors: authors.split(',').map(a => a.trim()).filter(Boolean),
    };
    onSave(updatedFields);
  };

  return (
    <div className={styles.editorOverlay} onClick={onCancel}>
      <div className={styles.editorPopup} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>📝 Add Missing Info</h2>
        <p className={styles.subtitle}>
          Some data was missing from ComicVine. You can add it now:
        </p>

        <label className={styles.label}>
          Publisher:
          <input
            type="text"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Characters (comma separated):
          <input
            type="text"
            value={characters}
            onChange={(e) => setCharacters(e.target.value)}
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Authors (comma separated):
          <input
            type="text"
            value={authors}
            onChange={(e) => setAuthors(e.target.value)}
            className={styles.input}
          />
        </label>

        <div className={styles.buttons}>
          <button onClick={handleSubmit} className={styles.saveButton}>Save Comic</button>
          <button onClick={onCancel} className={styles.cancelButton}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
