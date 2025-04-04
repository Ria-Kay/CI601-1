import { useEffect, useState } from 'react';
import Carousel from './carousel';
import ComicTile from './comictile';

export default function LatestComics() {
  const [comics, setComics] = useState([]);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const response = await fetch('/api/proxy?query=new&sort=cover_date:desc&limit=100');
        //const response = await fetch('/api/proxy?query=*&sort=cover_date:desc&limit=100');

        const data = await response.json();

        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        const filtered = (data.results || []).filter((comic) => {
          if (!comic.cover_date) return false;
          const coverDate = new Date(comic.cover_date);
          return coverDate >= sevenDaysAgo && coverDate <= today;
        });

        setComics(filtered);
      } catch (err) {
        console.error('Error fetching latest comics:', err);
      }
    };

    fetchLatest();
  }, []);

  return (
    <section>
      <h2>This week's new Issues</h2>
      <Carousel>
        {comics.map((comic, index) => (
          <ComicTile key={index} comic={comic} />
        ))}
      </Carousel>
    </section>
  );
}
