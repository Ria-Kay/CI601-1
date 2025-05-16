import { useState, useEffect } from 'react';
import BarChart from '../components/barchart';
import ComicHunt from '../components/comichunt';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/viewer.module.css';

export default function ViewerPage() {
  const [savedAs, setSavedAs] = useState('all');
  const [groupBy, setGroupBy] = useState('year');
  const [zoom, setZoom] = useState(100);

  const zoomLevels = [50, 75, 100, 125, 150];

  const filterProps = {
    ...(savedAs !== 'all' && { field: 'savedAs', value: savedAs }),
    groupBy,
  };
//IS USED
  // Enable ctrl+scroll zoom so ppl can interqct more 
  useEffect(() => {
    const handleWheelZoom = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        setZoom((prevZoom) => {
          const newZoom = prevZoom + (e.deltaY < 0 ? 10 : -10);
          return Math.max(50, Math.min(200, newZoom));
        });
      }
    };

    window.addEventListener('wheel', handleWheelZoom, { passive: false });
    return () => window.removeEventListener('wheel', handleWheelZoom);
  }, []);

  return (
    <main>
      <ComicHunt />
      <Header />

      <div className="variables">
        <select onChange={(e) => setSavedAs(e.target.value)} value={savedAs}>
          <option value="all">All Comics</option>
          <option value="favourite">Favourites</option>
          <option value="read">Read</option>
          <option value="to-read">To-Read</option>
        </select>

        <select onChange={(e) => setGroupBy(e.target.value)} value={groupBy}>
          <option value="year">Group by Year</option>
          <option value="series">Group by Series</option>
          <option value="author">Group by Author</option>
        </select>
      </div>

      <div className={styles.zoomControls}>
        {zoomLevels.map((z) => (
          <button
            key={z}
            onClick={() => setZoom(z)}
            className={zoom === z ? styles.activeZoom : ''}
          >
            {z}%
          </button>
        ))}
      </div>

      <div
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top left',
          transition: 'transform 0.2s ease-in-out',
        }}
      >
        <BarChart filterBy={filterProps} />
      </div>

      <Footer />
    </main>
  );
}
