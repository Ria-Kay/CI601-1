import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import * as THREE from 'three';
import ComicTile from '../components/ComicTile';
import Header from '../components/Header';

const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { ssr: false });

export default function ModelerPage() {
  const [comics, setComics] = useState([]);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [selectedComic, setSelectedComic] = useState(null);
  const [filterType, setFilterType] = useState('year');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
      if (user) {
        const querySnapshot = await getDocs(
          collection(db, 'users', user.uid, 'savedComics')
        );
        const comicsData = [];
        querySnapshot.forEach((doc) => comicsData.push(doc.data()));
        setComics(comicsData);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!comics.length) return;

    const nodes = comics.map((comic) => ({
      id: comic.id,
      image: comic.firebaseImage || comic.preferredCover,
      comic,
    }));

    const links = generateLinks(comics, filterType);
    setGraphData({ nodes, links });
  }, [comics, filterType]);

  const generateLinks = (comics, type) => {
    const links = [];
    const groups = {};

    comics.forEach((comic) => {
      let key;
      if (type === 'year') {
        key = comic.cover_date?.slice(0, 4);
      } else if (type === 'series') {
        key = comic.volume?.name;
      }
      if (!key) return;
      if (!groups[key]) groups[key] = [];
      groups[key].push(comic);
    });

    Object.values(groups).forEach((group) => {
      for (let i = 0; i < group.length - 1; i++) {
        links.push({
          source: group[i].id,
          target: group[i + 1].id,
        });
      }
    });

    return links;
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Header />

      {/* 🔄 Filter Dropdown */}
      <div style={{ position: 'absolute', top: 70, left: 20, zIndex: 10 }}>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ fontSize: '1rem', padding: '0.5rem', borderRadius: '6px' }}
        >
          <option value="year">Group by Year</option>
          <option value="series">Group by Series</option>
        </select>
      </div>

      {/* 🪄 Popup for comic info */}
      {selectedComic && (
        <div
          style={{
            position: 'fixed',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            padding: '1rem',
            borderRadius: '12px',
            boxShadow: '0 0 20px rgba(0,0,0,0.5)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <ComicTile comic={selectedComic} />
          <button onClick={() => setSelectedComic(null)} style={{ marginTop: '0.5rem' }}>
            ✖ Close
          </button>
        </div>
      )}

      {/* 🌐 3D Graph */}
      <ForceGraph3D
        graphData={graphData}
        nodeThreeObject={(node) => {
          const texture = new THREE.TextureLoader().load(node.image);
          const material = new THREE.SpriteMaterial({ map: texture });
          const sprite = new THREE.Sprite(material);
          sprite.scale.set(8, 12, 1);
          return sprite;
        }}
        linkColor={() => '#ff00ff'}
        linkWidth={1}
        onNodeClick={(node) => setSelectedComic(node.comic)}
        enableNodeHover={false}
        nodeLabel={() => ''}
      />
    </div>
  );
}
