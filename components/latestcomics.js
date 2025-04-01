import { useEffect, useState } from 'react';
import Carousel from './carousel';
import ComicTile from './comictile';
export default function LatestComics() {
  const [comics, setComics] = useState([]);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const response = await fetch('/api/proxy?query=new&sort=cover_date:desc&limit=10');
        const data = await response.json();
        setComics(data.results || []);
      } catch (err) {
        console.error('Error fetching latest comics:', err);
      }
    };

    fetchLatest();
  }, []);

  return (
    <section>
      <h2>This weeks new Issues</h2>
      <Carousel>
        {comics.map((comic, index) => (
          <ComicTile key={index} comic={comic} />
        ))}
      </Carousel>
    </section>
  );
}
