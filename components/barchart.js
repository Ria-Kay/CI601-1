import { useEffect, useState, useCallback } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import ComicTile from './ComicTile';
import styles from '../styles/viewer.module.css';

export default function BarChart({ filterBy = {} }) {
  const [groupedComics, setGroupedComics] = useState({});
  const [refreshKey, setRefreshKey] = useState(0); //  triggers useEffect

  const fetchUserComics = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const colRef = collection(db, 'users', user.uid, 'savedComics');
      const snapshot = await getDocs(colRef);
      let comics = snapshot.docs.map(doc => doc.data());

      // Apply filter (favourite, read, to-read)
      if (filterBy.field && filterBy.value && filterBy.field !== 'groupBy') {
        comics = comics.filter(c => c[filterBy.field] === filterBy.value);
      }

      // Grouping logic
      const groupBy = (comic) => {
        switch (filterBy.groupBy) {
          case 'series':
            return comic.volume?.name || 'Unknown Series';
          case 'author':
            return comic.authors?.[0] || 'Unknown Author';
          default:
            return comic.cover_date?.split('-')[0] || 'Unknown Year';
        }
      };

      // Group comics
      const grouped = {};
      comics.forEach((comic) => {
        const key = groupBy(comic);
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(comic);
      });

      // Sort keys
      const sorted = Object.fromEntries(
        Object.entries(grouped).sort((a, b) => {
          const isYear = /^\d{4}$/.test(a[0]);
          return isYear ? b[0].localeCompare(a[0]) : a[0].localeCompare(b[0]);
        })
      );

      setGroupedComics(sorted);
    } catch (err) {
      console.error('Firestore fetch error:', err);
    }
  }, [filterBy]);

  useEffect(() => {
    fetchUserComics();
  }, [fetchUserComics, refreshKey]);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1); //  call this from ComicTile

  return (
    <div className={styles.viewerWrapper}>
      {Object.entries(groupedComics).map(([group, comics]) => (
        <section key={group} className={styles.barRow}>
        <div className={styles.labelCol}>
          <div className={styles.groupLabel}>{group}</div>
        </div>
        <div className={styles.coverCol}>
          <div className={styles.coverRow}>
            {comics.map((comic, i) => (
              <ComicTile key={comic.id} comic={comic} onChange={handleRefresh} />
            ))}
          </div>
        </div>
      </section>
      ))}
    </div>
  );
}
