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

    const colorMap = {};
    const nodes = [];
    const links = [];

    const addColor = (key) => {
      if (!colorMap[key]) {
        colorMap[key] = getRandomColor();
      }
      return colorMap[key];
    };

    comics.forEach((comic) => {
      const comicNode = {
        id: `comic-${comic.id}`,
        image: comic.firebaseImage || comic.preferredCover,
        comic,
        type: 'comic',
        groupKey: comic.id,
        color: '#ffffff', // default, overridden by connections
      };
      nodes.push(comicNode);

      let groupValues = [];

      switch (filterType) {
        case 'year':
          groupValues = [comic.cover_date?.slice(0, 4) || 'Unknown Year'];
          break;
        case 'series':
          groupValues = [comic.volume?.name || 'Unknown Series'];
          break;
        case 'publisher':
          groupValues = [comic.publisher || 'Unknown Publisher'];
          break;
        case 'genre':
          groupValues = comic.genres?.length ? comic.genres : ['Unknown Genre'];
          break;
        case 'characters':
          groupValues = comic.characters?.length ? comic.characters : ['Unknown Character'];
          break;
        case 'authors':
          groupValues = comic.authors?.length ? comic.authors : ['Unknown Author'];
          break;
        default:
          groupValues = ['Unknown'];
      }

      groupValues.forEach((group) => {
        const color = addColor(group);
        const groupNodeId = `${filterType}-${group}`;

        // If not already added
        if (!nodes.find((n) => n.id === groupNodeId)) {
          nodes.push({
            id: groupNodeId,
            name: group,
            type: 'group',
            color,
          });
        }

        links.push({
          source: groupNodeId,
          target: comicNode.id,
          color,
        });

        // Assign comic color to match its main group (first groupValue)
        if (groupValues[0] === group) {
          comicNode.color = color;
        }
      });
    });

    setGroupColors(colorMap);
    setGraphData({ nodes, links });
  }, [comics, filterType]);

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
          // CHARACTER / GROUP NODES — label only
          if (node.type === 'group') {
            const canvas = document.createElement('canvas');
            canvas.width = canvas.height = 256;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = node.color || '#ffffff';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(node.name, 128, 128);
            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
            const sprite = new THREE.Sprite(material);
            sprite.scale.set(16, 8, 1);
            return sprite;
          }

          // COMIC NODES — with glow
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
          const safeColor = node.color || '#ffffff';
          gradient.addColorStop(0, safeColor);
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
        onNodeClick={(node) => {
          if (node.comic) {
            setSelectedComic(node.comic);
          }
        }}
        enableNodeHover={false}
        nodeLabel={(node) => showLabels ? (node.comic?.name || node.name || '') : ''}
      />
    </div>
  );
}
