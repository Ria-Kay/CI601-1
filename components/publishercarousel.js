import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Carousel from './carousel';
import styles from '../styles/carousel.module.css';


export default function PublisherCarousel() {
  const [publishers, setPublishers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPublishers = async () => {
      try {
        const response = await fetch('/api/proxy?resource=publishers&limit=10&format=json');
        // let comicvine give some publishers instead of hardoing for now
        //somethings wrong w proxy need to add json if it wont break rest of code
        const data = await response.json();
        setPublishers(data.results || []);
      } catch (err) {
        console.error('Failed to fetch publishers:', err);
      }
    };

    fetchPublishers();
  }, []);

  const handleClick = (name) => {
    router.push(`/search?q=${encodeURIComponent(name)}`);
  };

  return (
    <section className="publisherSection">
      <h2>Browse by Publisher</h2>
      <Carousel>
        {publishers.map((pub) => (
          <div key={pub.id} className="publisherCard" onClick={() => handleClick(pub.name)}>
            <img src={pub.image?.original_url} alt={pub.name} className="publisherLogo" />
            <p>{pub.name}</p>
          </div>
        ))}
      </Carousel>
    </section>
  );
}//foes tot he search page, maybe make a set "sporlight" page i can reuse for specific series' and publishers?
