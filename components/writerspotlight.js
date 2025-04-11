import { useEffect, useState } from 'react';
import Carousel from './carousel'; 
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

        const issueRes = await fetch(`/api/proxy?resource=issues&filter=person:${picked.id}&limit=10`);
        const issueData = await issueRes.json();
        setIssues(issueData.results || []);
      } catch (err) {
        console.error('Error loading spotlight:', err);
      }
    };

    fetchSpotlight();
  }, []);

  if (!person) return <div>Loading spotlight...</div>;

  return (
    <section className={styles.spotlight}>
      <h2>Spotlight: {person.name}</h2>
      {person.image && <img src={person.image.original_url} alt={person.name} className={styles.personImg} />}
      {person.deck && <p>{person.deck}</p>}

      {issues.length > 0 && (
        <>
          <h3>Comics by {person.name}</h3>
          <Carousel>
            {issues.map((comic) => (
              <div key={comic.id} className={styles.comicCard}>
                <img src={comic.image?.small_url} alt={comic.name} />
                <p>{comic.volume?.name} #{comic.issue_number}</p>
              </div>
            ))}
          </Carousel>
        </>
      )}
    </section>
  );
}
