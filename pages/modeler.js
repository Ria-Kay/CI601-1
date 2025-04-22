import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import * as THREE from 'three';
import ComicTile from '../components/ComicTiletemp';
import Header from '../components/Header';

const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { ssr: false });

export default function ModelerPage() {
  const [comics, setComics] = useState([]);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [selectedComic, setSelectedComic] = useState(null);
  const [filterType, setFilterType] = useState('year');
  const [showLabels, setShowLabels] = useState(false);
  const [groupColors, setGroupColors] = useState({});

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

    const groupMap = {};
    const nodes = comics.map((comic) => {
      let groupKey;
      switch (filterType) {
        case 'year':
          groupKey = comic.cover_date?.slice(0, 4);
          break;
        case 'series':
          groupKey = comic.volume?.name;
          break;
        case 'publisher':
          groupKey = comic.publisher;
          break;
        case 'genre':
          groupKey = (comic.genres && comic.genres[0]) || 'Unknown';
          break;
        case 'characters':
          groupKey = (comic.characters && comic.characters[0]) || 'Unknown';
          break;
        case 'authors':
          groupKey = (comic.authors && comic.authors[0]) || 'Unknown';
          break;
        default:
          groupKey = 'Unknown';
      }

      if (!groupMap[groupKey]) {
        groupMap[groupKey] = getRandomColor();
      }

      return {
        id: comic.id,
        image: comic.firebaseImage || comic.preferredCover,
        comic,
        groupKey,
        color: groupMap[groupKey]
      };
    });

    const links = generateLinks(nodes, filterType);
    setGroupColors(groupMap);
    setGraphData({ nodes, links });
  }, [comics, filterType]);

  const generateLinks = (nodes, type) => {
    const links = [];
    const groups = {};

    nodes.forEach((node) => {
      const key = node.groupKey;
      if (!key) return;
      if (!groups[key]) groups[key] = [];
      groups[key].push(node);
    });

    Object.values(groups).forEach((group) => {
      for (let i = 0; i < group.length - 1; i++) {
        links.push({
          source: group[i].id,
          target: group[i + 1].id,
          color: group[i].color
        });
      }
    });

    return links;
  };

  const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 100%, 70%)`;
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Header />

      <div style={{ position: 'absolute', top: 70, left: 20, zIndex: 10 }}>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ fontSize: '1rem', padding: '0.5rem', borderRadius: '6px' }}
        >
          <option value="year">Group by Year</option>
          <option value="series">Group by Series</option>
          <option value="publisher">Group by Publisher</option>
          <option value="genre">Group by Genre</option>
          <option value="characters">Group by Characters</option>
          <option value="authors">Group by Authors</option>
        </select>

        <button
          onClick={() => setShowLabels((prev) => !prev)}
          style={{
            marginLeft: '1rem',
            padding: '0.5rem',
            borderRadius: '6px',
            fontSize: '0.9rem'
          }}
        >
          {showLabels ? 'Hide Labels' : 'Show Labels'}
        </button>
      </div>

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

      <ForceGraph3D
        graphData={graphData}
        nodeThreeObject={(node) => {
          const group = new THREE.Group();

          const texture = new THREE.TextureLoader().load(node.image);
          const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            depthTest: true,
            depthWrite: true,
          });
          const sprite = new THREE.Sprite(spriteMaterial);
          sprite.scale.set(8, 12, 1);
          sprite.renderOrder = 1;

          const glowCanvas = document.createElement('canvas');
          glowCanvas.width = glowCanvas.height = 128;
          const ctx = glowCanvas.getContext('2d');
          const gradient = ctx.createRadialGradient(64, 64, 10, 64, 64, 64);
          gradient.addColorStop(0, node.color);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 128, 128);

          const glowTexture = new THREE.CanvasTexture(glowCanvas);
          const glowMaterial = new THREE.SpriteMaterial({
            map: glowTexture,
            transparent: true,
            depthWrite: false,
            depthTest: true,
          });
          const glow = new THREE.Sprite(glowMaterial);
          glow.scale.set(16, 16, 1);
          glow.position.set(0, 0, -0.01);

          group.add(glow);
          group.add(sprite);

          return group;
        }}
        linkColor={(link) => link.color || '#ffffff'}
        linkWidth={1}
        onNodeClick={(node) => setSelectedComic(node.comic)}
        enableNodeHover={false}
        nodeLabel={(node) => (showLabels ? node.comic.name || `#${node.comic.issue_number}` : '')}
      />
    </div>
  );
}
