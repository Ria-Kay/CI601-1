// BarChart.js
import { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import ComicTile from './ComicTile';
import styles from '../styles/viewer.module.css';

export default function BarChart({ filterBy = {} }) {
  const [groupedComics, setGroupedComics] = useState({});

  useEffect(() => {
    const fetchUserComics = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const colRef = collection(db, 'users', user.uid, 'savedComics');
        const snapshot = await getDocs(colRef);
        let comics = snapshot.docs.map(doc => doc.data());

        if (filterBy.field && filterBy.value && filterBy.field !== 'groupBy') {
          comics = comics.filter(c => c[filterBy.field] === filterBy.value);
        }

        const groupBy = (comic) => {
          switch (filterBy.groupBy) {
            case 'series':
              return comic.volume?.name || 'Unknown Series';
            case 'author':
              return comic.authors?.[0] || 'Unknown Author'; // 🔥 fix for array-based authors
            default:
              return comic.cover_date?.split('-')[0] || 'Unknown Year';
          }
        };

        const grouped = {};
        comics.forEach((comic) => {
          const key = groupBy(comic);
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(comic);
        });

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
    };

    fetchUserComics();
  }, [filterBy]);

  return (
    <div className={styles.viewerWrapper}>
      {Object.entries(groupedComics).map(([group, comics]) => (
        <section key={group} className={styles.barRow}>
          <div className={styles.groupLabel}>{group}</div>
          <div className={styles.coverRow}>
            {comics.map((comic, i) => (
              <ComicTile key={i} comic={comic} small />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
