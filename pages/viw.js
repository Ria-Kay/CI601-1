import { useEffect, useState } from 'react';
import ComicTile from '../components/comictile';
import styles from '../styles/viewer.module.css';
import Header from '../components/Header';
export default function Viewer() {
  const [groupedComics, setGroupedComics] = useState({});

  useEffect(() => {
    async function fetchComics() {
      try {
        const res = await fetch('/api/proxy?query=batman&limit=100');
        const data = await res.json();

        const grouped = {};

        (data.results || []).forEach((comic) => {
          const year = comic.cover_date?.split('-')[0] || 'Unknown';
          if (!grouped[year]) grouped[year] = [];
          grouped[year].push(comic);
        });

        // Sort years descending
        const sorted = Object.fromEntries(
          Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0]))
        );

        setGroupedComics(sorted);
      } catch (err) {
        console.error('Error loading comics:', err);
      }
    }

    fetchComics();
  }, []);

  return (
    <main className={styles.viewerWrapper}>
      <h1 className={styles.title}> Comic  Viewer</h1>
            <div>
                <Header />
            </div>
      {Object.entries(groupedComics).map(([year, comics]) => (
        <section key={year} className={styles.yearSection}>
          <h2 className={styles.yearLabel}>{year}</h2>
          <div className={styles.coverRow}>
            {comics.map((comic, i) => (
              <ComicTile key={i} comic={comic} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
