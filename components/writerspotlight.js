import { useEffect, useState } from 'react';
import Carousel from './carousel'; 
import ComicTile from './comictile';
import styles from '../styles/Spotlight.module.css';

export default function Spotlight() {
  const [person, setPerson] = useState(null);
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const fetchSpotlight = async () => {
      try {
        const totalRes = await fetch('/api/proxy?resource=people&limit=1');
        const totalData = await totalRes.json();
        const total = totalData.number_of_total_results;
        const offset = Math.floor(Math.random() * total);

        const personRes = await fetch(`/api/proxy?resource=people&limit=1&offset=${offset}`);
        const personData = await personRes.json();
        const picked = personData.results[0];
        setPerson(picked);

        const issueRes = await fetch(`/api/proxy?resource=issues&filter=person:${picked.id}&limit=20`);
        const issueData = await issueRes.json();

        if (issueData?.results?.length > 0) {
          const shuffled = issueData.results.sort(() => 0.5 - Math.random());
          setIssues(shuffled.slice(0, 10));
        } else {
          setIssues([]);
        }

      } catch (err) {
        setIssues([]);
      }
    };

    fetchSpotlight();
  }, []);

  if (!person) return <div>Loading spotlight...</div>;

  return (
    <section className={styles.spotlight}>
      <h2>Spotlight: {person.name}</h2>

      <img
        src={
          person.image?.original_url === "https://comicvine.gamespot.com/a/uploads/original/11122/111222211/6373148-blank.png"
            ? "/images/404NF.svg"
            : person.image?.original_url
        }
        alt={person.name}
        className={styles.personImg}
      />

      {person.deck && <p>{person.deck}</p>}

      {issues.length > 0 && (
        <>
          <h3>Comics by {person.name}</h3>
          <Carousel>
            {issues.map((comic) => (
              <div key={comic.id} className={styles.comicCard}>
                <ComicTile comic={comic} />
              </div>
            ))}
          </Carousel>
        </>
      )}
    </section>
  );
}
